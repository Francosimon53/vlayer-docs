---
sidebar_position: 100
title: Contributing
---

# Contributing to vlayer

We welcome contributions from the community! Whether it's bug fixes, new features, documentation improvements, or custom scanner rules, your help makes vlayer better for everyone.

## Getting Started

### 1. Fork and Clone

```bash
git clone https://github.com/YOUR-USERNAME/verification-layer.git
cd verification-layer
npm install
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes

Follow our coding standards:
- Use TypeScript
- Follow existing code style
- Add tests for new functionality
- Update documentation as needed

### 4. Run Tests

```bash
npm run test        # Run all tests
npm run test:watch  # Watch mode
npm run lint        # Check linting
npm run typecheck   # Type checking
```

### 5. Submit a Pull Request

Push your branch and open a PR against `main`. Include:
- Clear description of changes
- Link to related issues
- Screenshots if applicable

## Development Setup

### Build the Project

```bash
npm run build    # Compile TypeScript
npm run dev      # Watch mode
```

### Run the CLI Locally

```bash
node dist/cli.js scan ./test-project
```

### Project Structure

```
verification-layer/
├── src/
│   ├── cli.ts           # CLI entry point
│   ├── scan.ts          # Scanner orchestration
│   ├── types.ts         # TypeScript types
│   ├── scanners/        # Scanner implementations
│   │   ├── phi/
│   │   ├── encryption/
│   │   ├── audit/
│   │   ├── access/
│   │   └── retention/
│   └── reporters/       # Report generators
├── tests/               # Test files
└── docs/                # Documentation
```

## Adding a New Scanner

1. Create a new directory in `src/scanners/`:

```
src/scanners/your-scanner/
├── index.ts       # Scanner implementation
├── patterns.ts    # Detection patterns
└── index.test.ts  # Tests
```

2. Implement the `Scanner` interface:

```typescript
import { Scanner, Finding } from '../../types';

export const yourScanner: Scanner = {
  name: 'your-scanner',
  category: 'your-category',

  async scan(files: string[]): Promise<Finding[]> {
    const findings: Finding[] = [];
    // Your scanning logic here
    return findings;
  }
};
```

3. Register in `src/scan.ts`:

```typescript
import { yourScanner } from './scanners/your-scanner';

const scanners = new Map([
  // ... existing scanners
  ['your-scanner', yourScanner],
]);
```

4. Add tests and documentation.

## Writing Tests

We use Vitest for testing:

```typescript
import { describe, it, expect } from 'vitest';
import { yourScanner } from './index';

describe('yourScanner', () => {
  it('should detect issues', async () => {
    const findings = await yourScanner.scan(['test-file.ts']);
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('HIGH');
  });
});
```

## Documentation

Documentation is in the `docs/` folder using Docusaurus:

```bash
cd docs
npm start    # Local dev server
npm run build # Build static site
```

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn

## Getting Help

- **Discord**: [Join our community](https://discord.gg/vlayer)
- **GitHub Discussions**: Ask questions
- **Issues**: Report bugs

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to vlayer!
