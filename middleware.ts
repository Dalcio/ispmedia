import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas que requerem autenticação
const protectedRoutes = ['/dashboard'];

// Rotas que usuários autenticados não devem acessar (como login)
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificar se o usuário está autenticado (verifica se há um token no cookie ou header)
  const token = request.cookies.get('auth-token')?.value;
  const isAuthenticated = !!token;

  // Se a rota é protegida e o usuário não está autenticado
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('message', 'login-required');
    return NextResponse.redirect(url);
  }

  // Se a rota é de auth e o usuário já está autenticado
  if (authRoutes.some(route => pathname.startsWith(route)) && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register']
};
