import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getAgentOnboardingStatus } from '@/app/actions/auth'
import { Sidebar } from '@/components/layout/sidebar'
import { MobileSidebar } from '@/components/layout/mobile-sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const status = await getAgentOnboardingStatus()

  if (status && !status.isOnboarded) {
    redirect('/onboarding')
  }

  return (
    <div className="flex h-screen">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex h-16 items-center border-b px-4 lg:hidden">
          <MobileSidebar />
          <Image src="/images/logo-icon.png" alt="RAIFI" width={28} height={28} className="ml-3 h-7 w-auto" />
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
