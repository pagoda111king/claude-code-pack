# scripts/hooks/ · Claude Code Hooks

> Solo Founder streamlined version. **Do not** replicate the complex plugin discovery mechanism of Operating Framework.
> Principles: absolute paths · zero magic · fail fast · pure Node CommonJS · zero dependencies.

---

## Currently Active Hooks

| Hook Event | Matcher | Script | Responsibility |
|---|---|---|---|
| `SessionStart` | - | `session-start.js` | Display status board at session start (date / last session / pipeline / assets / Operating Framework absorption / today's cost / pending candidates / available commands) |
| `PreToolUse` | Bash | `pre-bash-safety-check.js` | Intercept dangerous Bash commands (hard block `rm -rf` / etc. + warn on `git push --force` etc.) |
| `PreCompact` | - | `pre-compact-reminder.js` | Remind to run `/save-session` before compact |
| `Stop` | - | `stop-learning-reminder.js` | Conditionally remind `/save-session` + `/learn` at session end (only if not saved today) |

Registered in the `hooks` section of `.claude/settings.json`.

---

## Design Principles (Compared to Operating Framework)

| Dimension | Operating Framework Approach | Our Approach | Why |
|---|---|---|---|
| **Path Resolution** | Runtime plugin-bootstrap dynamically discovers plugin root directories | Hardcoded absolute paths | Solo Founder has only 1 project, no plugin ecosystem |
| **Dependencies** | References `scripts/lib/utils.js` / `plugin-hook-bootstrap.js` | Zero dependencies, only Node standard library | Easier debugging |
| **Error Handling** | Complex profile degradation (minimal/standard/strict) | Silent failure (try/catch returns null) | Don't let hooks block the user |
| **Performance** | Async + 10s timeout | Sync + 5s timeout · all scripts <50ms | Hooks must be fast |
| **Language** | CommonJS (avoid ESM interop issues) | CommonJS · consistent | No TS compilation step |
| **Line Count** | 50-200 lines per hook | <100 lines per hook | Easy to read and maintain |

---

## Hook Script Specification

**Must follow**:
- ✅ Use absolute paths (`path.resolve(__dirname, '..', '..')` to project root)
- ✅ Wrap all file reads in `try/catch`, return `null` on failure
- ✅ Call `process.exit(0)` at end of main function (even on internal errors)
- ✅ Time budget 50ms (especially for SessionStart)

**Forbidden**:
- ❌ Network/API calls (blocks session startup)
- ❌ File writes (hooks should be "read-only", not "write")
- ❌ npm package dependencies (this `hooks/` directory has no package.json)
- ❌ Uncaught errors (pollutes Claude context)

---

## Testing

Each hook script can be tested manually:

```bash
echo '{}' | node scripts/hooks/session-start.js
echo '{}' | node scripts/hooks/pre-compact-reminder.js
```

Output should be valid JSON, like:

```json
{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"..."}}
```

---

## Steps to Add a New Hook

1. Confirm the **real pain point** this hook solves (don't guess requirements)
2. Create `<name>.js` in this directory, reuse the structure from `session-start.js`
3. Test manually (`echo '{}' | node <name>.js`)
4. Add to the `hooks` section of `.claude/settings.json`
5. Update the "Currently Active Hooks" table in this README

---

## Potential Future Hooks (Don't Build Prematurely)

Following Operating Framework's reference library policy, add these hooks **only when you encounter the real pain point**:

- `Stop` · Session end reminder for `/save-session` (wait until "forgot to save" becomes a pain point)
- `PostToolUse` Edit/Write · Auto prettier (wait until codebase ≥1k lines)
- `UserPromptSubmit` · Keyword alerts (wait until 3+ similar errors)
- `PreToolUse` Bash · Dangerous command confirmation (useful under `defaultMode=acceptEdits`)

**Skip** (Operating Framework has them, we don't need):
- continuous-learning observer (high cost)
- governance-capture (Solo Founder has no compliance requirements)
- Multi-profile switching (minimal/standard/strict is over-engineering)

---

## Troubleshooting

**Hook not triggering?**
- Check `.claude/settings.json` hooks section syntax (use a JSON linter)
- Verify script path is accessible: `ls $HOME/solo-founder/scripts/hooks/`
- Check Claude Code logs: `~/.claude/logs/`

**Hook output polluting the conversation?**
- Scripts must never `console.log` plain strings — only `process.stdout.write(JSON.stringify(...))`
- stderr can contain debug info, it won't enter Claude context

**Hook timeout?**
- Default timeout is 5s · timeouts are silently terminated
- Use `time node scripts/hooks/<name>.js <<< '{}'` to measure actual runtime