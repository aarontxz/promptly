"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { apiService, User } from "../../lib/api"

export function LoginButton() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [backendUser, setBackendUser] = useState<User | null>(null)

  // Sync with backend when session changes
  useEffect(() => {
    const syncWithBackend = async () => {
      if (session?.user && !backendUser) {
        try {
          // Get the Google ID token from NextAuth session
          // Note: In a real app, you'd need to modify NextAuth config to include the Google ID token
          // For now, we'll create a user based on session data
          const response = await fetch('/api/auth/session')
          const sessionData = await response.json()
          
          if (sessionData?.user) {
            // Call our backend to create/update user
            const backendResponse = await apiService.syncUserWithBackend({
              email: sessionData.user.email,
              name: sessionData.user.name,
              picture: sessionData.user.image,
              google_id: sessionData.user.id || sessionData.user.email
            })
            setBackendUser(backendResponse.user)
          }
        } catch (error) {
          console.error('Failed to sync with backend:', error)
        }
      }
    }

    syncWithBackend()
  }, [session, backendUser])

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/" })
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await signOut({ callbackUrl: "/" })
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state during session check
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show user info and logout if authenticated
  if (session) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-center mb-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">
                Welcome, {session.user?.name || "User"}!
              </p>
              <p className="text-sm text-gray-600">{session.user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>
    )
  }

  // Show login button if not authenticated
  return (
    <div className="text-center space-y-4">
      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 px-8 rounded-lg shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285f4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34a853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#fbbc05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#ea4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
      </button>
      
      <div className="text-xs text-gray-500 space-x-4">
        <a href="/terms" className="hover:text-gray-700 transition-colors">
          Terms of Service
        </a>
        <span>•</span>
        <a href="/privacy" className="hover:text-gray-700 transition-colors">
          Privacy Policy
        </a>
      </div>
    </div>
  )
}
