# Security Policy

## Supported Versions

| Version | Supported |
| :--- | :---: |
| 1.0.x | ✅ |

## Reporting a Vulnerability

If you discover a security vulnerability in Hirely, **please do not open a public issue.**

Instead, report it privately using one of the following methods:

### Option 1: Email

Send an email to **govindaherath@outlook.com** with:

- A clear description of the vulnerability
- Steps to reproduce the issue
- The potential impact or severity
- Any suggested fixes (if applicable)

### Option 2: GitHub Security Advisory

Use [GitHub's private vulnerability reporting](https://github.com/govindasathruwan/AI_Resume_Analyser-Hirely-/security/advisories/new) to submit a confidential advisory.

---

## Response Timeline

| Action | Timeframe |
| :--- | :--- |
| Acknowledgment of report | Within 48 hours |
| Initial assessment | Within 5 business days |
| Fix development & testing | Depends on severity |
| Patch release | As soon as the fix is verified |

---

## Scope

The following areas are in scope for security reports:

- **Authentication & Authorization** — JWT handling, session management, login bypass
- **Data Storage** — SQLite injection, unauthorized data access, credential exposure
- **API Security** — Express API endpoint vulnerabilities, rate limiting, input validation
- **Electron Security** — Context isolation bypass, remote code execution, preload script vulnerabilities
- **Dependency Vulnerabilities** — Known CVEs in project dependencies

The following are **out of scope**:

- Social engineering attacks
- Denial of service (DoS) attacks against local installations
- Issues in third-party services (e.g., OpenAI API)
- Vulnerabilities requiring physical access to the user's machine

---

## Security Best Practices for Users

- Keep your `.env` file private and never commit it to version control.
- Use strong, unique values for `JWT_SECRET`.
- Keep your OpenAI API key confidential.
- Regularly update the application to the latest version.
- Review the [OpenAI Usage Policies](https://openai.com/policies/usage-policies) before uploading sensitive documents.

---

## Acknowledgments

We appreciate the efforts of security researchers and community members who help keep Hirely safe. Responsible disclosure helps protect all users.

Thank you for helping us improve the security of this project.
