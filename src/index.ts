import {buildApp} from "./app"

const start = async () => {
    try {
        const app = buildApp()
        await app.listen(3000)
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}
start()
