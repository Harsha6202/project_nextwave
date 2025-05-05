import { compare, hash } from "bcryptjs"
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { prisma } from "./prisma"

// Secret key for JWT
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key_change_this_in_production")

// JWT token expiration (24 hours)
const expTime = "24h"

// Generate JWT token
export async function generateToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expTime)
    .sign(secretKey)
}

// Verify JWT token
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey)
    return payload
  } catch (error) {
    return null
  }
}

// Hash password
export async function hashPassword(password: string) {
  return await hash(password, 10)
}

// Compare password with hash
export async function comparePassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword)
}

// Get current user from cookies
export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return null
  }

  try {
    const payload = await verifyToken(token)
    if (!payload || !payload.id) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    return user
  } catch (error) {
    return null
  }
}
