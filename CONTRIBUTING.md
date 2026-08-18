# Contributing to Hirely

Thank you for your interest in contributing to **Hirely**! Whether it's fixing bugs, adding features, improving documentation, or reporting issues — every contribution matters.

---

## How to Contribute

### 1. Fork the Repository

Click the **Fork** button at the top right of the [repository page](https://github.com/govindasathruwan/AI_Resume_Analyser-Hirely-).

### 2. Clone Your Fork

```bash
git clone https://github.com/<your-username>/AI_Resume_Analyser-Hirely-.git
cd AI_Resume_Analyser-Hirely-
```

### 3. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Make Your Changes

- Write clean, readable code.
- Follow the existing code style and conventions.
- Add or update comments where necessary.
- Test your changes locally before submitting.

### 6. Commit Your Changes

Use clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add resume keyword highlighting"
```

**Commit message conventions:**
| Prefix | Usage |
| :--- | :--- |
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Formatting, missing semicolons, etc. (no logic change) |
| `refactor:` | Code restructuring without changing behavior |
| `test:` | Adding or updating tests |
| `chore:` | Build process, dependency updates, tooling |

### 7. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 8. Open a Pull Request

Go to the original repository and click **New Pull Request**. Describe your changes clearly and link any related issues.

---

## Development Setup

```bash
# Run frontend + backend concurrently
npm run dev

# Run the Electron desktop app
npm run dev:desktop

# Build production frontend
npm run build:frontend

# Package desktop installers
npm run dist:all
```

---

## Guidelines

- **Be respectful.** Follow the [Code of Conduct](CODE_OF_CONDUCT.md).
- **Keep PRs focused.** One feature or fix per pull request.
- **Write meaningful commit messages.** Follow the conventions above.
- **Test before submitting.** Ensure your changes don't break existing functionality.
- **Document your work.** Update the README or add inline comments if needed.

---

## Reporting Bugs

If you find a bug, please [open an issue](https://github.com/govindasathruwan/AI_Resume_Analyser-Hirely-/issues/new?template=bug_report.md) with:

- A clear title and description
- Steps to reproduce the issue
- Expected vs. actual behavior
- Screenshots if applicable
- Your OS and app version

---

## Suggesting Features

Have an idea? [Open a feature request](https://github.com/govindasathruwan/AI_Resume_Analyser-Hirely-/issues/new?template=feature_request.md) with:

- A clear description of the feature
- Why it would be useful
- Any mockups or examples if possible

---

## License

By contributing to Hirely, you agree that your contributions will be licensed under the [WTFPL](LICENSE).
