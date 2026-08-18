# Code of Ethics

## Purpose

This Code of Ethics outlines the ethical principles and responsibilities that guide the development, deployment, and use of **Hirely — AI Resume & ATS Strategic Optimizer**. As a project that processes personal career data and leverages artificial intelligence, we hold ourselves to a high standard of ethical conduct.

---

## Core Principles

### 1. Privacy & Data Protection

- **User data stays local.** Hirely stores all user data, resumes, and analysis results in a local SQLite database on the user's own machine.
- **No silent data collection.** We do not collect, store, or transmit user data to any server or third party without the user's explicit knowledge and consent.
- **Transparent AI usage.** When resume content is sent to external AI services (OpenAI API) for analysis, the user is made aware of this interaction. We encourage users to review the data-processing terms of the AI provider.
- **API keys remain private.** Sensitive credentials are stored through environment variables and are never hardcoded or committed to the repository.

### 2. Fairness & Non-Discrimination

- **Unbiased analysis.** Hirely evaluates resumes based on objective ATS compatibility criteria such as formatting, keyword presence, section structure, and readability — not on personal attributes like name, gender, age, ethnicity, or background.
- **Equal access.** The application is free and open-source, ensuring that all job seekers have equal access to resume optimization tools regardless of financial status.

### 3. Transparency

- **Open-source codebase.** The entire source code is publicly available for review, audit, and contribution. Anyone can inspect how the AI analysis works and what data is processed.
- **Honest scoring.** ATS scores and recommendations are generated based on documented criteria. We do not inflate scores or provide misleading feedback.

### 4. Responsible AI Use

- **AI as a tool, not a decision-maker.** Hirely provides recommendations and insights to assist users. It does not make hiring decisions, and its output should be treated as guidance rather than absolute judgment.
- **Limitations acknowledged.** AI analysis may not perfectly reflect every ATS system's behavior. We communicate this clearly to users and encourage them to use Hirely's feedback as one of several tools in their job search.
- **No manipulation.** We do not design features intended to game or exploit ATS systems in dishonest ways. Our goal is to help users present their genuine qualifications more effectively.

### 5. Security

- **Secure authentication.** User accounts are protected with JWT-based authentication and bcrypt password hashing.
- **Responsible vulnerability handling.** Security vulnerabilities should be reported privately through our [Security Policy](SECURITY.md) rather than disclosed publicly.

### 6. Community Conduct

- All contributors and community members are expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
- We foster an inclusive, respectful, and collaborative environment.

---

## Accountability

The project maintainer, **Govinda Herath**, is responsible for upholding these ethical standards and addressing any concerns raised by users or contributors.

If you believe this Code of Ethics has been violated, please reach out at **govindaherath@outlook.com**.

---

## Acknowledgment

This Code of Ethics is a living document and may be updated as the project evolves. Contributors are encouraged to suggest improvements.
