#!/usr/bin/env node
/**
 * Stop hook · conditional reminder at session end (not always nag)
 *
 * 4.7 era update: no longer defaults to prompting /save-session · only reminds when truly worthwhile
 * Rationale: Claude 4.7's 1M context + auto-memory already provides a safety net · manual save is rarely needed at Stop
 *
 * Trigger rules:
 * - Session saved today → exit silently
 * - Learning candidate exists today → exit silently (indicates knowledge already captured)
 * - If neither applies + this session has significant modifications (inferred) → only then remind
 *
 * Principles:
 * - Never block · never exit != 0
 * - Silent exit is better than false reminder (false reminders cause founders to ignore real ones)
 * - 4.7 era · trust auto-memory · don't reinvent the memory stack
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

function hasTodaySession() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const sessionsDir = path.join(ROOT, 'docs/sessions');
    if (!fs.existsSync(sessionsDir)) return false;
    return fs
      .readdirSync(sessionsDir)
      .some((f) => f.startsWith(today) && f.endsWith('.md'));
  } catch {
    return false;
  }
}

function hasTodayLearning() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const candidatesDir = path.join(ROOT, 'docs/learnings/candidates');
    if (!fs.existsSync(candidatesDir)) return false;
    return fs
      .readdirSync(candidatesDir)
      .some(
        (f) => f.startsWith(today) && f.endsWith('.md') && f !== 'README.md'
      );
  } catch {
    return false;
  }
}

function countRecentEdits() {
  // Rough estimate of "substantial changes in this session"
  // Scans project files modified in the last 30 minutes (excludes .git / node_modules / build output)
  try {
    const cutoff = Date.now() - 30 * 60 * 1000; // 30 minutes ago
    let count = 0;

    function walk(dir, depth) {
      if (depth > 4) return; // limit depth to prevent hangs
      let entries;
      try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
      } catch {
        return;
      }
      for (const e of entries) {
        if (e.name.startsWith('.')) continue;
        if (
          ['node_modules', '.next', 'dist', 'build', 'coverage'].includes(e.name)
        )
          continue;
        const p = path.join(dir, e.name);
        if (e.isDirectory()) {
          walk(p, depth + 1);
        } else if (e.isFile()) {
          try {
            if (fs.statSync(p).mtimeMs > cutoff) count++;
          } catch {}
        }
        if (count > 30) return; // enough · no need to continue counting
      }
    }

    walk(ROOT, 0);
    return count;
  } catch {
    return 0;
  }
}

function main() {
  // 4.7 era rule: if session already saved today OR learning exists · exit silently
  if (hasTodaySession() || hasTodayLearning()) {
    process.exit(0);
  }

  // If no significant modifications in last 30 minutes (< 5 files) · exit silently (small session doesn't need nag)
  const recentEdits = countRecentEdits();
  if (recentEdits < 5) {
    process.exit(0);
  }

  // Only remind when: no save today + no learning today + recent substantial changes
  const lines = [];
  lines.push('');
  lines.push(`👋 This session modified ${recentEdits}+ files in the last 30 minutes · no save yet today`);
  lines.push('');
  lines.push('4.7 era philosophy: save only at a real handoff (project delivery / machine switch / long break).');
  lines.push('If this is a **natural stopping point** · consider:');
  lines.push('');
  lines.push('  📝 `/save-session`  · write a memo (the kind you\'ll still reference 3 months from now)');
  lines.push('  💡 `/learn`         · if you repeatedly corrected or overturned assumptions · extract 1-3 insights');
  lines.push('');
  lines.push('If just taking a break and continuing later · **walk away** · auto-memory has your back.');

  const output = {
    hookSpecificOutput: {
      hookEventName: 'Stop',
      additionalContext: lines.join('\n'),
    },
  };

  process.stdout.write(JSON.stringify(output));
  process.exit(0);
}

main();