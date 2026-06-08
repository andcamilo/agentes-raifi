'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema, type ContactFormInput } from '@/lib/validators'
import { submitContactForm } from '@/app/actions/leads'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'

interface ContactFormProps {
  propertyId: string
  propertyTitle: string
  agentId: string
}

export function ContactForm({ propertyId, propertyTitle, agentId }: ContactFormProps) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
  })

  const onSubmit = async (data: ContactFormInput) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.set('name', data.name)
      formData.set('email', data.email || '')
      formData.set('phone', data.phone)
      formData.set('message', data.message || '')

      const result = await submitContactForm(propertyId, propertyTitle, agentId, formData)
      if (result.success) {
        setSent(true)
        toast({ title: 'Mensaje enviado', description: 'El agente se pondra en contacto contigo.' })
      } else {
        toast({ title: 'Error', description: result.error, variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'No se pudo enviar el mensaje', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="font-medium text-green-600">Mensaje enviado correctamente</p>
          <p className="mt-1 text-sm text-muted-foreground">El agente se pondra en contacto contigo pronto.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Contactar al Agente</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefono</Label>
            <Input id="phone" {...register('phone')} />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (opcional)</Label>
            <Input id="email" type="email" {...register('email')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Mensaje (opcional)</Label>
            <Textarea id="message" rows={3} {...register('message')} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Mensaje'}
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}
