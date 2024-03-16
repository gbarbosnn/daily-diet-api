import { FastifyReply, FastifyRequest as FastifyRequestType } from 'fastify'
import { prisma } from '../lib/prisma'

export interface FastifyRequest extends FastifyRequestType {
    user?: {
        id: string
    }
}

export async function checkSessionIdExists(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const sessionId = request.cookies.sessionId

    if (!sessionId) {
        return reply.status(401).send({ error: 'Unauthorized' })
    }

    const user = await prisma.user.findFirst({
        where: {
            sessionID: sessionId,
        },
    })

    if (!user) {
        return reply.status(401).send({ error: 'Unauthorized' })
    }

    request.user = user
}
