---
sidebar_position: 2
title: VS Code Extension
---

# VS Code Extension

Get real-time HIPAA compliance feedback as you write code with the vlayer VS Code extension.

## Installation

### From Marketplace

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "vlayer"
4. Click Install

### From Command Line

```bash
code --install-extension vlayer.vlayer-vscode
```

## Features

### Real-time Diagnostics

Issues appear as you type:

- **Red squiggles** - Critical/High severity
- **Yellow squiggles** - Medium severity
- **Blue squiggles** - Low severity (hints)

### Problems Panel

View all findings in the Problems panel (Ctrl+Shift+M):

```
PROBLEMS
  src/api/patients.ts
    ⊗ [vlayer] Potential SSN pattern found (line 45)
    ⊗ [vlayer] MD5 hash algorithm detected (line 23)
  src/utils/validate.ts
    ⚠ [vlayer] Missing audit logging (line 12)
```

### Hover Information

Hover over highlighted code to see:
- Issue description
- HIPAA reference
- Remediation guidance

### Quick Fixes

Click the lightbulb or press Ctrl+. for quick fixes:

- Replace MD5 with SHA-256
- Add audit logging
- Move secrets to environment variables

### Code Actions

Right-click for vlayer actions:
- Ignore this line
- Ignore this file
- View HIPAA reference

## Configuration

### Extension Settings

Open Settings (Ctrl+,) and search for "vlayer":

| Setting | Default | Description |
|---------|---------|-------------|
| `vlayer.enable` | `true` | Enable/disable extension |
| `vlayer.severity` | `low` | Minimum severity to show |
| `vlayer.runOnSave` | `true` | Scan on file save |
| `vlayer.runOnType` | `true` | Scan as you type |
| `vlayer.debounceMs` | `500` | Delay before scanning |

### Settings JSON

```json
{
  "vlayer.enable": true,
  "vlayer.severity": "medium",
  "vlayer.runOnSave": true,
  "vlayer.runOnType": true,
  "vlayer.debounceMs": 300,
  "vlayer.configPath": ".vlayerrc.json"
}
```

### Workspace Settings

Configure per-project in `.vscode/settings.json`:

```json
{
  "vlayer.enable": true,
  "vlayer.severity": "low",
  "vlayer.exclude": [
    "**/test/**"
  ]
}
```

## Commands

Access via Command Palette (Ctrl+Shift+P):

| Command | Description |
|---------|-------------|
| `vlayer: Scan Current File` | Scan active file |
| `vlayer: Scan Workspace` | Scan entire workspace |
| `vlayer: Show Output` | View extension logs |
| `vlayer: Clear Diagnostics` | Clear all findings |
| `vlayer: Toggle Enable` | Enable/disable extension |

## Status Bar

The status bar shows scan status:

- ✓ **vlayer** - No issues found
- ⚠ **vlayer (3)** - 3 findings in current file
- ⊗ **vlayer** - Critical issues found
- ◷ **vlayer** - Scanning...

Click to view details.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+H` | Scan current file |
| `F8` | Go to next problem |
| `Shift+F8` | Go to previous problem |

Customize in Keyboard Shortcuts (Ctrl+K Ctrl+S).

## Integration with CLI

The extension uses the same configuration as the CLI:

```json
// .vlayerrc.json - used by both
{
  "exclude": ["**/test/**"],
  "severity": "medium"
}
```

## Troubleshooting

### Extension Not Working

1. Check Output panel (View → Output → vlayer)
2. Verify vlayer is installed: `npm list -g verification-layer`
3. Check extension is enabled in Settings

### Performance Issues

If scanning is slow:

1. Increase debounce time:
   ```json
   { "vlayer.debounceMs": 1000 }
   ```

2. Disable scan-on-type:
   ```json
   { "vlayer.runOnType": false }
   ```

3. Exclude large directories:
   ```json
   { "vlayer.exclude": ["**/node_modules/**", "**/dist/**"] }
   ```

### False Positives

Use inline ignores:

```typescript
// vlayer-ignore-next-line
const testSSN = "123-45-6789";
```

Or configure file excludes in settings.

## See Also

- [Configuration](../configuration/) - Full configuration options
- [Ignore Patterns](../configuration/ignore-patterns) - Suppress findings
