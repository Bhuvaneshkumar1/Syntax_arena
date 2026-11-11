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
   * @param {number} optionIndex
   */
  submitDiagnosis(optionIndex) {
    if (!this.activeIncident || this.state !== INCIDENT_STATES.ACTIVE) {
      return { success: false, error: 'No active incident drill.' };
    }

    const q = this.activeIncident.diagnosisQuestion;
    const isCorrect = (optionIndex === q.correctAnswer);
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
   * @param {number} optionIndex
   */
  submitPatch(optionIndex) {
    if (!this.activeIncident || this.phase < 2) {
      return { success: false, error: 'Diagnosis must be verified before patch deployment.' };
    }

    const q = this.activeIncident.patchQuestion;
    const isCorrect = (optionIndex === q.correctAnswer);
    this.triage.patchAnswered = true;
    this.triage.patchCorrect = isCorrect;
    this.triage.attempts++;

    if (isCorrect) {
      // Incident successfully stabilized!
      this.state = INCIDENT_STATES.STABILIZED;
      this.phase = 3;
      this.endTime = Date.now();

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

    // Calculate incident commander score
    let score = 0;
    if (isSuccess) {
      score += 300; // Base resolution bounty
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
   * Generate clean Markdown formatted post-mortem for 1-click clipboard sharing
   */
  generateMarkdownReport() {
    const p = this.getPostMortem();
    if (!p) return '';

    return `### 🚨 SRE Incident Post-Mortem: ${p.title}
**Incident ID:** \`${p.incidentId}\` • **Severity:** **${p.severity}** • **Service:** \`${p.service}\`
**Status:** ${p.isResolved ? '✅ RESOLVED & STABILIZED' : '❌ UNRESOLVED'}
**MTTR:** ${p.elapsedSec}s (Target SLA: ${p.slaLimitSeconds}s) • **SLA Compliance:** ${p.slaComplianceRate}
**Score Earned:** +${p.score} XP • **Downtime Cost Prevented:** \$${p.preventedCostUSD.toLocaleString()} USD

#### 🔍 Root Cause Analysis:
${p.rootCause}

#### ⚡ Hotfix Remediation:
${p.hotfixApplied}

*Generated via SyntaxArena CyberDrill Incident Response Engine*`;
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
