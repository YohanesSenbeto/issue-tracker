import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClientSingleton
}

export const prisma =
  process.env.NODE_ENV === 'production'
    ? prismaClientSingleton()
    : globalForPrisma.prisma ?? (globalForPrisma.prisma = prismaClientSingleton())
