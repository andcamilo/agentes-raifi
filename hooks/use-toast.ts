'use client'

import { useState, useCallback } from 'react'

interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

let toastCounter = 0

const listeners: Set<(toasts: Toast[]) => void> = new Set()
let memoryToasts: Toast[] = []

function dispatch(toasts: Toast[]) {
  memoryToasts = toasts
  listeners.forEach((listener) => listener(toasts))
}

export function toast({
  title,
  description,
  variant = 'default',
}: Omit<Toast, 'id'>) {
  const id = String(++toastCounter)
  const newToast: Toast = { id, title, description, variant }
  dispatch([...memoryToasts, newToast])

  setTimeout(() => {
    dispatch(memoryToasts.filter((t) => t.id !== id))
  }, 5000)
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(memoryToasts)

  useState(() => {
    listeners.add(setToasts)
    return () => listeners.delete(setToasts)
  })

  const dismiss = useCallback((id: string) => {
    dispatch(memoryToasts.filter((t) => t.id !== id))
  }, [])

  return { toasts, toast, dismiss }
}
