import { z } from 'zod'

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre es demasiado largo'),
  email: z.string().email('Email invalido'),
  password: z
    .string()
    .min(6, 'La contrasena debe tener al menos 6 caracteres')
    .max(100, 'La contrasena es demasiado larga'),
})

export const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(1, 'La contrasena es requerida'),
})

export const resetPasswordSchema = z.object({
  email: z.string().email('Email invalido'),
})

export const onboardingSchema = z.object({
  phone: z.string().min(7, 'Telefono invalido').max(15, 'Telefono invalido'),
  whatsappNumber: z.string().min(7, 'WhatsApp invalido').max(15, 'WhatsApp invalido'),
  city: z.string().min(1, 'Selecciona una ciudad'),
  department: z.string().min(1, 'Departamento es requerido'),
  bio: z.string().max(500, 'La bio es demasiado larga').optional().or(z.literal('')),
  specialties: z
    .array(z.enum(['inversion', 'vivienda', 'lote', 'comercial', 'arriendo', 'finca']))
    .min(1, 'Selecciona al menos una especialidad'),
  yearsExperience: z.coerce
    .number()
    .min(0, 'Experiencia invalida')
    .max(50, 'Experiencia invalida'),
})

export const propertySchema = z.object({
  title: z
    .string()
    .min(5, 'El titulo debe tener al menos 5 caracteres')
    .max(150, 'El titulo es demasiado largo'),
  description: z
    .string()
    .min(20, 'La descripcion debe tener al menos 20 caracteres')
    .max(2000, 'La descripcion es demasiado larga'),
  operation: z.enum(['venta', 'arriendo']),
  type: z.enum([
    'apartamento',
    'casa',
    'apartaestudio',
    'oficina',
    'local_comercial',
    'bodega',
    'lote',
    'finca',
    'otro',
  ]),
  price: z.coerce.number().min(1, 'El precio es requerido'),
  bedrooms: z.coerce.number().min(0).max(20),
  bathrooms: z.coerce.number().min(0).max(20),
  areaM2: z.coerce.number().min(1, 'El area es requerida'),
  garageSpaces: z.coerce.number().min(0).max(10),
  city: z.string().min(1, 'Selecciona una ciudad'),
  department: z.string().min(1, 'Departamento es requerido'),
  neighborhood: z.string().min(1, 'El barrio es requerido'),
  address: z.string().min(1, 'La direccion es requerida'),
  isColegaje: z.boolean().default(false),
  colegajeCommissionSplit: z.coerce.number().min(0).max(100).default(50),
})

export const contactFormSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('Email invalido').optional().or(z.literal('')),
  phone: z.string().min(7, 'Telefono invalido'),
  message: z.string().max(500, 'Mensaje demasiado largo').optional().or(z.literal('')),
})

export const connectionRequestSchema = z.object({
  receiverId: z.string().min(1),
  message: z.string().max(300, 'Mensaje demasiado largo').optional().or(z.literal('')),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type OnboardingInput = z.infer<typeof onboardingSchema>
export type PropertyInput = z.infer<typeof propertySchema>
export type ContactFormInput = z.infer<typeof contactFormSchema>
export type ConnectionRequestInput = z.infer<typeof connectionRequestSchema>
