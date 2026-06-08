'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { onboardingSchema, type OnboardingInput } from '@/lib/validators'
import { updateProfile } from '@/app/actions/agents'
import { uploadAvatar } from '@/lib/firebase/storage'
import { useAuth } from '@/contexts/auth-context'
import { SPECIALTIES, COLOMBIAN_CITIES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import type { AgentSerialized } from '@/types'

export default function ProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
  })

  const selectedSpecialties = watch('specialties')

  useEffect(() => {
    if (!user) return
    async function fetchProfile() {
      const res = await fetch(`/api/agentes?uid=${user!.uid}`)
      if (res.ok) {
        const data = await res.json()
        const agent = data.agents?.find((a: AgentSerialized) => a.uid === user!.uid)
        if (agent) {
          reset({
            phone: agent.phone || '',
            whatsappNumber: agent.whatsappNumber || '',
            city: agent.city || '',
            department: agent.department || '',
            bio: agent.bio || '',
            specialties: agent.specialties || [],
            yearsExperience: agent.yearsExperience || 0,
          })
          setCurrentAvatar(agent.avatarUrl)
        }
      }
      setFetching(false)
    }
    fetchProfile()
  }, [user, reset])

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
      setValue('specialties', current.filter((s) => s !== specialty))
    } else {
      setValue('specialties', [...current, specialty])
    }
  }

  const onSubmit = async (data: OnboardingInput) => {
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

      const result = await updateProfile(formData)
      if (result.success) {
        toast({ title: 'Perfil actualizado' })
      } else {
        toast({ title: 'Error', description: result.error, variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="py-12 text-center text-muted-foreground">Cargando...</div>

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Mi Perfil</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label>Foto de perfil</Label>
              <div className="flex items-center gap-4">
                {(avatarPreview || currentAvatar) ? (
                  <img src={avatarPreview || currentAvatar!} alt="Avatar" className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">Foto</div>
                )}
                <Input type="file" accept="image/*" onChange={handleAvatarChange} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Telefono</Label>
                <Input {...register('phone')} />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input {...register('whatsappNumber')} />
                {errors.whatsappNumber && <p className="text-sm text-destructive">{errors.whatsappNumber.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ciudad</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={watch('city') || ''} onChange={handleCityChange}>
                <option value="">Seleccionar</option>
                {COLOMBIAN_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}, {c.department}</option>
                ))}
              </select>
              <input type="hidden" {...register('department')} />
            </div>
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
            </div>
            <div className="space-y-2">
              <Label>Anos de experiencia</Label>
              <Input type="number" min={0} max={50} {...register('yearsExperience')} />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea rows={3} {...register('bio')} />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Perfil'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
