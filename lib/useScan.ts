'use client'
import { useSyncExternalStore } from 'react'
import { EMPTY, getResults, subscribe } from './rpc'

export function useScan() {
  return useSyncExternalStore(subscribe, getResults, () => EMPTY)
}
