import Hero from "./components/Hero"
import { LoginButton } from "./components/LoginButton"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <Hero />
        <div className="mt-12">
          <LoginButton />
        </div>
      </div>
    </main>
  )
}
