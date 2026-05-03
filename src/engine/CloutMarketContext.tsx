import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import type { CloutEvent, EngineState } from './types';
import { reduceEngine } from './reducer';
import { loadEngineState, saveEngineState } from './persist';

type CloutMarketContextValue = {
  state: EngineState;
  dispatch: (e: CloutEvent) => void;
  formatClout: (n: number) => string;
};

const CloutMarketContext = createContext<CloutMarketContextValue | null>(null);

function formatClout(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 10_000) return `${Math.round(n / 1000)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(Math.round(n));
}

export function CloutMarketProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatchRaw] = useReducer(
    (s: EngineState, e: CloutEvent) => reduceEngine(s, e),
    undefined as unknown as EngineState,
    () => loadEngineState()
  );

  useEffect(() => {
    saveEngineState(state);
  }, [state]);

  const dispatch = useCallback((e: CloutEvent) => {
    dispatchRaw(e);
  }, []);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      formatClout,
    }),
    [state, dispatch]
  );

  return <CloutMarketContext.Provider value={value}>{children}</CloutMarketContext.Provider>;
}

export function useCloutMarket(): CloutMarketContextValue {
  const ctx = useContext(CloutMarketContext);
  if (!ctx) {
    throw new Error('useCloutMarket must be used within CloutMarketProvider');
  }
  return ctx;
}

/** Safe for optional UI (e.g. storybook) */
export function useCloutMarketOptional(): CloutMarketContextValue | null {
  return useContext(CloutMarketContext);
}
