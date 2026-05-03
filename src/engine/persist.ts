import { STORAGE_KEY } from './config';
import type { EngineState } from './types';
import { createInitialEngineState } from './reducer';

export function loadEngineState(): EngineState {
  const init = createInitialEngineState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return init;
    const p = JSON.parse(raw) as Partial<EngineState>;
    return {
      ...init,
      ...p,
      pulse: { ...init.pulse, ...(p.pulse ?? {}) },
      postPulse: { ...init.postPulse, ...(p.postPulse ?? {}) },
      creatorAccruedUsd: { ...init.creatorAccruedUsd, ...(p.creatorAccruedUsd ?? {}) },
      actionStamps: p.actionStamps ?? {},
    };
  } catch {
    return init;
  }
}

export function saveEngineState(state: EngineState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}
