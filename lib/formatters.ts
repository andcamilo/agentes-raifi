export function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatCompactCOP(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)} mil M`
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(0)} M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)} mil`
  }
  return formatCOP(value)
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Hoy'
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays} dias`
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`
  if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`
  return `Hace ${Math.floor(diffDays / 365)} anos`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatArea(m2: number): string {
  return `${m2.toLocaleString('es-CO')} m²`
}

export function formatWhatsAppUrl(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  const fullPhone = cleanPhone.startsWith('57') ? cleanPhone : `57${cleanPhone}`
  const params = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${fullPhone}${params}`
}

export function formatShareUrl(propertyId: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://raifi.co'
  return `${base}/inmuebles/${propertyId}`
}
