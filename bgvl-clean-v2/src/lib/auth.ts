import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'bgv-secret-change-me'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ballon2025'

export async function verifyPassword(password: string): Promise<boolean> {
  return password === ADMIN_PASSWORD
}

export function signAdminToken(): string {
  return jwt.sign({ role: 'admin', iat: Date.now() }, JWT_SECRET, { expiresIn: '24h' })
}

export function verifyAdminToken(token: string): boolean {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded.role === 'admin'
  } catch {
    return false
  }
}

export function isAdminAuthenticated(): boolean {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('admin_token')?.value
    if (!token) return false
    return verifyAdminToken(token)
  } catch {
    return false
  }
}
