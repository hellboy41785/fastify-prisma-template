import { test } from 'tap';
import { buildApp } from '../app';
import { IUserBody } from './users'
import { User } from '@prisma/client'

const app = buildApp()


const createUser = async <T,>(t: Tap.Test, data: IUserBody, status = 200): Promise<T> => {
    const response = await app.inject({
        method: 'POST',
        url: '/users',
        payload: data
    })
    t.equal(response.statusCode, status, `returns a status code of ${status}`)
    return response.json<T>()
}

const readUser = async <T,>(t: Tap.Test, id: number, status = 200): Promise<T> => {
    const response = await app.inject({
        method: 'GET',
        url: `/users/${id}`,
    })
    t.equal(response.statusCode, status, `returns a status code of ${status}`)
    return response.json<T>()
}

const listUser = async (t: Tap.Test): Promise<User[]> => {
    const response = await app.inject({
        method: 'GET',
        url: '/users',
    })
    t.equal(response.statusCode, 200, 'returns a status code of 200')
    return response.json<User[]>()
}

const updateUser = async (t: Tap.Test, id: number, data: IUserBody): Promise<User> => {
    const response = await app.inject({
        method: 'PUT',
        url: `/users/${id}`,
        payload: data
    })
    t.equal(response.statusCode, 200, 'returns a status code of 200')
    return response.json<User>()
}

const deleteUser = async (t: Tap.Test, id: number): Promise<User> => {
    const response = await app.inject({
        method: 'DELETE',
        url: `/users/${id}`,
    })
    t.equal(response.statusCode, 200, 'returns a status code of 200')
    return response.json<User>()
}


test("should be able to create, read and list Users", async (t) => {
    const user1 = await createUser<User>(t, { email: "user1@test.com", name: "user1" })
    t.ok(user1.id)
    const user2 = await createUser<User>(t, { email: "user2@test.com", name: "user2" });
    t.ok(user2.id)

    const readUser2 = await readUser<User>(t, user2.id)
    t.equal(readUser2.id, user2.id)

    const listUsers = await listUser(t);
    t.equal(listUsers.length, 2)

    await deleteUser(t, user1.id)
    await deleteUser(t, user2.id)
})

test("should return 404, when no user found", async t => {
    await readUser<{ errror: string }>(t, 99, 404)
})

test("should not allow duplicates", async t => {
    const user1 = await createUser<User>(t, { email: "user1@test.com", name: "user1" })
    t.ok(user1.id)
    await createUser(t, { email: "user1@test.com", name: "user2" }, 500);
    await deleteUser(t, user1.id)
})

test("should be able to update users", async t => {
    const user1 = await createUser<User>(t, { email: "user1@test.com", name: "user1" })
    t.ok(user1.id)
    const updatedUser = await updateUser(t, user1.id, { email: "user1@test.com", name: "user2" });
    t.equal(updatedUser.name, "user2")
    t.equal(updatedUser.id, user1.id)
    await deleteUser(t, user1.id)
})
