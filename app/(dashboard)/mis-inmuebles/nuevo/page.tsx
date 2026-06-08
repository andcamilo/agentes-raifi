'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { propertySchema, type PropertyInput } from '@/lib/validators'
import { createProperty } from '@/app/actions/properties'
import { uploadPropertyImage } from '@/lib/firebase/storage'
import { useAuth } from '@/contexts/auth-context'
import { PROPERTY_TYPES, OPERATION_TYPES, COLOMBIAN_CITIES, MAX_PROPERTY_IMAGES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { Upload, X, ArrowLeft, ArrowRight } from 'lucide-react'
import type { PropertyImage } from '@/types'

const STEPS = ['Fotos', 'Info Basica', 'Detalles', 'Publicar']

export default function NewPropertyPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [images, setImages] = useState<{ file: File; preview: string; id: string }[]>([])
  const [uploadedImages, setUploadedImages] = useState<PropertyImage[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<PropertyInput>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      isColegaje: false,
      colegajeCommissionSplit: 50,
      bedrooms: 0,
      bathrooms: 0,
      garageSpaces: 0,
    },
  })

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const remaining = MAX_PROPERTY_IMAGES - images.length
    const toAdd = files.slice(0, remaining)

    const newImages = toAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: crypto.randomUUID(),
    }))
    setImages((prev) => [...prev, ...newImages])
  }

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const uploadAllImages = async () => {
    if (!user || images.length === 0) return
    setUploadingImages(true)

    const uploaded: PropertyImage[] = []
    for (let i = 0; i < images.length; i++) {
      const img = images[i]
      const result = await uploadPropertyImage(user.uid, img.file, img.id)
      uploaded.push({
        id: img.id,
        storagePath: result.storagePath,
        url: result.url,
        displayOrder: i,
        isCover: i === 0,
      })
    }
    setUploadedImages(uploaded)
    setUploadingImages(false)
  }

  const nextStep = async () => {
    if (step === 0) {
      if (images.length === 0) {
        toast({ title: 'Agrega al menos una foto', variant: 'destructive' })
        return
      }
      await uploadAllImages()
    }
    if (step === 1) {
      const valid = await trigger(['title', 'description', 'operation', 'type', 'price'])
      if (!valid) return
    }
    if (step === 2) {
      const valid = await trigger(['bedrooms', 'bathrooms', 'areaM2', 'garageSpaces', 'city', 'department', 'neighborhood', 'address'])
      if (!valid) return
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const prevStep = () => setStep((s) => Math.max(s - 1, 0))

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value
    const city = COLOMBIAN_CITIES.find((c) => c.name === cityName)
    setValue('city', cityName)
    if (city) setValue('department', city.department)
  }

  const onSubmit = async (data: PropertyInput) => {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formData.set(key, String(value))
      })
      formData.set('status', 'active')

      const result = await createProperty(formData, uploadedImages)
      if (result.success) {
        toast({ title: 'Inmueble publicado correctamente' })
        router.push('/mis-inmuebles')
      } else {
        toast({ title: 'Error', description: result.error, variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'No se pudo publicar el inmueble', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Publicar Inmueble</h1>

      {/* Steps indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {i + 1}
            </div>
            <span className={`hidden text-sm sm:inline ${i <= step ? 'font-medium' : 'text-muted-foreground'}`}>
              {s}
            </span>
            {i < STEPS.length - 1 && <div className="h-px w-4 bg-border sm:w-8" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Photos */}
        {step === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Fotos del Inmueble</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {images.map((img) => (
                  <div key={img.id} className="group relative aspect-square overflow-hidden rounded-md">
                    <img src={img.preview} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {images.length < MAX_PROPERTY_IMAGES && (
                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed hover:bg-accent">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="mt-1 text-xs text-muted-foreground">Agregar</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageAdd}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {images.length}/{MAX_PROPERTY_IMAGES} fotos. La primera sera la portada.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Basic Info */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Informacion Basica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titulo</Label>
                <Input id="title" placeholder="Ej: Apartamento moderno en Chapinero" {...register('title')} />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripcion</Label>
                <Textarea id="description" rows={4} placeholder="Describe el inmueble..." {...register('description')} />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Operacion</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...register('operation')}>
                    <option value="">Seleccionar</option>
                    {OPERATION_TYPES.map((op) => (
                      <option key={op.value} value={op.value}>{op.label}</option>
                    ))}
                  </select>
                  {errors.operation && <p className="text-sm text-destructive">{errors.operation.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...register('type')}>
                    <option value="">Seleccionar</option>
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Precio (COP)</Label>
                <Input id="price" type="number" placeholder="350000000" {...register('price')} />
                {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Details */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Detalles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  {errors.areaM2 && <p className="text-sm text-destructive">{errors.areaM2.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Parqueaderos</Label>
                  <Input type="number" min={0} {...register('garageSpaces')} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Ciudad</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={watch('city') || ''}
                  onChange={handleCityChange}
                >
                  <option value="">Seleccionar</option>
                  {COLOMBIAN_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}, {c.department}</option>
                  ))}
                </select>
                <input type="hidden" {...register('department')} />
                {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="neighborhood">Barrio</Label>
                <Input id="neighborhood" {...register('neighborhood')} />
                {errors.neighborhood && <p className="text-sm text-destructive">{errors.neighborhood.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Direccion</Label>
                <Input id="address" {...register('address')} />
                {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...register('isColegaje')} className="rounded" />
                  <span className="text-sm font-medium">Disponible para colegaje</span>
                </label>
                {watch('isColegaje') && (
                  <div className="ml-6 space-y-1">
                    <Label>Comision colegaje (%)</Label>
                    <Input type="number" min={0} max={100} {...register('colegajeCommissionSplit')} className="w-24" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Publish */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Listo para Publicar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Revisa que toda la informacion sea correcta. Al publicar, tu inmueble sera visible para todos.
              </p>
              <div className="rounded-lg bg-muted p-4 text-sm">
                <p><strong>Titulo:</strong> {watch('title')}</p>
                <p><strong>Operacion:</strong> {watch('operation')}</p>
                <p><strong>Tipo:</strong> {watch('type')}</p>
                <p><strong>Precio:</strong> ${watch('price')?.toLocaleString?.('es-CO') || watch('price')}</p>
                <p><strong>Ciudad:</strong> {watch('city')}</p>
                <p><strong>Fotos:</strong> {uploadedImages.length}</p>
                {watch('isColegaje') && <p><strong>Colegaje:</strong> Si ({watch('colegajeCommissionSplit')}%)</p>}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="mt-4 flex justify-between">
          <Button type="button" variant="outline" onClick={prevStep} disabled={step === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
          </Button>
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={nextStep} disabled={uploadingImages}>
              {uploadingImages ? 'Subiendo fotos...' : 'Siguiente'} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={loading}>
              {loading ? 'Publicando...' : 'Publicar Inmueble'}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
