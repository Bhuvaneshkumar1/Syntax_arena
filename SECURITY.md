# 🛡️ Security Policy

<div align="center">

### SyntaxArena Security Architecture, Privacy Standards & Vulnerability Disclosure

</div>

---

## 🔒 Security & Privacy Guarantees

SyntaxArena is engineered with an uncompromising security-first mindset:

1. **Zero External Data Transmission:**
   * SyntaxArena operates **100% client-side**.
   * No user data, code inputs, game scores, or callsigns are ever transmitted to any remote server or external analytics service.
   * There are **zero tracking cookies**, **zero third-party telemetry scripts**, and **zero tracking pixels**.

2. **Isolated Local Persistence:**
   * User profiles, progress data, streak matrices, and unlocked avatars are stored exclusively in the browser's origin-scoped `localStorage`.
   * Corrupted or tampered storage payloads are automatically sanitized and salvaged into memory-safe fallbacks without crashing the application.

3. **Air-Gapped & Offline Ready:**
   * All assets (SVG graphics, vector icons, procedural Web Audio waveforms, typography) are bundled locally.
   * The application executes flawlessly in completely disconnected, firewalled, or air-gapped environments via the `file:///` protocol or static file servers.

4. **Safe DOM Injection & XSS Immunity:**
   * All user-facing inputs, code snippets, prompt strings, and explanation texts pass through strict HTML escape sanitization (`Utils.escapeHTML`) before DOM insertion.
   * No dynamic script evaluation (`eval()`) or constructor-based execution (`Function()`) is utilized for user-generated or question bank content.

---

## 📦 Supported Versions

Only the latest release on the `main` branch receives active security updates and patches.

| Version | Status | Supported |
| :---: | :---: | :---: |
| **v2.5.x (Current)** | Production Stable | ✅ Supported |
| **v2.0.x** | Deprecated | ❌ Unsupported |
| **< v2.0** | Legacy Alpha | ❌ Unsupported |

---

## 🚨 Reporting a Vulnerability

We take the security of SyntaxArena and its users very seriously. If you discover a security vulnerability or sandbox escape risk, please report it privately:

1. **Email:** Send details to **[hackerbhuvan9753@gmail.com](mailto:hackerbhuvan9753@gmail.com)** with the subject line:
   ```
   [SECURITY VULNERABILITY] SyntaxArena - <Brief Issue Summary>
   ```
2. **Include in your report:**
   * A clear description of the issue.
   * Reproduction steps or a minimal proof of concept (PoC).
   * Affected browsers and versions tested.
   * Potential impact or attack vector.

### ⏱️ Our Response Commitment
* **Initial Response:** Within **24 to 48 hours** confirming receipt of your report.
* **Triage & Assessment:** Within **3 business days** assessing severity and reproduction.
* **Patch & Resolution:** A verified fix will be implemented, tested with Playwright E2E suites, committed, and deployed immediately.

Please **do not** open public GitHub issues for sensitive security vulnerabilities until a patch has been published and released.

---

## 📜 Content Security Policy (CSP) Recommendation

For self-hosted production deployments (e.g. Nginx, Apache, or Cloudflare), we recommend enforcing the following strict CSP header:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; audio-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none';
```

---

*Thank you for helping keep SyntaxArena safe, private, and secure for learners and developers worldwide!*
