import type { Specialty, PropertyType, OperationType, PropertyStatus } from '@/types'

export const SPECIALTIES: { value: Specialty; label: string }[] = [
  { value: 'inversion', label: 'Inversion' },
  { value: 'vivienda', label: 'Vivienda' },
  { value: 'lote', label: 'Lotes' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'arriendo', label: 'Arriendo' },
  { value: 'finca', label: 'Fincas' },
]

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'casa', label: 'Casa' },
  { value: 'apartaestudio', label: 'Apartaestudio' },
  { value: 'oficina', label: 'Oficina' },
  { value: 'local_comercial', label: 'Local Comercial' },
  { value: 'bodega', label: 'Bodega' },
  { value: 'lote', label: 'Lote' },
  { value: 'finca', label: 'Finca' },
  { value: 'otro', label: 'Otro' },
]

export const OPERATION_TYPES: { value: OperationType; label: string }[] = [
  { value: 'venta', label: 'Venta' },
  { value: 'arriendo', label: 'Arriendo' },
]

export const PROPERTY_STATUSES: { value: PropertyStatus; label: string; color: string }[] = [
  { value: 'draft', label: 'Borrador', color: 'bg-gray-100 text-gray-800' },
  { value: 'active', label: 'Activo', color: 'bg-green-100 text-green-800' },
  { value: 'paused', label: 'Pausado', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'sold', label: 'Vendido', color: 'bg-blue-100 text-blue-800' },
  { value: 'rented', label: 'Arrendado', color: 'bg-blue-100 text-blue-800' },
]

export const COLOMBIAN_CITIES = [
  { name: 'Bogota', department: 'Cundinamarca' },
  { name: 'Medellin', department: 'Antioquia' },
  { name: 'Cali', department: 'Valle del Cauca' },
  { name: 'Barranquilla', department: 'Atlantico' },
  { name: 'Cartagena', department: 'Bolivar' },
  { name: 'Bucaramanga', department: 'Santander' },
  { name: 'Pereira', department: 'Risaralda' },
  { name: 'Santa Marta', department: 'Magdalena' },
  { name: 'Manizales', department: 'Caldas' },
  { name: 'Ibague', department: 'Tolima' },
  { name: 'Villavicencio', department: 'Meta' },
  { name: 'Cucuta', department: 'Norte de Santander' },
  { name: 'Pasto', department: 'Narino' },
  { name: 'Neiva', department: 'Huila' },
  { name: 'Armenia', department: 'Quindio' },
  { name: 'Monteria', department: 'Cordoba' },
  { name: 'Popayan', department: 'Cauca' },
  { name: 'Tunja', department: 'Boyaca' },
  { name: 'Valledupar', department: 'Cesar' },
  { name: 'Sincelejo', department: 'Sucre' },
  { name: 'Rionegro', department: 'Antioquia' },
  { name: 'Envigado', department: 'Antioquia' },
  { name: 'Sabaneta', department: 'Antioquia' },
  { name: 'Chia', department: 'Cundinamarca' },
  { name: 'Zipaquira', department: 'Cundinamarca' },
] as const

export const MAX_PROPERTY_IMAGES = 15
export const RAIFI_COMMISSION_PERCENT = 10
export const DEFAULT_COLEGAJE_SPLIT = 50
