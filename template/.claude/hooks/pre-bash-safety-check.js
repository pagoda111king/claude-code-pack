#!/usr/bin/env node
/**
 * PreToolUse hook · Intercept dangerous Bash commands at runtime
 *
 * More flexible than the static deny list in settings.json:
 * - Can make dynamic decisions based on command pattern + environment + time
 * - Can provide specific warnings + suggestions (not just rejection)
 *
 * Triggered: Every time Claude is about to run a Bash command
 *
 * Input: stdin JSON · { tool_name, tool_input: { command, description } }
 *
 * Output: JSON
 * - Allow: {"decision": "approve"} or exit code 0 with no output
 * - Warn (still allow): {"hookSpecificOutput": {...}}
 * - Block: {"decision": "block", "reason": "..."}
 *
 * Principles:
 * - Only block truly dangerous commands · don't annoy the user
 * - When blocking, suggest "are you trying to do X?"
 * - Never crash (silently allow on stdin parse failure)
 */

const fs = require('fs');
const path = require('path');

// ========== Dangerous Patterns ==========

// 🔴 Hard block (cannot be overridden by settings.json)
const HARD_BLOCK = [
  {
    pattern: /\brm\s+-rf\s+\//,
    reason: 'rm -rf / · would delete the entire filesystem',
  },
  {
    pattern: /\brm\s+-rf\s+~\s*$/,
    reason: 'rm -rf ~ · would delete the entire home directory',
  },
  {
    pattern: /\b:(){ *:\|:& *};:/,
    reason: 'fork bomb · would freeze the system',
  },
  {
    pattern: /\bdd\s+.*of=\/dev\/[hs]d[a-z]/,
    reason: 'dd writing to physical disk · would destroy the disk',
  },
  {
    pattern: /\bmkfs\b/,
    reason: 'mkfs · formats a disk',
  },
  {
    pattern: /\bchmod\s+-R\s+777\s+\//,
    reason: 'chmod -R 777 / · opens permissions on the entire system',
  },
];

// 🟡 Warn (allow but remind)
const WARN = [
  {
    pattern: /\bgit\s+push\s+.*--force/,
    reason: 'git push --force · overwrites remote history · collaborators may lose code',
    suggest: 'Confirm this is your own branch · or use --force-with-lease for safety',
  },
  {
    pattern: /\bgit\s+reset\s+--hard/,
    reason: 'git reset --hard · discards all local uncommitted changes',
    suggest: 'If you only need to revert a commit · use git revert (preserves history)',
  },
  {
    pattern: /\bnpm\s+publish/,
    reason: 'npm publish · publishes the package to the public registry',
    suggest: 'Verify package.json private / version / registry settings are correct',
  },
  {
    pattern: /\bcurl\s+.*\|\s*(bash|sh|zsh|fish)/,
    reason: 'curl | bash pattern · executes an unverified remote script',
    suggest: 'Download the script first to inspect its contents · then run locally',
  },
  {
    pattern: /\bsudo\s+/,
    reason: 'sudo · privilege escalation',
    suggest: 'Confirm necessity · avoid sudo during project development when possible',
  },
];

// 🟢 Info (just FYI)
const INFO = [
  {
    pattern: /\bgit\s+commit\s+.*--no-verify/,
    info: 'git commit --no-verify skips pre-commit hooks · confirm this is intentional',
  },
  {
    pattern: /\bnpm\s+install\s+-g\b/,
    info: 'Global install · may affect other projects · consider npx or project-local install',
  },
];

// ========== Context Awareness ==========

function isSensitivePath(cmd) {
  // Operations involving .env · secrets · credentials
  const sensitivePatterns = [
    /\.env(\.|\s|$)/,
    /\bsecrets?\//,
    /\bcredentials?/,
    /\.key(\s|$)/,
    /\bpasswd?\b/,
  ];
  return sensitivePatterns.some((p) => p.test(cmd));
}

function isProductionDeploy(cmd) {
  // Operations involving production deployment
  return /\b(production|prod|release|deploy)\b/i.test(cmd);
}

// ========== Main Logic ==========

function main() {
  let input;
  try {
    const raw = fs.readFileSync(0, 'utf8');
    input = JSON.parse(raw);
  } catch {
    // Parse failure · silently allow (avoid blocking user workflow)
    process.exit(0);
  }

  const tool = input.tool_name || input.toolName;
  if (tool !== 'Bash') {
    process.exit(0);
  }

  const command = input.tool_input?.command || input.toolInput?.command || '';
  if (!command) {
    process.exit(0);
  }

  // Check 1 · Hard block
  for (const rule of HARD_BLOCK) {
    if (rule.pattern.test(command)) {
      const output = {
        decision: 'block',
        reason: `🔴 Hard block: ${rule.reason}\n\nCommand: ${command}\n\nIf you're sure you need to do this · run it manually in your terminal (not through Claude).`,
      };
      process.stdout.write(JSON.stringify(output));
      process.exit(0);
    }
  }

  // Check 2 · Warn (allow but add context)
  const warnings = [];
  for (const rule of WARN) {
    if (rule.pattern.test(command)) {
      warnings.push(`⚠️ ${rule.reason}\n   Suggestion: ${rule.suggest}`);
    }
  }

  // Check 3 · Sensitive path + production
  if (isSensitivePath(command) && /\b(rm|mv|cat|cp|chmod)\b/.test(command)) {
    warnings.push(
      `⚠️ Operation involves sensitive files (.env / secrets / credentials)\n   Confirm nothing will be leaked · nothing will be tracked in git`
    );
  }

  if (isProductionDeploy(command)) {
    warnings.push(
      `⚠️ Involves production deployment\n   Confirm you've run /eval + /security-reviewer + ship-checklist`
    );
  }

  // Check 4 · Info (low priority hints)
  const infos = [];
  for (const rule of INFO) {
    if (rule.pattern.test(command)) {
      infos.push(`ℹ️ ${rule.info}`);
    }
  }

  // Assemble output
  if (warnings.length > 0 || infos.length > 0) {
    const lines = [];
    if (warnings.length > 0) {
      lines.push(...warnings);
      lines.push('');
    }
    if (infos.length > 0) {
      lines.push(...infos);
    }

    const output = {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        additionalContext: lines.join('\n'),
      },
    };
    process.stdout.write(JSON.stringify(output));
    process.exit(0);
  }

  // No issues · silently allow
  process.exit(0);
}

main();