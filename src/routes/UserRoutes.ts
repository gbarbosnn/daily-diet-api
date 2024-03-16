import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import z from 'zod'
import { randomUUID } from 'crypto'

export async function userRoutes(app: FastifyInstance) {
    app.post('/', async (request, reply) => {
        const { username } = z
            .object({
                username: z.string(),
            })
            .parse(request.body)

        let sessionId = request.cookies.sessionId

        if (!sessionId) {
            sessionId = randomUUID()

            reply.setCookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days
            })
        }

        await prisma.user.create({
            data: {
                username,
                sessionID: sessionId,
            },
        })

        reply.status(201).send('User created!')
    })
}
