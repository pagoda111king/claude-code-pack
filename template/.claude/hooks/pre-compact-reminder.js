#!/usr/bin/env node
/**
 * PreCompact hook · compression event notification (not an alert)
 *
 * 4.7 era update: 4.7 has 1M context · auto-compaction rarely triggers
 * When it does trigger · it means this session is genuinely large · high information density
 * But 4.7's compaction is also intelligent · not "memory loss" · no need to panic-save
 *
 * Principles:
 * - Shift from "emergency alert" to "event notification"
 * - Only suggest save-session in true handoff scenarios
 * - Never blocking · never exit != 0
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

function hasRecentSession() {
  try {
    const indexPath = path.join(ROOT, 'docs/sessions/INDEX.md');
    const raw = fs.readFileSync(indexPath, 'utf8');
    const match = raw.match(/^- \[(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})/m);
    if (!match) return false;
    const sessionDate = new Date(`${match[1]}T${match[2]}:00`);
    const hoursAgo = (Date.now() - sessionDate.getTime()) / (60 * 60 * 1000);
    return hoursAgo < 12; // expanded to 12 hours (long sessions may not have triggered first save yet)
  } catch {
    return false;
  }
}

function main() {
  const freshMemory = hasRecentSession();

  const lines = [
    '📦 Context about to auto-compact · 4.7 will intelligently summarize',
    '',
  ];

  if (freshMemory) {
    lines.push('✅ Session memo within 12h · key state persisted · keep going');
  } else {
    lines.push('ℹ️ No session memo within 12h · but auto-memory + truth source docs (CLAUDE.md / system-memory.md) already');
    lines.push('   cover most important information for you.');
    lines.push('');
    lines.push('   Only /save-session now in these **true handoff** scenarios:');
    lines.push('   - Project delivery point / switching machines / long break');
    lines.push('   - Major strategic decision you will want to look up 3 months later');
    lines.push('   - Someone else is taking over');
    lines.push('');
    lines.push('   Otherwise · keep working · compaction won\'t make you lose memory.');
  }

  const output = {
    hookSpecificOutput: {
      hookEventName: 'PreCompact',
      additionalContext: lines.join('\n'),
    },
  };

  process.stdout.write(JSON.stringify(output));
  process.exit(0);
}

main();