import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return handleApiProxy(request, path, 'GET')
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return handleApiProxy(request, path, 'POST')
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return handleApiProxy(request, path, 'PUT')
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  return handleApiProxy(request, path, 'DELETE')
}

async function handleApiProxy(
  request: NextRequest,
  path: string[],
  method: string
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const apiPath = `/${path.join('/')}`
    const url = `${API_BASE_URL}${apiPath}`
    
    // Get request body if it exists
    let body = undefined
    let contentType = 'application/json'
    
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        const originalContentType = request.headers.get('content-type')
        if (originalContentType) {
          contentType = originalContentType
        }
        
        if (contentType.includes('application/json')) {
          // For JSON requests, get the raw body and let fetch handle it
          const bodyText = await request.text()
          if (bodyText.trim()) {
            body = bodyText
          }
        } else {
          // For other content types, pass through as is
          body = await request.text()
        }
      } catch (error) {
        console.warn('Error reading request body:', error)
      }
    }

    // First, ensure user is synced with backend
    if (session.user.email) {
      try {
        await fetch(`${API_BASE_URL}/auth/sync-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: session.user.email,
            name: session.user.name || session.user.email,
            picture: session.user.image,
            google_id: session.user.email // Use email as fallback ID
          })
        })
      } catch (error) {
        console.warn('Failed to sync user:', error)
      }
    }

    // Make the actual API request
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': contentType,
        'X-User-Email': session.user.email || '',
        // Add any other headers from the original request (excluding content-length)
        ...Object.fromEntries(
          Array.from(request.headers.entries()).filter(
            ([key]) => !['content-length', 'host', 'content-type'].includes(key.toLowerCase())
          )
        )
      },
      body
    })

    const data = await response.text()
    
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      }
    })

  } catch (error) {
    console.error('API Proxy Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
