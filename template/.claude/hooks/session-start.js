#!/usr/bin/env node
/**
 * SessionStart hook · Display status board when session starts
 *
 * Outputs additionalContext so the first message of a new session includes:
 * - Today's date
 * - Last session memo summary
 * - Pipeline active count + tasks due today
 * - Available command hints
 *
 * Principles:
 * - Completes in < 50ms, does not block session startup
 * - Fails silently (no error if file missing)
 * - Outputs no more than 15 lines (context is a resource)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

function readLatestSession() {
  try {
    const indexPath = path.join(ROOT, 'docs/sessions/INDEX.md');
    const raw = fs.readFileSync(indexPath, 'utf8');
    const match = raw.match(/^- \[([^\]]+)\]\(([^)]+)\)\s*—\s*(.+?)$/m);
    if (!match) return null;
    return { title: match[1], file: match[2], meta: match[3] };
  } catch {
    return null;
  }
}

function countActivePipeline() {
  try {
    const raw = fs.readFileSync(path.join(ROOT, 'docs/pipeline.md'), 'utf8');
    const lines = raw.split('\n');
    let inActiveStage = false;
    let count = 0;
    for (const line of lines) {
      if (line.match(/^### ([1-6]) ·/)) {
        inActiveStage = true;
        continue;
      }
      if (line.match(/^##+ /)) {
        inActiveStage = false;
        continue;
      }
      if (inActiveStage && line.match(/^- /)) count++;
    }
    return count;
  } catch {
    return null;
  }
}

function countDueToday() {
  try {
    const raw = fs.readFileSync(path.join(ROOT, 'docs/pipeline.md'), 'utf8');
    const today = new Date().toISOString().slice(0, 10);
    const re = /\b(\d{4}-\d{2}-\d{2})\b/g;
    let overdue = 0;
    let dueToday = 0;
    for (const line of raw.split('\n')) {
      if (!line.startsWith('-')) continue;
      const matches = [...line.matchAll(re)];
      for (const m of matches) {
        if (m[1] < today) overdue++;
        else if (m[1] === today) dueToday++;
      }
    }
    return { overdue, dueToday };
  } catch {
    return null;
  }
}

function countAssets() {
  try {
    const agentsDir = path.join(ROOT, '.claude/agents');
    const skillsDir = path.join(ROOT, '.claude/skills');
    const agentEssenceDir = path.join(
      ROOT,
      'docs/ecc-absorption/essence/agents'
    );
    const skillEssenceDir = path.join(
      ROOT,
      'docs/ecc-absorption/essence/skills'
    );
    const agents = fs.existsSync(agentsDir)
      ? fs.readdirSync(agentsDir).filter((f) => f.endsWith('.md')).length
      : 0;
    const skills = fs.existsSync(skillsDir)
      ? fs
          .readdirSync(skillsDir, { withFileTypes: true })
          .filter((e) => e.isDirectory()).length
      : 0;
    const agentEssence = fs.existsSync(agentEssenceDir)
      ? fs
          .readdirSync(agentEssenceDir)
          .filter((f) => f.endsWith('.md') && f !== 'README.md').length
      : 0;
    const skillEssence = fs.existsSync(skillEssenceDir)
      ? fs
          .readdirSync(skillEssenceDir)
          .filter((f) => f.endsWith('.md') && f !== 'README.md').length
      : 0;
    return { agents, skills, agentEssence, skillEssence };
  } catch {
    return null;
  }
}

function countPendingCandidates() {
  try {
    const dir = path.join(ROOT, 'docs/learnings/candidates');
    if (!fs.existsSync(dir)) return 0;
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.md') && f !== 'README.md').length;
  } catch {
    return 0;
  }
}

function estimateTodayCost() {
  try {
    const estimatePath = path.join(ROOT, 'scripts/cost/session-estimate.js');
    if (!fs.existsSync(estimatePath)) return null;
    // Direct require instead of shelling out (faster)
    const { estimate } = require(estimatePath);
    const result = estimate({ scope: 'today' });
    if (result.error || result.message_count === 0) return null;
    return {
      usd: result.cost_usd,
      cny: result.cost_usd * 7.2,
      messages: result.message_count,
    };
  } catch {
    return null;
  }
}

function main() {
  const today = new Date().toISOString().slice(0, 10);
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
    new Date().getDay()
  ];

  const session = readLatestSession();
  const activeCount = countActivePipeline();
  const due = countDueToday();
  const assets = countAssets();
  const pendingCandidates = countPendingCandidates();
  const manifest = countManifestStatus();
  const cost = estimateTodayCost();

  const lines = [];
  lines.push(`📅 ${today} · ${weekday} · Solo Founder Workbench`);

  if (session) {
    lines.push(`📂 Last session: ${session.title}`);
    lines.push(`   → Resume context: /resume-session`);
  } else {
    lines.push(`📂 No session history yet · /save-session to start accumulating`);
  }

  const statusBits = [];
  if (activeCount !== null) statusBits.push(`Pipeline active ${activeCount}`);
  if (due) {
    if (due.overdue > 0) statusBits.push(`⚠️ Overdue ${due.overdue}`);
    if (due.dueToday > 0) statusBits.push(`Due today ${due.dueToday}`);
  }
  if (assets) {
    const agentCoverage = `${assets.agents}/${assets.agents}`; // Default full coverage
    const ess = `agents ${assets.agents}(essence ${assets.agentEssence}) · skills ${assets.skills}(essence ${assets.skillEssence})`;
    statusBits.push(ess);
  }
  if (statusBits.length > 0) {
    lines.push(`📊 ${statusBits.join(' · ')}`);
  }

  if (manifest) {
    lines.push(
      `🎯 Operating Framework absorption: 🟢 ${manifest.green} · 🟡 ${manifest.yellow} · 🔴 ${manifest.red}`
    );
  }

  if (cost && cost.usd > 0.01) {
    const warn = cost.usd > 50 ? ' ⚠️' : cost.usd > 200 ? ' 🚨' : '';
    lines.push(
      `💰 Today's Claude cost: $${cost.usd.toFixed(2)} (≈¥${cost.cny.toFixed(0)})${warn} · /cost`
    );
  }

  if (pendingCandidates > 0) {
    lines.push(
      `💡 Learning candidates: ${pendingCandidates} pending review · /learn-review`
    );
  }

  lines.push('');
  lines.push(
    '💡 Commands: /save-session /resume-session /learn /learn-review /eval /cost'
  );

  const output = {
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: lines.join('\n'),
    },
  };

  process.stdout.write(JSON.stringify(output));
  process.exit(0);
}

main();