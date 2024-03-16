import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import {
    FastifyRequest,
    checkSessionIdExists,
} from '../middlewares/check-session-id-exists'

export async function MealsRoutes(app: FastifyInstance) {
    app.get(
        '/:id',
        { preHandler: [checkSessionIdExists] },
        async (request, reply) => {
            const { id } = z
                .object({
                    id: z.string(),
                })
                .parse(request.params)

            const meal = await prisma.meal.findUnique({
                where: {
                    id,
                },
            })

            if (!meal) {
                return reply.status(404).send({ error: 'Meal not found' })
            }

            return reply.send(meal)
        }
    )

    app.get(
        '/',
        { preHandler: [checkSessionIdExists] },
        async (request: FastifyRequest, reply) => {
            const userId = request.user?.id

            const meals = await prisma.meal.findMany({
                where: {
                    userId,
                },
            })

            return reply.send(meals)
        }
    )

    app.get(
        '/metrics',
        { preHandler: [checkSessionIdExists] },
        async (request: FastifyRequest, reply) => {
            const userId = request.user?.id

            const meals = await prisma.meal.findMany({
                where: {
                    userId,
                },
            })

            const totalMeals = meals.length
            const totalMealsOnDiet = meals.filter((meal) => meal.onDiet).length
            const totalMealsNotOnDiet = meals.filter(
                (meal) => !meal.onDiet
            ).length

            return reply.send({
                totalMeals,
                totalMealsOnDiet,
                totalMealsNotOnDiet,
            })
        }
    )

    app.put(
        '/alter/:id',
        { preHandler: [checkSessionIdExists] },
        async (request, reply) => {
            const { id } = z
                .object({
                    id: z.string(),
                })
                .parse(request.params)

            const { name, description, onDiet } = z
                .object({
                    name: z.string(),
                    description: z.string(),
                    onDiet: z.boolean(),
                })
                .parse(request.body)

            await prisma.meal.update({
                where: {
                    id,
                },
                data: {
                    name,
                    description,
                    onDiet,
                    createdAt: new Date(),
                },
            })

            return reply.send('Meal updated successfully')
        }
    )

    app.delete(
        '/delete/:id',
        { preHandler: [checkSessionIdExists] },
        async (request, reply) => {
            const { id } = z
                .object({
                    id: z.string(),
                })
                .parse(request.params)

            await prisma.meal.delete({
                where: {
                    id,
                },
            })

            return reply.send('Meal deleted successfully')
        }
    )

    app.post(
        '/',
        { preHandler: [checkSessionIdExists] },
        async (request: FastifyRequest, reply) => {
            const { name, description, onDiet } = z
                .object({
                    name: z.string(),
                    description: z.string(),
                    onDiet: z.boolean(),
                })
                .parse(request.body)

            const userId = request.user?.id

            const mealSchema = {
                name,
                description,
                onDiet,
                createdAt: new Date(),
                userId: userId || '',
            }

            await prisma.meal.create({
                data: mealSchema,
            })

            return reply.status(201).send('Meal created successfully')
        }
    )
}
