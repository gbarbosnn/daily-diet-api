import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { userRoutes } from './routes/UserRoutes'
import { MealsRoutes } from './routes/MealsRoutes'

const app = fastify()

app.register(cookie)

app.register(userRoutes, { prefix: '/users' })
app.register(MealsRoutes, { prefix: '/meals' })

app.listen({ port: 3000, host: '0.0.0.0' }).then(() => {
    console.log(`Server is running🚀`)
})
