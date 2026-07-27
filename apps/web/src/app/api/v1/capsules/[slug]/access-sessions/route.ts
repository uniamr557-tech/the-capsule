import { NextResponse } from 'next/server';
import { SessionGuardService, DEMO_CAPSULE } from '../../../../../../lib/session';

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { code: 'INVALID_INPUT', message: 'Access code is required.', requestId: `req_${Date.now()}` },
        { status: 400 },
      );
    }

    const result = SessionGuardService.validateCodeAndCreateSession(code);

    if (!result.success || !result.session) {
      // Generic neutral security response
      return NextResponse.json(
        { code: 'UNAUTHORIZED', message: result.error || "That code isn't active.", requestId: `req_${Date.now()}` },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      sessionId: result.session.id,
      capsuleSlug: params.slug || DEMO_CAPSULE.slug,
      capsuleName: DEMO_CAPSULE.name,
      expiresAt: result.session.expiresAt.toISOString(),
    });

    // Set secure HTTP-only cookie
    response.cookies.set('capsule_senior_session', result.session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 Hours
      path: '/',
    });

    return response;
  } catch (_err) {
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'An internal server error occurred.', requestId: `req_${Date.now()}` },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ message: 'Senior session ended.' });
  response.cookies.delete('capsule_senior_session');
  return response;
}
