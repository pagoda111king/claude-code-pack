# Install Guide · Solo Founder OS

> Time: 60 seconds · Difficulty: copy-paste

---

## Prerequisites

- macOS / Linux / WSL2 (Windows native works but hooks need Node)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed
- Node.js ≥ 18 (only for hooks · agents/skills/commands work without)

---

## 60-second install

```bash
# 1. Clone
git clone https://github.com/pagoda111king/claude-code-pack.git
cd claude-code-pack

# 2. Backup existing config (in case you have stuff there)
[ -d ~/.claude ] && cp -r ~/.claude ~/.claude.bak.$(date +%s)

# 3. Install
mkdir -p ~/.claude/{agents,skills,commands,hooks}
cp template/.claude/agents/*.md     ~/.claude/agents/
cp -r template/.claude/skills/*     ~/.claude/skills/
cp template/.claude/commands/*.md   ~/.claude/commands/
cp template/.claude/hooks/*         ~/.claude/hooks/
cp template/CLAUDE.md               ~/.claude/CLAUDE.md

# 4. Customize (one file · 5 minutes · then forget about it)
$EDITOR ~/.claude/CLAUDE.md
# Fill in: your role · runway · channels · entity · API budget

# 5. Wire up hooks (only if you want session-start board · safety checks · etc.)
cat > ~/.claude/settings.json <<'EOF'
{
  "hooks": {
    "SessionStart": [
      { "type": "command", "command": "node ~/.claude/hooks/session-start.js" }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "type": "command",
        "command": "node ~/.claude/hooks/pre-bash-safety-check.js"
      }
    ],
    "PreCompact": [
      { "type": "command", "command": "node ~/.claude/hooks/pre-compact-reminder.js" }
    ],
    "Stop": [
      { "type": "command", "command": "node ~/.claude/hooks/stop-learning-reminder.js" }
    ]
  }
}
EOF

# 6. Verify
# Open a Claude Code session in any project · type:
#   /cost
# If you see today's API spend → you're live ✅
```

---

## Per-project overrides (optional)

Want different rules for different products? Drop a project-local `CLAUDE.md`:

```bash
cd ~/projects/my-saas
echo "# Project: My SaaS\nStack: Next.js + Supabase + Stripe" > CLAUDE.md
```

Project `CLAUDE.md` **stacks on top of** `~/.claude/CLAUDE.md` — you keep the global operating manual + add project-specific context.

---

## Customizing agents / skills / commands

All 36 components are **plain markdown** — read them · edit them · delete what you don't use.

```bash
# View an agent
cat ~/.claude/agents/planner.md

# Edit it (change tone · add tools · adjust principles)
$EDITOR ~/.claude/agents/planner.md

# Delete one you don't use
rm ~/.claude/agents/marketing.md
```

**No registration · no DB · no compile step**. Claude Code reads markdown directly.

---

## Slash commands · how they work

After install · type `/` in Claude Code to see all 10 commands. Each one:
1. Reads its `.md` file from `~/.claude/commands/`
2. Executes the workflow described
3. Reports back

Example: `/save-session` reads `commands/save-session.md` → runs the save-session workflow → writes a memo to `docs/sessions/`.

---

## Adding your own

Use `/skill-create` (the meta-skill that creates new skills):

```
You: /skill-create
Claude: [walks through creating a new skill · YAML frontmatter + body]
```

Or copy any existing skill as a template:

```bash
cp -r ~/.claude/skills/idea-eval ~/.claude/skills/my-new-skill
$EDITOR ~/.claude/skills/my-new-skill/SKILL.md
```

---

## Updating

When new versions ship · grab the latest:

```bash
cd /path/to/claude-code-pack
git pull
# Re-run step 3 of install · your CLAUDE.md is preserved
```

I won't auto-overwrite your customized agents · you can opt-in to specific updates.

---

## Uninstall

```bash
rm -rf ~/.claude
mv ~/.claude.bak.<timestamp> ~/.claude  # restore old
```

---

## Troubleshooting

**"Hooks aren't firing"**
- Check `~/.claude/settings.json` exists and has the right hooks block
- `ls -la ~/.claude/hooks/` · all 5 files present
- Run a hook manually: `node ~/.claude/hooks/session-start.js` · should print state board

**"/cost shows nothing"**
- `commands/cost.md` is just a markdown spec · Claude Code interprets it
- If `/cost` doesn't appear in slash menu · session needs restart

**"My customizations got overwritten"**
- Step 2 backups to `~/.claude.bak.<timestamp>` — your old config is there
- For future updates · git pull only · don't re-run step 3 unconditionally

---

## Help

- Bug / feature request: open issue on GitHub
- 1:1 setup help (Founder tier): email founder@example.com · book a call
