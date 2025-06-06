import { NextResponse } from 'next/server'
import { createAuthClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createAuthClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = origin.includes('http://localhost')
      if (forwardedHost) {
        if (isLocalEnv) {
          return NextResponse.redirect(`http://${forwardedHost}${next}`)
        } else {
          return NextResponse.redirect(`https://${forwardedHost}${next}`)
        }
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
