'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { OPERATION_TYPES, PROPERTY_TYPES, COLOMBIAN_CITIES } from '@/lib/constants'

export function PropertyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/inmuebles?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-3">
      <select
        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        value={searchParams.get('operation') || ''}
        onChange={(e) => updateFilter('operation', e.target.value)}
      >
        <option value="">Operacion</option>
        {OPERATION_TYPES.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>

      <select
        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        value={searchParams.get('type') || ''}
        onChange={(e) => updateFilter('type', e.target.value)}
      >
        <option value="">Tipo</option>
        {PROPERTY_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      <select
        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        value={searchParams.get('city') || ''}
        onChange={(e) => updateFilter('city', e.target.value)}
      >
        <option value="">Ciudad</option>
        {COLOMBIAN_CITIES.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        value={searchParams.get('bedrooms') || ''}
        onChange={(e) => updateFilter('bedrooms', e.target.value)}
      >
        <option value="">Habitaciones</option>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n}+
          </option>
        ))}
      </select>
    </div>
  )
}
