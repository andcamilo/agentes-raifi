export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <a href="https://raifi.com" className="mb-8 text-2xl font-bold text-primary">
        RAIFI
      </a>
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
