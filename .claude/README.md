# Claude Configuration

This directory contains configuration files for Claude Code.

## Files

- **config.json**: Main configuration file for project settings
- **ignore**: Files and directories to exclude from Claude's context
- **commands/**: Custom slash commands directory

## Custom Commands

Add custom slash commands by creating markdown files in the `commands/` directory.

Example: `.claude/commands/review.md`
```markdown
Review the current code for:
- Type safety issues
- Performance improvements
- Best practices
```

Then use with: `/review`

## Configuration Options

Edit `config.json` to customize:
- Build commands
- Project paths
- Preferences
- Auto-commit behavior
