'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { onboardingSchema, type OnboardingInput } from '@/lib/validators'
import { completeOnboarding } from '@/app/actions/auth'
import { uploadAvatar } from '@/lib/firebase/storage'
import { useAuth } from '@/contexts/auth-context'
import { SPECIALTIES, COLOMBIAN_CITIES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      specialties: [],
      yearsExperience: 0,
    },
  })

  const selectedCity = watch('city')
  const selectedSpecialties = watch('specialties')

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value
    const city = COLOMBIAN_CITIES.find((c) => c.name === cityName)
    setValue('city', cityName)
    if (city) setValue('department', city.department)
  }

  const toggleSpecialty = (specialty: OnboardingInput['specialties'][number]) => {
    const current = selectedSpecialties || []
    if (current.includes(specialty)) {
      setValue(
        'specialties',
        current.filter((s) => s !== specialty),
      )
    } else {
      setValue('specialties', [...current, specialty])
    }
  }

  const onSubmit = async (data: OnboardingInput) => {
    setError('')
    setLoading(true)
    try {
      let avatarUrl: string | null = null
      if (avatarFile && user) {
        const result = await uploadAvatar(user.uid, avatarFile)
        avatarUrl = result.url
      }

      const formData = new FormData()
      formData.set('phone', data.phone)
      formData.set('whatsappNumber', data.whatsappNumber)
      formData.set('city', data.city)
      formData.set('department', data.department)
      formData.set('bio', data.bio || '')
      formData.set('yearsExperience', String(data.yearsExperience))
      data.specialties.forEach((s) => formData.append('specialties', s))
      if (avatarUrl) formData.set('avatarUrl', avatarUrl)

      const result = await completeOnboarding(formData)
      if (result.success) {
        router.push('/dashboard')
      } else {
        setError(result.error || 'Error al completar perfil')
      }
    } catch {
      setError('Error al completar perfil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Completa tu Perfil</CardTitle>
        <CardDescription>
          Configura tu perfil de agente para comenzar a usar RAIFI
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Avatar */}
          <div className="space-y-2">
            <Label>Foto de perfil</Label>
            <div className="flex items-center gap-4">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Preview"
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  Foto
                </div>
              )}
              <Input type="file" accept="image/*" onChange={handleAvatarChange} />
            </div>
          </div>

          {/* Phone */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefono</Label>
              <Input id="phone" placeholder="3001234567" {...register('phone')} />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">WhatsApp</Label>
              <Input id="whatsappNumber" placeholder="3001234567" {...register('whatsappNumber')} />
              {errors.whatsappNumber && (
                <p className="text-sm text-destructive">{errors.whatsappNumber.message}</p>
              )}
            </div>
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city">Ciudad</Label>
            <select
              id="city"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              onChange={handleCityChange}
              value={selectedCity || ''}
            >
              <option value="">Selecciona una ciudad</option>
              {COLOMBIAN_CITIES.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}, {city.department}
                </option>
              ))}
            </select>
            <input type="hidden" {...register('department')} />
            {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
          </div>

          {/* Specialties */}
          <div className="space-y-2">
            <Label>Especialidades</Label>
            <div className="flex flex-wrap gap-2">
              {SPECIALTIES.map((spec) => (
                <button
                  key={spec.value}
                  type="button"
                  onClick={() => toggleSpecialty(spec.value)}
                  className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                    selectedSpecialties?.includes(spec.value)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input hover:bg-accent'
                  }`}
                >
                  {spec.label}
                </button>
              ))}
            </div>
            {errors.specialties && (
              <p className="text-sm text-destructive">{errors.specialties.message}</p>
            )}
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label htmlFor="yearsExperience">Anos de experiencia</Label>
            <Input
              id="yearsExperience"
              type="number"
              min={0}
              max={50}
              {...register('yearsExperience')}
            />
            {errors.yearsExperience && (
              <p className="text-sm text-destructive">{errors.yearsExperience.message}</p>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio (opcional)</Label>
            <Textarea
              id="bio"
              placeholder="Cuentanos sobre ti y tu experiencia inmobiliaria..."
              rows={3}
              {...register('bio')}
            />
            {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Guardando...' : 'Completar Perfil'}
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}
