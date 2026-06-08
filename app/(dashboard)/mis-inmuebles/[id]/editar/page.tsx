'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { propertySchema, type PropertyInput } from '@/lib/validators'
import { updateProperty } from '@/app/actions/properties'
import { PROPERTY_TYPES, OPERATION_TYPES, COLOMBIAN_CITIES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import type { PropertySerialized } from '@/types'

export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PropertyInput>({
    resolver: zodResolver(propertySchema),
  })

  useEffect(() => {
    async function fetchProperty() {
      const res = await fetch(`/api/properties/${id}`)
      if (!res.ok) {
        toast({ title: 'Inmueble no encontrado', variant: 'destructive' })
        router.push('/mis-inmuebles')
        return
      }
      const property: PropertySerialized = await res.json()
      reset({
        title: property.title,
        description: property.description,
        operation: property.operation,
        type: property.type,
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        areaM2: property.areaM2,
        garageSpaces: property.garageSpaces,
        city: property.city,
        department: property.department,
        neighborhood: property.neighborhood,
        address: property.address,
        isColegaje: property.isColegaje,
        colegajeCommissionSplit: property.colegajeCommissionSplit,
      })
      setFetching(false)
    }
    fetchProperty()
  }, [id, reset, router])

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value
    const city = COLOMBIAN_CITIES.find((c) => c.name === cityName)
    setValue('city', cityName)
    if (city) setValue('department', city.department)
  }

  const onSubmit = async (data: PropertyInput) => {
    setLoading(true)
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.set(key, String(value))
    })

    const result = await updateProperty(id, formData)
    if (result.success) {
      toast({ title: 'Inmueble actualizado' })
      router.push('/mis-inmuebles')
    } else {
      toast({ title: 'Error', description: result.error, variant: 'destructive' })
    }
    setLoading(false)
  }

  if (fetching) {
    return <div className="text-center py-12 text-muted-foreground">Cargando...</div>
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Editar Inmueble</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader><CardTitle>Informacion</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Titulo</Label>
              <Input {...register('title')} />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Descripcion</Label>
              <Textarea rows={4} {...register('description')} />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Operacion</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...register('operation')}>
                  {OPERATION_TYPES.map((op) => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...register('type')}>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Precio (COP)</Label>
              <Input type="number" {...register('price')} />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="space-y-2">
                <Label>Habitaciones</Label>
                <Input type="number" min={0} {...register('bedrooms')} />
              </div>
              <div className="space-y-2">
                <Label>Banos</Label>
                <Input type="number" min={0} {...register('bathrooms')} />
              </div>
              <div className="space-y-2">
                <Label>Area m2</Label>
                <Input type="number" min={1} {...register('areaM2')} />
              </div>
              <div className="space-y-2">
                <Label>Parqueaderos</Label>
                <Input type="number" min={0} {...register('garageSpaces')} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ciudad</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={watch('city') || ''} onChange={handleCityChange}>
                {COLOMBIAN_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}, {c.department}</option>
                ))}
              </select>
              <input type="hidden" {...register('department')} />
            </div>
            <div className="space-y-2">
              <Label>Barrio</Label>
              <Input {...register('neighborhood')} />
            </div>
            <div className="space-y-2">
              <Label>Direccion</Label>
              <Input {...register('address')} />
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('isColegaje')} className="rounded" />
              <span className="text-sm font-medium">Disponible para colegaje</span>
            </label>
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/mis-inmuebles')}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
