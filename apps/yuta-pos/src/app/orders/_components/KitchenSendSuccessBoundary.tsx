'use client';

import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

const KitchenSendSuccessContext = createContext<(() => void) | null>(null);

export function KitchenSendSuccessBoundary({
  children,
  successContent,
}: {
  children: ReactNode;
  successContent: ReactNode;
}) {
  const [succeeded, setSucceeded] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);
  const showSuccess = useCallback(() => setSucceeded(true), []);

  useEffect(() => {
    if (succeeded) {
      successRef.current?.focus();
    }
  }, [succeeded]);

  if (succeeded) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className="outline-none"
        aria-live="polite"
      >
        {successContent}
      </div>
    );
  }

  return (
    <KitchenSendSuccessContext.Provider value={showSuccess}>
      {children}
    </KitchenSendSuccessContext.Provider>
  );
}

export function useKitchenSendSuccess(): (() => void) | null {
  return useContext(KitchenSendSuccessContext);
}
