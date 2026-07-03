import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (username === 'admin' && password === 'password') {
      const cookieStore = await cookies();
      cookieStore.set('admin_logged_in', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid admin credentials' }, { status: 401 });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get('admin_logged_in');

  if (isLoggedIn && isLoggedIn.value === 'true') {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_logged_in');
  return NextResponse.json({ success: true });
}
