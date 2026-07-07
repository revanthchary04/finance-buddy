import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  
  // Public routes that don't require auth
  const PUBLIC_ROUTES = ['/login', '/signup', '/verify-email', '/forgot-password', '/reset-password', '/auth/callback'];
  const isPublicRoute = PUBLIC_ROUTES.some((route) => path.startsWith(route)) || path === '/';
  
  const ADMIN_ROUTES = ['/admin'];
  const isAdminRoute = ADMIN_ROUTES.some((route) => path.startsWith(route));

  // If user is not authenticated and not on a public route, redirect to login
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If user is authenticated, we need to check their role and status from profiles table
  // This requires a DB call, but for middleware it's often better to check JWT claims.
  // However, since we are relying on the DB profile table, we do a quick check here.
  if (user) {
    // We fetch profile status and role to route correctly
    const { data: profile } = await supabase
      .from('profiles')
      .select('status, role')
      .eq('id', user.id)
      .single();

    // Update last accessed time
    await supabase.from('profiles')
      .update({ last_accessed_at: new Date().toISOString() })
      .eq('id', user.id);


    const status = profile?.status || 'pending';
    const role = profile?.role || 'user';

    // Redirect pending users to pending page
    if (status !== 'approved' && !path.startsWith('/pending-approval') && path !== '/auth/callback') {
      const url = request.nextUrl.clone();
      url.pathname = '/pending-approval';
      return NextResponse.redirect(url);
    }

    // Redirect approved users away from pending page
    if (status === 'approved' && path.startsWith('/pending-approval')) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    // Redirect approved users away from login/signup to dashboard
    if (status === 'approved' && isPublicRoute && path !== '/auth/callback') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    // Protect admin routes
    if (isAdminRoute && role !== 'admin' && role !== 'super_admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // Prevent browser caching of protected routes so back button doesn't reveal dashboard after logout
  if (!isPublicRoute) {
    supabaseResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    supabaseResponse.headers.set('Pragma', 'no-cache');
    supabaseResponse.headers.set('Expires', '0');
  }

  return supabaseResponse;
}
