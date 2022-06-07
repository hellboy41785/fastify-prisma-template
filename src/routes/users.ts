import { FastifyPluginAsync } from 'fastify'
import { User } from '@prisma/client'
import fp from 'fastify-plugin'

interface IUserByIdParam {
    id: string
}

interface IUserBody {
    email: string,
    name: string
}

const PREFIX = "/users"
const userRoutes: FastifyPluginAsync = fp(async (app) => {
    app.get(`${PREFIX}`, async (_req, res) => {
        const users: User[] = await app.prisma.user.findMany()
        res.send(users)
    })

    app.post<{
        Body: IUserBody
    }>(`${PREFIX}`, async (req, res) => {
        const user: User = await app.prisma.user.create({
            data: req.body,
        })
        res.send(user)
    })

    app.get<{
        Params: IUserByIdParam
    }>(`${PREFIX}/:id`, async (req, res) => {
        const { id } = req.params
        const user: User | null = await app.prisma.user.findUnique({
            where: { id: Number(id) },
        })

        if (user) {
            res.send(user)
            return;
        }

        res.code(404).send({ error: `User with ID ${id} does not exist in the database` })
    })

    app.put<{
        Body: IUserBody
        Params: IUserByIdParam
    }>(`${PREFIX}/:id`, async (req, res) => {
        const { id } = req.params
        const { name } = req.body

        try {
            const user = await app.prisma.user.update({
                where: { id: Number(id) },
                data: {
                    name
                },
            })

            res.send(user)
        } catch (error) {
            res.send({ error: `User with ID ${id} does not exist in the database` })
        }
    })

    app.delete<{
        Params: IUserByIdParam
    }>(`${PREFIX}/:id`, async (req, res) => {
        const { id } = req.params
        const user = await app.prisma.user.delete({
            where: {
                id: Number(id),
            },
        })
        res.send(user)
    })
})

export { userRoutes, IUserBody };
