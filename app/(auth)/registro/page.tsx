'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterInput } from '@/lib/validators'
import { signUp, setSessionCookie } from '@/lib/firebase/auth'
import { createAgent } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setError('')
    setLoading(true)
    try {
      const user = await signUp(data.email, data.password, data.fullName)
      await setSessionCookie(user)
      await createAgent(data.fullName, data.email)
      router.push('/verificar-email')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al registrarse'
      if (message.includes('email-already-in-use')) {
        setError('Este email ya esta registrado')
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Cuenta</CardTitle>
        <CardDescription>Registrate como agente inmobiliario en RAIFI</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input id="fullName" placeholder="Sofia Martinez" {...register('fullName')} />
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="sofia@ejemplo.com" {...register('email')} />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contrasena</Label>
            <Input id="password" type="password" placeholder="Minimo 6 caracteres" {...register('password')} />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </Button>
          <p className="text-sm text-muted-foreground">
            Ya tienes cuenta?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Inicia Sesion
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
