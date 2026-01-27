---
sidebar_position: 2
title: Installation
---

# Installation

vlayer can be installed globally via npm, or run directly with npx without installation.

## Requirements

- **Node.js** 18.0 or later
- **npm** 8.0 or later (or yarn/pnpm)

## Global Installation

Install vlayer globally to use it from anywhere:

```bash
npm install -g verification-layer
```

Verify the installation:

```bash
vlayer --version
```

## Using npx (No Installation)

Run vlayer directly without installing:

```bash
npx vlayer scan ./your-project
```

This is useful for one-off scans or CI/CD pipelines where you don't want to manage global packages.

## Project-Local Installation

Add vlayer as a dev dependency for your project:

```bash
npm install --save-dev verification-layer
```

Then add a script to your `package.json`:

```json
{
  "scripts": {
    "hipaa-scan": "vlayer scan .",
    "hipaa-report": "vlayer scan . -f html -o hipaa-report.html"
  }
}
```

Run with:

```bash
npm run hipaa-scan
```

## Updating

Update to the latest version:

```bash
# Global installation
npm update -g verification-layer

# Project-local installation
npm update verification-layer
```

## Uninstalling

Remove vlayer:

```bash
# Global installation
npm uninstall -g verification-layer

# Project-local installation
npm uninstall verification-layer
```

## Troubleshooting

### Permission Errors on Linux/macOS

If you get permission errors with global installation, either:

1. Use a Node version manager like [nvm](https://github.com/nvm-sh/nvm)
2. Configure npm to use a different directory:

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Node.js Version Issues

vlayer requires Node.js 18+. Check your version:

```bash
node --version
```

If you need to upgrade, use [nvm](https://github.com/nvm-sh/nvm) or download from [nodejs.org](https://nodejs.org).

## Next Steps

Now that vlayer is installed, proceed to the [Quick Start](./quick-start) guide to run your first scan.
