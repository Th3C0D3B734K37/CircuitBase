# Contributing to CircuitBase

Thank you for your interest in contributing to CircuitBase! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Basic knowledge of React, TypeScript, and Next.js
- Understanding of electronics components (helpful but not required)

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/circuitbase.git
   cd circuitbase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📝 Code Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow existing naming conventions:
  - Components: `PascalCase`
  - Functions/variables: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
- Use functional components with hooks
- Add proper TypeScript types (avoid `any`)

### React Best Practices

- Use functional components with hooks
- Prefer `const` over `let` when possible
- Use meaningful component and prop names
- Keep components small and focused

### Styling

- Use Tailwind CSS classes
- Follow existing design system
- Use the `cn()` utility for conditional classes
- Maintain responsive design patterns

## 🏗️ Project Structure

```
circuitbase/
├── components/          # React components
│   ├── AppContext.tsx  # Global state management
│   ├── DatabaseTab.tsx  # Component database view
│   ├── BomTab.tsx       # Bill of materials
│   ├── InventoryTab.tsx  # Inventory management
│   └── ...
├── lib/                # Core libraries
│   ├── data.ts         # Component database
│   ├── types.ts        # TypeScript definitions
│   ├── utils.ts        # Utility functions
│   └── constants.ts    # App constants
├── hooks/              # Custom React hooks
├── app/                # Next.js app router
└── public/             # Static assets
```

## 🤝 How to Contribute

### Adding New Components

1. **Update component data** in `lib/data.ts`:
   ```typescript
   {
     id: 'unique-component-id',
     name: 'Component Name',
     cat: 'category',
     tier: 1,
     note: 'Brief description',
     price: 100,
     tags: ['tag1', 'tag2'],
     pairs: ['compatible-component-id'],
     datasheet: 'https://manufacturer.com/datasheet.pdf',
     verified: true,
     wtb: {
       robu: 'https://robu.in/product/...',
       amazon: 'https://amazon.com/...',
       ali: 'https://aliexpress.com/...'
     }
   }
   ```

2. **Verify requirements**:
   - All required fields are filled
   - Datasheet link is official and active
   - Purchase links are valid and relevant
   - Component follows existing naming patterns

### Bug Reports

1. **Search existing issues** before creating new ones
2. **Use descriptive titles** and detailed descriptions
3. **Include steps to reproduce** the issue
4. **Add relevant screenshots** if applicable
5. **Specify your environment** (OS, browser, Node version)

### Feature Requests

1. **Check existing issues** for similar requests
2. **Use the feature request template**
3. **Describe the problem** you're trying to solve
4. **Propose potential solutions**
5. **Consider implementation complexity**

### Code Contributions

1. **Create a feature branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the code style guidelines

3. **Test your changes**:
   ```bash
   npm run lint
   npm run build
   npm run dev
   ```

4. **Commit with conventional commits**:
   ```bash
   git commit -m "feat: add new component filtering option"
   git commit -m "fix: resolve component display issue"
   git commit -m "docs: update contributing guidelines"
   ```

5. **Push and create pull request**:
   ```bash
   git push origin feature/your-feature-name
   ```

## 📋 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] All tests pass (if applicable)
- [ ] Build completes successfully
- [ ] Documentation is updated (if needed)
- [ ] Commits follow conventional format

### PR Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested manually
- [ ] Added automated tests (if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

## 🏷️ Labels

We use these labels for issues and PRs:

- `bug` - Bug reports and fixes
- `enhancement` - New features and improvements
- `documentation` - Documentation changes
- `good first issue` - Suitable for new contributors
- `help wanted` - Community assistance needed
- `priority: high` - Urgent issues
- `priority: medium` - Normal priority
- `priority: low` - Low priority

## 📜 Release Process

1. **Version bump** based on semantic versioning
2. **Update CHANGELOG.md** with release notes
3. **Create git tag** with version number
4. **GitHub Actions** will handle deployment

## 💬 Community

- **Discussions**: Use GitHub Discussions for questions and ideas
- **Issues**: Report bugs and request features
- **Code Review**: Participate in reviewing PRs from others

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You

Your contributions help make CircuitBase better for everyone! We appreciate your time and effort.

---

For questions, contact us at `contributions@circuitbase.dev` or start a [Discussion](https://github.com/yourusername/circuitbase/discussions).
