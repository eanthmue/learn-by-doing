import { useSyncExternalStore } from "react";

function getHashPath() {
  const hash = window.location.hash.slice(1);
  return hash || "/";
}

function subscribeToHashPath(onStoreChange: () => void) {
  window.addEventListener("hashchange", onStoreChange);
  return () => window.removeEventListener("hashchange", onStoreChange);
}

export function useRoute(): string {
  return useSyncExternalStore(subscribeToHashPath, getHashPath, () => "/");
}
