'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Sidebar } from './sidebar'

export function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <div className="relative h-full">
              <button
                onClick={() => setOpen(false)}
                className="absolute right-2 top-4 z-10 p-1"
                aria-label="Cerrar menu"
              >
                <X className="h-5 w-5" />
              </button>
              <Sidebar />
            </div>
          </div>
        </>
      )}
    </>
  )
}
