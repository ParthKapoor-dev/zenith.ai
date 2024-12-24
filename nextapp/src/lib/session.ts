import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import User from '@/types/user';
import { redirect } from 'next/navigation';

const secretKey = process.env.SESSION_SECRET || "Zm8srkWSwRlmmCQ4+ctXzo0ddj8VSFhwtS1q8JMn8OY=";
const encodedKey = new TextEncoder().encode(secretKey)

// Session Management Helper Functions
export async function createSession(user: User, token: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session = await encrypt({ user, token, expiresAt })
    const cookieStore = await cookies()

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
}

export async function verifySession() {

    const cookie = (await cookies()).get('session')?.value;
    const session = await decrypt(cookie);

    if (!session?.token) redirect("/auth/login");
    return {
        user: session.user as User,
        token: session.token as string
    }
}

export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session');
    cookieStore.delete('user');
}

// Encryption & Decryption methods from Jose Lib
export async function encrypt(payload: any) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        console.log('Failed to verify session')
    }
}


