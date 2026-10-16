"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * True once the page's scripts are running. Forms that submit through JavaScript keep their
 * button disabled until then, so an early click can't fall back to a plain browser submit
 * (which would put answers, PINs or passwords in the address bar).
 */
export function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
