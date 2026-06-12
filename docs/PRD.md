# RAIFI - PRD (Product Requirements Document)
## Plataforma Inmobiliaria Colaborativa | Next.js + Firebase

---

## Contexto

RAIFI es una plataforma inmobiliaria colaborativa para agentes independientes en Colombia. A diferencia del modelo tradicional (Empresa → Agente → Cliente), RAIFI invierte la ecuación: **el agente es el protagonista**. La plataforma provee marca, tecnología y red de colaboración; el agente mantiene su independencia y se queda con el 90% de la comisión.

**Problema:** Los agentes independientes carecen de herramientas tecnológicas, credibilidad de marca y red de colaboración. Las inmobiliarias tradicionales cobran mensualidades y se quedan con porcentajes altos de comisión.

**Solución:** Plataforma sin costo fijo donde agentes publican inmuebles, construyen su perfil profesional y colaboran entre sí (colegaje). RAIFI solo cobra el 10% sobre negocios efectivamente cerrados y escriturados.

---

## 1. Modelo de Monetización

| Fuente | Detalle |
|---|---|
| Comisión sobre negocios cerrados | 10% de la comisión del agente (agente se queda 90%). Comisión inmobiliaria típica: 3% del valor del inmueble |
| Colegaje | Cuando 2 agentes colaboran, la comisión se divide 50/50, luego RAIFI toma 10% de cada parte |
| Servicios premium (futuro) | Fotografía profesional, video/dron, publicidad Meta/Google, asistencia jurídica, avalúos, créditos hipotecarios |

---

## 2. Personas de Usuario

**Agente Independiente Urbano** - 30s, 3-5 años experiencia, gestiona leads por WhatsApp/Excel, quiere presencia profesional y red de colaboración.

**Agente Veterano Regional** - 45+, 10+ años, tiene inventario pero alcance limitado, busca red nacional sin pagar mensualidades.

**Agente Nuevo** - 25, <1 año experiencia, necesita credibilidad de marca y mentoría.

**Propietario (usuario secundario)** - Busca agente confiable, ve fichas públicas de inmuebles y perfiles de agentes.

---

## 3. Alcance del MVP - Los 3 Pilares

| Pilar | Función |
|---|---|
| **INMUEBLE** | Publicar, buscar y compartir inmuebles |
| **AGENTE** | Perfiles profesionales verificados |
| **COLEGA** | Conectar agentes para colegaje inmobiliario |

### 3.1 EN ALCANCE (MVP)

**Autenticación y Onboarding**
- Registro con email/contraseña (Firebase Auth)
- Login
- Verificación de email
- Recuperación de contraseña
- Onboarding de perfil (ciudad, teléfono, foto, especialidades, bio)

**Módulo Inmueble**
- Creación de inmueble en 4 pasos: Fotos → Info básica → Detalles → Compartir
- Upload de hasta 15 fotos (Firebase Storage)
- Campos: título, descripción, operación (venta/arriendo), tipo (casa, apartamento, oficina, etc.), precio COP, habitaciones, baños, área m², parqueaderos, dirección, ciudad, barrio
- Listado de inmuebles con filtros (operación, tipo, ciudad, precio, habitaciones)
- Página de detalle con galería, specs, info del agente, formulario de contacto
- Ficha pública compartible (WhatsApp, copiar enlace)
- Estados: borrador, activo, pausado, vendido/arrendado
- Toggle "disponible para colegaje"

**Módulo Agente**
- Perfil profesional público: foto, nombre, bio, ciudad, especialidades, años experiencia, estadísticas
- Portafolio de propiedades del agente en su perfil
- Directorio de agentes con búsqueda y filtros (ciudad, especialidad)
- Badge de verificado (admin manual para MVP)
- URL pública con slug: `/agentes/sofia-martinez`

**Módulo Colegaje**
- Feed de inmuebles disponibles para colegaje
- Sistema de solicitud de conexión (agente a agente)
- Estados de conexión: pendiente, aceptada, rechazada
- Contacto entre agentes conectados (redirect a WhatsApp)
- Display de comisión de colegaje en inmuebles compartidos

**Dashboard del Agente**
- Resumen: inmuebles activos, conexiones pendientes
- Acciones rápidas: publicar, buscar colegaje, editar perfil
- Lista de mis inmuebles con gestión de estado
- Lista de mis leads (formularios de contacto recibidos)
- Mis conexiones

**Páginas Públicas (sin auth)**
- Home: hero, features, inmuebles destacados, CTA
- Listado de inmuebles con filtros
- Detalle de inmueble
- Directorio y perfiles de agentes
- Login y registro

### 3.2 FUERA DE ALCANCE (post-MVP)

- Contratos digitales / firma electrónica (v2)
- CRM inmobiliario completo (v2)
- Generación y calificación de leads automatizada (v2)
- Distribución inteligente de clientes (v2)
- Reportes de productividad (v2)
- Chat in-app entre agentes (v2)
- Marketplace de servicios premium (v3)
- Procesamiento de pagos (v2)
- App móvil nativa (v3)
- Búsqueda por mapa (v2)
- Sistema de reviews y ratings (v2)
- Analytics dashboard (v2)
- OAuth social login (Google, Facebook) (v2)

---

## 4. Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Base de datos | Cloud Firestore |
| Auth | Firebase Authentication |
| Storage | Firebase Storage |
| Backend functions | Firebase Admin SDK (server-side en Next.js) |
| Estilos | Tailwind CSS + shadcn/ui |
| Formularios | React Hook Form + Zod |
| Fetching cliente | TanStack Query |
| Lenguaje | TypeScript |
| Deploy | Vercel |

---

## 5. Estructura de Rutas

```
/app/
  (public)/                          -- Layout público (header/footer marketing)
    page.tsx                         -- Home (/)
    inmuebles/
      page.tsx                       -- Listado de inmuebles
      [id]/page.tsx                  -- Detalle de inmueble
    agentes/
      page.tsx                       -- Directorio de agentes
      [slug]/page.tsx                -- Perfil de agente

  (auth)/                            -- Layout auth (centrado, minimal)
    login/page.tsx                   -- Login
    registro/page.tsx                -- Registro
    verificar-email/page.tsx         -- Verificación de email
    recuperar-clave/page.tsx         -- Recuperar contraseña
    onboarding/page.tsx              -- Completar perfil

  (dashboard)/                       -- Layout autenticado (sidebar)
    dashboard/page.tsx               -- Dashboard principal
    mis-inmuebles/
      page.tsx                       -- Mis inmuebles
      nuevo/page.tsx                 -- Crear inmueble (4 pasos)
      [id]/editar/page.tsx           -- Editar inmueble
    colegaje/page.tsx                -- Feed de colegaje
    mi-red/page.tsx                  -- Mis conexiones
    perfil/page.tsx                  -- Editar mi perfil
    leads/page.tsx                   -- Mis leads

  layout.tsx                         -- Root layout
  not-found.tsx                      -- 404
```

**Middleware (`/middleware.ts`):**
- Verifica token de Firebase Auth (cookie `__session`) en rutas protegidas
- Protege rutas `/dashboard/*`, `/mis-inmuebles/*`, `/colegaje`, `/mi-red`, `/perfil`, `/leads`
- Redirige no autenticados a `/login?redirect=[path]`
- Redirige autenticados fuera de `/login` y `/registro`

**Nota:** La verificación de onboarding se hace en el layout de `(dashboard)` consultando Firestore, no en middleware (para evitar llamadas a Firestore en edge).

---

## 6. Modelo de Datos (Firestore)

### Colección: `agents`
Documento ID = Firebase Auth UID

```typescript
interface Agent {
  uid: string;                    // Firebase Auth UID
  fullName: string;
  email: string;
  phone: string | null;
  slug: string;                   // URL-friendly: "sofia-martinez"
  avatarUrl: string | null;
  bio: string | null;
  city: string | null;
  department: string | null;      // Departamento colombiano
  specialties: Specialty[];       // ['inversion', 'vivienda', 'comercial', ...]
  yearsExperience: number;
  dealsClosed: number;            // Manual para MVP
  isVerified: boolean;            // Admin manual
  isOnboarded: boolean;
  isActive: boolean;
  whatsappNumber: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

type Specialty = 'inversion' | 'vivienda' | 'lote' | 'comercial' | 'arriendo' | 'finca';
```

### Colección: `properties`
Documento ID = auto-generated

```typescript
interface Property {
  id: string;
  agentId: string;                // ref a agents
  agentName: string;              // denormalizado para listados
  agentAvatarUrl: string | null;  // denormalizado para listados
  title: string;
  description: string;
  operation: 'venta' | 'arriendo';
  type: PropertyType;
  status: 'draft' | 'active' | 'paused' | 'sold' | 'rented';
  price: number;                  // COP
  bedrooms: number;
  bathrooms: number;
  areaM2: number;
  garageSpaces: number;
  city: string;
  department: string;
  neighborhood: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  images: PropertyImage[];        // array embebido (max 15)
  isFeatured: boolean;
  isColegaje: boolean;
  colegajeCommissionSplit: number; // default 50
  viewsCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface PropertyImage {
  id: string;
  storagePath: string;
  url: string;
  displayOrder: number;
  isCover: boolean;
}

type PropertyType = 'apartamento' | 'casa' | 'apartaestudio' | 'oficina' |
  'local_comercial' | 'bodega' | 'lote' | 'finca' | 'otro';
```

### Colección: `connections`
Documento ID = auto-generated

```typescript
interface Connection {
  id: string;
  requesterId: string;            // ref a agents
  receiverId: string;             // ref a agents
  requesterName: string;          // denormalizado
  receiverName: string;           // denormalizado
  status: 'pending' | 'accepted' | 'declined';
  message: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Colección: `leads`
Documento ID = auto-generated

```typescript
interface Lead {
  id: string;
  propertyId: string | null;      // ref a properties
  propertyTitle: string | null;    // denormalizado
  agentId: string;                // ref a agents (receptor del lead)
  name: string;
  email: string | null;
  phone: string;
  message: string | null;
  source: 'web' | 'whatsapp' | 'colegaje';
  isRead: boolean;
  createdAt: Timestamp;
}
```

### Colección: `cities`
Documento ID = auto-generated (datos de referencia)

```typescript
interface City {
  name: string;
  department: string;
  isActive: boolean;
}
```

### Indices Compuestos (Firestore)
```
properties: (status ASC, city ASC, createdAt DESC)
properties: (status ASC, operation ASC, createdAt DESC)
properties: (status ASC, type ASC, createdAt DESC)
properties: (status ASC, isColegaje ASC, createdAt DESC)
properties: (agentId ASC, status ASC, createdAt DESC)
connections: (receiverId ASC, status ASC, createdAt DESC)
connections: (requesterId ASC, status ASC, createdAt DESC)
leads: (agentId ASC, isRead ASC, createdAt DESC)
agents: (city ASC, isActive ASC)
```

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Agents: lectura pública, escritura solo el propio agente
    match /agents/{agentId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == agentId;
      allow update: if request.auth != null && request.auth.uid == agentId;
      allow delete: if false;
    }

    // Properties: lectura pública para activos, CRUD del dueño
    match /properties/{propertyId} {
      allow read: if resource.data.status == 'active'
                  || (request.auth != null && resource.data.agentId == request.auth.uid);
      allow create: if request.auth != null && request.resource.data.agentId == request.auth.uid;
      allow update: if request.auth != null && resource.data.agentId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.agentId == request.auth.uid;
    }

    // Connections: visible para ambas partes
    match /connections/{connectionId} {
      allow read: if request.auth != null
                  && (resource.data.requesterId == request.auth.uid
                      || resource.data.receiverId == request.auth.uid);
      allow create: if request.auth != null
                    && request.resource.data.requesterId == request.auth.uid;
      allow update: if request.auth != null
                    && resource.data.receiverId == request.auth.uid;
      allow delete: if false;
    }

    // Leads: lectura solo del agente receptor, creación pública
    match /leads/{leadId} {
      allow read: if request.auth != null && resource.data.agentId == request.auth.uid;
      allow create: if true;
      allow update: if request.auth != null && resource.data.agentId == request.auth.uid;
      allow delete: if false;
    }

    // Cities: solo lectura
    match /cities/{cityId} {
      allow read: if true;
      allow write: if false; // solo admin via Admin SDK
    }
  }
}
```

### Firebase Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Property images: lectura pública, escritura autenticada
    match /property-images/{agentId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == agentId;
    }

    // Avatars: lectura pública, escritura del propio usuario
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 7. Server Actions y API

### Server Actions (mutaciones via Firebase Admin SDK)
```
/app/actions/
  auth.ts         -- createAgent (post-signup), completeOnboarding
  properties.ts   -- createProperty, updateProperty, deleteProperty, updateStatus, toggleColegaje
  agents.ts       -- updateProfile
  connections.ts  -- sendRequest, respondToConnection
  leads.ts        -- submitContactForm, markAsRead
  images.ts       -- uploadImage, deleteImage, reorderImages
```

### Route Handlers (queries server-side para SSR/ISR)
```
/app/api/
  properties/route.ts          -- GET: listar con filtros y paginación
  properties/[id]/route.ts     -- GET: detalle de inmueble
  agentes/route.ts             -- GET: listar agentes con filtros
  agentes/[slug]/route.ts      -- GET: perfil de agente
  colegaje/route.ts            -- GET: inmuebles disponibles para colegaje
  cities/route.ts              -- GET: ciudades para dropdowns
```

### Estrategia de Data Fetching
- **Páginas públicas**: Server Components con Firebase Admin SDK + ISR (revalidación al cambiar datos)
- **Páginas autenticadas**: Client Components con Firebase Client SDK + TanStack Query para queries en tiempo real
- **Mutaciones**: Server Actions que usan Firebase Admin SDK con validación Zod
- **Auth en servidor**: Verificar token via `firebase-admin` decodificando la cookie `__session`

---

## 8. Estructura del Proyecto

```
/
  /app/                    -- Páginas y layouts (App Router)
  /components/
    /ui/                   -- Componentes base shadcn/ui
    /properties/           -- Componentes de inmuebles
    /agents/               -- Componentes de agentes
    /colegaje/             -- Componentes de colegaje
    /layout/               -- Header, Footer, Sidebar, Nav
    /forms/                -- Formularios
  /lib/
    /firebase/
      config.ts            -- Firebase client config (initializeApp)
      admin.ts             -- Firebase Admin SDK (server-only)
      auth.ts              -- Auth helpers (signIn, signUp, signOut, onAuthStateChanged)
      firestore.ts         -- Firestore client helpers
      storage.ts           -- Storage upload/delete helpers
    utils.ts
    formatters.ts          -- Formateo de precios COP, fechas
    validators.ts          -- Schemas Zod
    constants.ts           -- Enums, opciones, config
  /types/
    index.ts               -- Interfaces TypeScript (Agent, Property, etc.)
  /hooks/
    use-auth.ts            -- Hook de auth state (onAuthStateChanged)
    use-properties.ts      -- Queries de inmuebles
    use-agents.ts          -- Queries de agentes
    use-connections.ts     -- Queries de conexiones
  /contexts/
    auth-context.tsx       -- Provider de autenticación (Firebase Auth state)
  /public/images/          -- Imágenes estáticas, logos
  /docs/                   -- Documentación del proyecto
```

---

## 9. Flujo de Autenticación (Firebase Auth)

**Registro:**
1. Usuario llena formulario (nombre, email, contraseña)
2. Client-side: `createUserWithEmailAndPassword(auth, email, password)`
3. Client-side: `updateProfile(user, { displayName: fullName })`
4. Client-side: `sendEmailVerification(user)`
5. Server Action `createAgent()`: crea documento en `agents` con `isOnboarded: false`
6. Se establece cookie `__session` con el ID token para SSR
7. Usuario redirigido a `/verificar-email`
8. Tras verificar → redirigido a `/onboarding`
9. Completa perfil → `isOnboarded: true` → redirigido a `/dashboard`

**Login:**
1. Client-side: `signInWithEmailAndPassword(auth, email, password)`
2. Obtener ID token → establecer cookie `__session` via API route `/api/auth/session`
3. Si onboarded → `/dashboard`
4. Si no onboarded → `/onboarding`

**Sesión:**
- Cookie `__session` con Firebase ID token
- Middleware verifica token con `firebase-admin` `verifyIdToken()`
- Client-side: `onAuthStateChanged` listener para estado reactivo
- Token refresh automático por Firebase SDK; actualizar cookie periódicamente

**Logout:**
- Client-side: `signOut(auth)`
- API route `/api/auth/session` DELETE para borrar cookie
- Redirect a `/`

---

## 10. SEO

- SSR para todas las páginas públicas con meta tags completos
- Open Graph images dinámicas para compartir inmuebles
- JSON-LD structured data (RealEstateListing schema)
- Sitemap dinámico para inmuebles activos y agentes verificados
- URLs amigables: `/agentes/sofia-martinez`, `/inmuebles/[id]`

---

## 11. Fases de Desarrollo

### Fase 1: Fundación (Semanas 1-2) - COMPLETADA
- Setup: Next.js, Firebase, Tailwind, shadcn/ui, TypeScript
- Configuración Firebase (Auth, Firestore, Storage)
- Firestore Security Rules + Storage Rules
- Auth: registro, login, verificación email, cookie session, middleware
- Layout components: header, footer, navegación
- Auth context provider
- Onboarding flow
- Seed data de ciudades colombianas

### Fase 2: Módulo Inmueble (Semanas 3-4) - COMPLETADA
- Formulario de creación 4 pasos + upload de imágenes a Firebase Storage
- Listado con filtros (queries Firestore con índices compuestos)
- Página de detalle (SSR con Firebase Admin SDK)
- Compartir ficha pública (OG tags, WhatsApp)
- Gestión de mis inmuebles (cambiar estado, editar, eliminar)

### Fase 3: Módulo Agente (Semanas 5-6) - COMPLETADA
- Perfil público de agente (SSR)
- Directorio de agentes con búsqueda/filtros
- Edición de perfil
- Dashboard home con estadísticas

### Fase 4: Módulo Colegaje (Semanas 6-7) - COMPLETADA
- Feed de colegaje (inmuebles con `isColegaje: true`)
- Sistema de conexiones entre agentes
- Toggle colegaje en creación de inmueble
- Página mis conexiones

### Fase 5: Pulido y Lanzamiento (Semana 8) - PARCIAL
- [x] Home page con inmuebles destacados
- [x] Deploy a producción (Vercel)
- [x] Logos integrados
- [ ] SEO (sitemap, structured data, OG images)
- [ ] QA responsive en múltiples dispositivos
- [ ] Optimización de rendimiento
- [ ] Manejo de errores y estados de carga

---

## 12. Métricas de Éxito

**North Star:** Número de inmuebles compartidos en colegaje por mes.

| Categoría | Métrica | Meta (3 meses) |
|---|---|---|
| Adquisición | Agentes registrados | 100 |
| Adquisición | Tasa de onboarding completado | >70% |
| Activación | Agentes con ≥1 inmueble publicado | >50% |
| Inmuebles | Listados activos totales | 300 |
| Colegaje | Inmuebles marcados para colegaje | >30% |
| Colegaje | Solicitudes de conexión | 200 |
| Engagement | Agentes activos mensuales | >50% |
| Leads | Formularios de contacto | 500 |

---

## 13. Setup Inicial de Firebase (desde cero)

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar **Authentication** → Sign-in method → Email/Password
3. Crear base de datos **Cloud Firestore** (production mode)
4. Habilitar **Firebase Storage**
5. Registrar app web en Project Settings → obtener config
6. Generar clave de service account: Project Settings → Service Accounts → Generate new private key
7. Configurar variables de entorno en `.env.local`:
   ```
   # Firebase Client (públicas)
   NEXT_PUBLIC_FIREBASE_API_KEY=xxx
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
   NEXT_PUBLIC_FIREBASE_APP_ID=xxx

   # Firebase Admin (privadas, server-only)
   FIREBASE_PROJECT_ID=xxx
   FIREBASE_CLIENT_EMAIL=xxx
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```
8. Instalar paquetes: `firebase` (client) y `firebase-admin` (server)
9. Desplegar Security Rules desde Firebase Console o via Firebase CLI (`firebase deploy --only firestore:rules,storage`)
10. Poblar colección `cities` con ciudades colombianas principales via script o Firebase Console

---

## 14. Estado Actual del Proyecto

### Lo que funciona (con mock data):
- Todas las páginas públicas: home, inmuebles, detalle inmueble, agentes, perfil agente
- Dashboard completo: stats, mis inmuebles, leads, mi red, colegaje, perfil
- Auth pages: login, registro, verificar email, recuperar clave, onboarding
- Logos integrados en header, footer y sidebar
- Deploy en Vercel: https://ralfi.vercel.app

### Pendiente para producción:
- Crear proyecto Firebase y configurar env vars
- Reactivar Firebase en los archivos stub (`lib/firebase/admin.ts`, `auth.ts`, `config.ts`, `firestore.ts`, `storage.ts`)
- Reactivar server actions (`app/actions/*.ts`)
- Reactivar API routes (`app/api/**/*.ts`)
- Los archivos originales con Firebase real están en el historial de git (commit `bbfe6bd`)

---

## 15. Verificación

### Para probar los cambios end-to-end:
1. **Auth**: Registrar usuario → verificar email → completar onboarding → login → ver dashboard
2. **Inmueble**: Crear inmueble (4 pasos con fotos) → ver en listado público → abrir detalle → compartir por WhatsApp → editar → pausar → reactivar
3. **Agente**: Editar perfil → ver perfil público → buscar en directorio → filtrar por ciudad/especialidad
4. **Colegaje**: Marcar inmueble como colegaje → ver en feed de colegaje → enviar solicitud de conexión → aceptar conexión → contactar por WhatsApp
5. **Leads**: Enviar formulario de contacto en detalle de inmueble → ver lead en dashboard del agente → marcar como leído
6. **Security Rules**: Verificar que un agente NO puede editar inmuebles de otro agente, NI ver leads de otro agente
7. **SEO**: Verificar meta tags, OG tags, y structured data en páginas públicas
8. **Responsive**: Probar en mobile, tablet y desktop
