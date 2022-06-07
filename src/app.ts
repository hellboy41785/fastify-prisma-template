import Fastify, { FastifyInstance } from 'fastify'
import { userRoutes } from "./routes/users"
import prismaPlugin from "./plugins/prisima"

const buildApp = () => {
    const app: FastifyInstance = Fastify({
        logger: true
    })

    app.register(prismaPlugin)
    app.register(userRoutes)

    return app
}

export { buildApp }
