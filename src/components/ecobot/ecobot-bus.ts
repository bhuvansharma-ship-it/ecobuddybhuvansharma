// Tiny event bus so any component can open EcoBot or pre-send a prompt.

type Listener = (prompt?: string) => void;
const listeners = new Set<Listener>();

export function subscribeEcoBot(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function openEcoBot() {
  listeners.forEach((l) => l());
}

export function sendToEcoBot(prompt: string) {
  listeners.forEach((l) => l(prompt));
}
