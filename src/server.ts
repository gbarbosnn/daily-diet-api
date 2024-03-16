import fastify from 'fastify'

const app = fastify()

app.get('/', async (request, reply) => {
    return { hello: 'world' }
})

app.listen({ port: 3000, host: '0.0.0.0' }).then(() => {
    console.log(`Server is running🚀`)
})
