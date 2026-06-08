import { Timestamp } from 'firebase/firestore'

// ── Enums ──────────────────────────────────────────────

export type Specialty =
  | 'inversion'
  | 'vivienda'
  | 'lote'
  | 'comercial'
  | 'arriendo'
  | 'finca'

export type PropertyType =
  | 'apartamento'
  | 'casa'
  | 'apartaestudio'
  | 'oficina'
  | 'local_comercial'
  | 'bodega'
  | 'lote'
  | 'finca'
  | 'otro'

export type PropertyStatus = 'draft' | 'active' | 'paused' | 'sold' | 'rented'

export type OperationType = 'venta' | 'arriendo'

export type ConnectionStatus = 'pending' | 'accepted' | 'declined'

export type LeadSource = 'web' | 'whatsapp' | 'colegaje'

// ── Models ─────────────────────────────────────────────

export interface Agent {
  uid: string
  fullName: string
  email: string
  phone: string | null
  slug: string
  avatarUrl: string | null
  bio: string | null
  city: string | null
  department: string | null
  specialties: Specialty[]
  yearsExperience: number
  dealsClosed: number
  isVerified: boolean
  isOnboarded: boolean
  isActive: boolean
  whatsappNumber: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface PropertyImage {
  id: string
  storagePath: string
  url: string
  displayOrder: number
  isCover: boolean
}

export interface Property {
  id: string
  agentId: string
  agentName: string
  agentAvatarUrl: string | null
  title: string
  description: string
  operation: OperationType
  type: PropertyType
  status: PropertyStatus
  price: number
  bedrooms: number
  bathrooms: number
  areaM2: number
  garageSpaces: number
  city: string
  department: string
  neighborhood: string
  address: string
  latitude: number | null
  longitude: number | null
  images: PropertyImage[]
  isFeatured: boolean
  isColegaje: boolean
  colegajeCommissionSplit: number
  viewsCount: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Connection {
  id: string
  requesterId: string
  receiverId: string
  requesterName: string
  receiverName: string
  status: ConnectionStatus
  message: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Lead {
  id: string
  propertyId: string | null
  propertyTitle: string | null
  agentId: string
  name: string
  email: string | null
  phone: string
  message: string | null
  source: LeadSource
  isRead: boolean
  createdAt: Timestamp
}

export interface City {
  id: string
  name: string
  department: string
  isActive: boolean
}

// ── Serialized versions (for client components) ────────

export interface AgentSerialized extends Omit<Agent, 'createdAt' | 'updatedAt'> {
  createdAt: string
  updatedAt: string
}

export interface PropertySerialized extends Omit<Property, 'createdAt' | 'updatedAt'> {
  createdAt: string
  updatedAt: string
}

export interface ConnectionSerialized extends Omit<Connection, 'createdAt' | 'updatedAt'> {
  createdAt: string
  updatedAt: string
}

export interface LeadSerialized extends Omit<Lead, 'createdAt'> {
  createdAt: string
}
