import 'server-only';
import process from 'node:process';
import { createPointageRawClockingRuntime } from './raw-clocking-runtime';

type Consumer = Awaited<ReturnType<typeof createPointageRawClockingRuntime>>;
type Admission = Readonly<{
  admit: (
    factory: typeof createPointageRawClockingRuntime,
    pairFactory: () => readonly [
      () => Promise<Consumer>,
      () => Promise<Consumer>,
    ],
  ) => Promise<Consumer>;
}>;
const key = Symbol.for('yuta.pointage.raw-clocking.test-bootstrap.v1');

// No environment fallback. Only the positively owned test child installs this
// process-local capability; normal Next entry points never instantiate it.
function createIndependentPointageAccessor() {
  return function acquire(): Promise<Consumer> {
    const descriptor = Object.getOwnPropertyDescriptor(process, key);
    if (
      !descriptor ||
      descriptor.enumerable ||
      descriptor.writable ||
      descriptor.configurable ||
      !descriptor.value ||
      !Object.isFrozen(descriptor.value)
    )
      throw new Error('Pointage runtime is unavailable.');
    const admission: unknown = descriptor.value;
    if (
      typeof admission !== 'object' ||
      admission === null ||
      Reflect.ownKeys(admission).length !== 1 ||
      !('admit' in admission) ||
      typeof admission.admit !== 'function'
    )
      throw new Error('Pointage runtime is unavailable.');
    return (admission as Admission).admit(
      createPointageRawClockingRuntime,
      createPointageAccessorPair,
    );
  };
}

function createPointageAccessorPair() {
  return [
    createIndependentPointageAccessor(),
    createIndependentPointageAccessor(),
  ] as const;
}

export const getPointageRawClockingConsumer =
  createIndependentPointageAccessor();
