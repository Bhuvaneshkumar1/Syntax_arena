/**
 * SyntaxArena CyberDrill: Incident Response & Outage Simulation Engine
 * Manages real-time telemetry streaming, diagnostic triage, patch application,
 * MTTR tracking, and automated SRE post-mortem generation.
 * Spec: docs/GAME_RULES.md, docs/ARCHITECTURE.md
 */

import { IncidentScenarios } from '../data/incident-scenarios.js';

export const INCIDENT_STATES = {
  IDLE: 'idle',
  ACTIVE: 'active',
  DIAGNOSING: 'diagnosing',
  PATCHING: 'patching',
  STABILIZED: 'stabilized',
  SLA_BREACHED: 'sla_breached'
};

export const IncidentEngine = {
  activeIncident: null,
  state: INCIDENT_STATES.IDLE,
  phase: 1, // 1 = Diagnosis, 2 = Patch Application, 3 = Post-Mortem
  startTime: 0,
  endTime: 0,
  slaLimitSeconds: 45,
  telemetry: {
    cpu: 0,
    ram: 0,
    errorRate: 0,
    latencyMs: 0
  },
  triage: {
    diagnosisAnswered: false,
    diagnosisCorrect: false,
    patchAnswered: false,
    patchCorrect: false,
    attempts: 0
  },
  callbacks: {
    onTelemetryTick: null,
    onStateChange: null,
    onStabilized: null,
    onSlaBreach: null
  },

  /**
   * Start a production outage incident drill
   * @param {string} incidentId
   * @param {object} [options]
   */
  startIncident(incidentId = 'inc_memory_leak', options = {}) {
    this.reset();
    const scenario = IncidentScenarios.getById(incidentId) || IncidentScenarios.getDefaultIncident();
    if (!scenario) {
      throw new Error(`[IncidentEngine] Scenario "${incidentId}" not found.`);
    }

    this.activeIncident = JSON.parse(JSON.stringify(scenario));
    this.state = INCIDENT_STATES.ACTIVE;
    this.phase = 1;
    this.startTime = Date.now();
    this.slaLimitSeconds = scenario.slaSeconds || 45;

    // Set initial baseline telemetry
    this.telemetry = {
      cpu: scenario.initialMetrics.cpu,
      ram: scenario.initialMetrics.ram,
      errorRate: scenario.initialMetrics.errorRate,
      latencyMs: scenario.initialMetrics.latencyMs
    };

    if (this.callbacks.onStateChange) {
      this.callbacks.onStateChange(this.state, this.activeIncident);
    }

    return this.getSnapshot();
  },

  /**
   * Calculate live fluctuating telemetry with realistic jitter
   * @param {number} [elapsedMs]
   */
  computeTelemetry(elapsedMs = 0) {
    if (!this.activeIncident) return this.telemetry;

    const elapsedSeconds = this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;
    const slaRemaining = Math.max(0, this.slaLimitSeconds - elapsedSeconds);

    if (this.state === INCIDENT_STATES.STABILIZED) {
      // Smooth descent to nominal target levels
      const target = this.activeIncident.stabilizedMetrics;
      const decay = 0.85;
      this.telemetry.cpu = Math.round((this.telemetry.cpu * decay + target.cpu * (1 - decay)) * 10) / 10;
      this.telemetry.ram = Math.round((this.telemetry.ram * decay + target.ram * (1 - decay)) * 10) / 10;
      this.telemetry.errorRate = Math.round((this.telemetry.errorRate * decay + target.errorRate * (1 - decay)) * 100) / 100;
      this.telemetry.latencyMs = Math.round(this.telemetry.latencyMs * decay + target.latencyMs * (1 - decay));
      return {
        ...this.telemetry,
        slaRemainingSeconds: slaRemaining,
        activeConnections: target.activeConnections || 1000,
        ramDisplay: target.ramDisplay || ''
      };
    }

    // Active outage telemetry jitter
    const init = this.activeIncident.initialMetrics;
    const jitter = (Math.random() - 0.5) * 3;
    const latencyJitter = Math.floor((Math.random() - 0.5) * 350);

    this.telemetry.cpu = Math.min(100, Math.max(10, Math.round((init.cpu + jitter) * 10) / 10));
    this.telemetry.ram = Math.min(100, Math.max(10, Math.round((init.ram + jitter * 0.5) * 10) / 10));
    this.telemetry.errorRate = Math.min(100, Math.max(0, Math.round((init.errorRate + jitter * 0.7) * 10) / 10));
    this.telemetry.latencyMs = Math.max(20, init.latencyMs + latencyJitter);

    return {
      ...this.telemetry,
      slaRemainingSeconds: slaRemaining,
      activeConnections: init.activeConnections || 10000,
      ramDisplay: init.ramDisplay || ''
    };
  },

  /**
   * Get streaming server logs for active incident
   */
  getStreamingLogs() {
    return this.filterLogs();
  },

  /**
   * Filter incident server logs with optional case-insensitive substring
   * @param {string} query
   */
  filterLogs(query = '') {
    if (!this.activeIncident || !Array.isArray(this.activeIncident.logs)) {
      return [];
    }
    const cleanQ = (query || '').toLowerCase().trim();
    if (!cleanQ) {
      return [...this.activeIncident.logs];
    }
    return this.activeIncident.logs.filter(line => line.toLowerCase().includes(cleanQ));
  },

  /**
   * Submit Root Cause Diagnosis answer (Phase 1)
   * @param {number|string} optionIndexOrText
   */
  submitDiagnosis(optionIndexOrText) {
    if (!this.activeIncident || this.state !== INCIDENT_STATES.ACTIVE) {
      return { success: false, error: 'No active incident drill.' };
    }

    const q = this.activeIncident.diagnosisQuestion;
    const isCorrect = (optionIndexOrText === q.correctAnswer) ||
      (typeof optionIndexOrText === 'number' && q.options && q.options[optionIndexOrText] === q.options[q.correctAnswer]) ||
      (typeof optionIndexOrText === 'string' && (optionIndexOrText === q.options[q.correctAnswer] || optionIndexOrText === q.correctAnswer));

    this.triage.diagnosisAnswered = true;
    this.triage.diagnosisCorrect = isCorrect;
    this.triage.attempts++;

    if (isCorrect) {
      // Advance to Phase 2 (Hotfix Patch Application)
      this.phase = 2;
    }

    return {
      isCorrect,
      explanation: q.explanation,
      correctIndex: q.correctAnswer,
      nextPhase: this.phase
    };
  },

  /**
   * Submit Code Patch Hotfix selection (Phase 2)
   * @param {number|string} optionIndexOrText
   */
  submitPatch(optionIndexOrText) {
    if (!this.activeIncident || this.phase < 2) {
      return { success: false, error: 'Diagnosis must be verified before patch deployment.' };
    }

    const q = this.activeIncident.patchQuestion;
    const isCorrect = (optionIndexOrText === q.correctAnswer) ||
      (typeof optionIndexOrText === 'number' && q.options && q.options[optionIndexOrText] === q.options[q.correctAnswer]) ||
      (typeof optionIndexOrText === 'string' && (optionIndexOrText === q.options[q.correctAnswer] || optionIndexOrText === q.correctAnswer));

    this.triage.patchAnswered = true;
    this.triage.patchCorrect = isCorrect;
    this.triage.attempts++;

    if (isCorrect) {
      // Incident successfully stabilized!
      this.state = INCIDENT_STATES.STABILIZED;
      this.phase = 3;
      this.endTime = Date.now();

      // Award Diamonds (Item 18) to the active profile
      if (typeof window !== 'undefined' && window.State) {
        try {
          const profile = window.State.get('activeProfile');
          if (profile) {
            const pm = this.getPostMortem();
            const diamonds = pm?.diamondsAwarded || 5;
            profile.diamonds = (profile.diamonds || 0) + diamonds;
            window.State.set('activeProfile', profile, true);
          }
        } catch (_) {}
      }

      if (this.callbacks.onStabilized) {
        this.callbacks.onStabilized(this.getPostMortem());
      }
    }

    return {
      isCorrect,
      explanation: q.explanation,
      correctIndex: q.correctAnswer,
      isResolved: this.state === INCIDENT_STATES.STABILIZED,
      postMortem: this.state === INCIDENT_STATES.STABILIZED ? this.getPostMortem() : null
    };
  },

  /**
   * Execute interactive SRE terminal commands against live incident logs and telemetry.
   * Commands supported: cat, tail, head, grep, status, top, clear, help
   * @param {string} cmdString
   */
  executeTerminalCommand(cmdString = '') {
    const raw = (cmdString || '').trim();
    if (!raw) return { output: '', error: null };
    const tokens = raw.split(/\s+/);
    const cmd = tokens[0].toLowerCase();
    const args = tokens.slice(1);
    const logs = this.activeIncident?.logs || [];

    switch (cmd) {
      case 'clear':
        return { output: '__CLEAR__', error: null };
      case 'help':
        return {
          output: [
            'SRE Outage Diagnostic Shell Commands:',
            '  tail [-n N]     Show last N log lines (default 8)',
            '  head [-n N]     Show first N log lines (default 8)',
            '  cat [file]      Dump entire incident log stream',
            '  grep [-i] <q>   Search log entries for string pattern',
            '  status          Display service, node health and telemetry',
            '  top             Inspect container process table',
            '  clear           Clear terminal view'
          ].join('\n'),
          error: null
        };
      case 'status':
        return {
          output: [
            `Incident: ${this.activeIncident?.title || 'None'} [${this.activeIncident?.severity || 'SEV-1'}]`,
            `Service:  ${this.activeIncident?.service || 'worker'} (Language: ${this.activeIncident?.language || 'python'})`,
            `State:    ${this.state.toUpperCase()} (Phase: ${this.phase})`,
            `CPU:      ${this.telemetry.cpu}% | RAM: ${this.telemetry.ram}%`,
            `5xx Err:  ${this.telemetry.errorRate}% | Latency: ${this.telemetry.latencyMs}ms`
          ].join('\n'),
          error: null
        };
      case 'top':
        return {
          output: [
            'PID   USER     PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND',
            `4201  app      20   0  7892M  6910M   140M R  ${this.telemetry.cpu.toFixed(1)}  ${this.telemetry.ram.toFixed(1)}   4:12.80 ${this.activeIncident?.service || 'worker'}`,
            '1     root     20   0   168M    12M     8M S   0.1   0.2   0:01.42 systemd',
            '241   k8s      20   0   890M    48M    24M S   1.2   0.6   0:24.10 kubelet'
          ].join('\n'),
          error: null
        };
      case 'head': {
        const nIdx = args.indexOf('-n');
        const count = nIdx !== -1 && args[nIdx + 1] ? parseInt(args[nIdx + 1], 10) : 8;
        return { output: logs.slice(0, count).join('\n'), error: null };
      }
      case 'tail': {
        const nIdx = args.indexOf('-n');
        const count = nIdx !== -1 && args[nIdx + 1] ? parseInt(args[nIdx + 1], 10) : 8;
        return { output: logs.slice(Math.max(0, logs.length - count)).join('\n'), error: null };
      }
      case 'cat':
        return { output: logs.join('\n'), error: null };
      case 'grep': {
        const pattern = args.find(a => !a.startsWith('-')) || '';
        const filtered = this.filterLogs(pattern);
        return { output: filtered.length ? filtered.join('\n') : `(No matching log entries found for '${pattern}')`, error: null };
      }
      default:
        return { output: '', error: `sre-shell: command not found: ${cmd}. Type 'help' for available commands.` };
    }
  },

  /**
   * Get MTTR and performance analytics
   */
  getMTTR() {
    const end = this.endTime || Date.now();
    const elapsedMs = Math.max(0, end - this.startTime);
    const elapsedSec = Math.round(elapsedMs / 100) / 10;
    const isSlaMet = elapsedSec <= this.slaLimitSeconds;
    return {
      elapsedMs,
      elapsedSec,
      slaLimitSeconds: this.slaLimitSeconds,
      isSlaMet,
      slaMarginSec: Math.round((this.slaLimitSeconds - elapsedSec) * 10) / 10
    };
  },

  /**
   * Generate comprehensive SRE Post-Mortem Incident Report
   */
  getPostMortem() {
    if (!this.activeIncident) return null;
    const mttr = this.getMTTR();
    const isSuccess = this.state === INCIDENT_STATES.STABILIZED;

    // Calculate incident commander score & diamonds (Item 18)
    let score = 0;
    let diamondsAwarded = 0;
    if (isSuccess) {
      score += 300; // Base resolution bounty
      diamondsAwarded = mttr.isSlaMet ? 8 : 5; // 8 diamonds for honoring SLA, 5 baseline
      if (mttr.isSlaMet) {
        score += Math.max(50, Math.round(mttr.slaMarginSec * 15)); // Speed bonus
      }
      if (this.triage.diagnosisCorrect && this.triage.patchCorrect && this.triage.attempts === 2) {
        score += 100; // Flawless zero-mistake triage
      }
    }

    const preventedCostUSD = isSuccess ? Math.round(15000 + Math.random() * 8500) : 0;

    return {
      incidentId: this.activeIncident.id,
      title: this.activeIncident.title,
      severity: this.activeIncident.severity,
      system: this.activeIncident.system,
      service: this.activeIncident.service,
      language: this.activeIncident.language,
      isResolved: isSuccess,
      elapsedSec: mttr.elapsedSec,
      slaLimitSeconds: mttr.slaLimitSeconds,
      isSlaMet: mttr.isSlaMet,
      slaComplianceRate: mttr.isSlaMet ? '100% (SLA HONORED)' : 'SLA BREACHED',
      score,
      xpAwarded: score,
      diamondsAwarded,
      preventedCostUSD,
      rootCause: this.activeIncident.diagnosisQuestion.explanation,
      hotfixApplied: this.activeIncident.patchQuestion.explanation,
      timeline: [
        { time: 'T-00:00', event: `🚨 ${this.activeIncident.severity} incident triggered on ${this.activeIncident.system}` },
        { time: `T+00:${String(Math.min(15, Math.round(mttr.elapsedSec * 0.4))).padStart(2, '0')}`, event: '🔍 Diagnostic triage completed; root cause identified' },
        { time: `T+00:${String(Math.round(mttr.elapsedSec)).padStart(2, '0')}`, event: '✅ Emergency hotfix deployed; telemetry stabilized' }
      ]
    };
  },

  /**
   * Generate clean Markdown with embeddable GitHub Profile Badges (Item 20)
   */
  generateMarkdownReport() {
    const p = this.getPostMortem();
    if (!p) return '';

    const badgeStatus = p.isResolved ? 'RESOLVED_100%25-brightgreen' : 'UNRESOLVED-critical';
    const badgeSLA = p.isSlaMet ? 'SLA_HONORED-blue' : 'SLA_BREACHED-orange';

    return `# 🛡️ SRE Incident Post-Mortem: ${p.title}

[![Incident Status](https://img.shields.io/badge/INCIDENT-${p.severity}-red?style=for-the-badge&logo=opsgenie)](https://github.com)
[![Resolution](https://img.shields.io/badge/STATUS-${badgeStatus}?style=for-the-badge&logo=checkmarx)](https://github.com)
[![MTTR](https://img.shields.io/badge/MTTR-${p.elapsedSec}s-blue?style=for-the-badge&logo=speedtest)](https://github.com)
[![SLA](https://img.shields.io/badge/COMPLIANCE-${badgeSLA}?style=for-the-badge)](https://github.com)
[![Bounty](https://img.shields.io/badge/REWARD-+${p.diamondsAwarded}%20%F0%9F%92%8E%20DIAMONDS-blueviolet?style=for-the-badge)](https://github.com)

> **Mission Critical System Recovery Telemetry**
> *Resolved under live operational pressure via SyntaxArena CyberDrill SRE Engine*

### 📊 Telemetry & Outage Impact
| Metric | Recorded Baseline | Target SLA | Outcome |
| :--- | :--- | :--- | :--- |
| **Impacted Subsystem** | \`${p.system}\` | Zero Degradation | ✅ Restored to 99.99% Nominal |
| **Microservice** | \`${p.service}\` (\`${p.language}\`) | Sub-100ms Latency | ✅ 5xx Error Rate Dropped to 0.0% |
| **Mean Time to Recovery** | \`${p.elapsedSec}s\` | \`< ${p.slaLimitSeconds}s\` | **${p.slaComplianceRate}** |
| **Downtime Cost Prevented** | **\$${p.preventedCostUSD.toLocaleString()} USD** | SLA Guarantee | 💎 **+${p.diamondsAwarded} Diamonds Earned** |

### 🔍 Root Cause Analysis (RCA)
${p.rootCause}

### ⚡ Emergency Hotfix Deployed
${p.hotfixApplied}

---
*Verified & cryptographically logged by Incident Commander via [SyntaxArena](https://github.com)*`;
  },

  /**
   * Return complete scenario inventory for interactive scenario selection (Item 19)
   */
  getScenarioList() {
    return IncidentScenarios.getAll().map(s => ({
      id: s.id,
      title: s.title,
      severity: s.severity,
      system: s.system,
      service: s.service,
      language: s.language,
      badgeClass: s.badgeClass
    }));
  },

  /**
   * Retrieve atomic state snapshot
   */
  getSnapshot() {
    return {
      activeIncident: this.activeIncident,
      state: this.state,
      phase: this.phase,
      telemetry: { ...this.telemetry },
      mttr: this.getMTTR()
    };
  },

  /**
   * Reset engine state
   */
  reset() {
    this.activeIncident = null;
    this.state = INCIDENT_STATES.IDLE;
    this.phase = 1;
    this.startTime = 0;
    this.endTime = 0;
    this.telemetry = { cpu: 0, ram: 0, errorRate: 0, latencyMs: 0 };
    this.triage = {
      diagnosisAnswered: false,
      diagnosisCorrect: false,
      patchAnswered: false,
      patchCorrect: false,
      attempts: 0
    };
  }
};

if (typeof window !== 'undefined') {
  window.IncidentEngine = IncidentEngine;
  window.INCIDENT_STATES = INCIDENT_STATES;
}
