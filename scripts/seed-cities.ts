import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
}

initializeApp({ credential: cert(serviceAccount as Parameters<typeof cert>[0]) })
const db = getFirestore()

const cities = [
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
]

async function seed() {
  const batch = db.batch()

  for (const city of cities) {
    const ref = db.collection('cities').doc()
    batch.set(ref, { ...city, isActive: true })
  }

  await batch.commit()
  console.log(`Seeded ${cities.length} cities`)
}

seed().catch(console.error)
