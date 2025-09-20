import { Hono } from "hono"
import { cors } from "hono/cors"
import me from "./routes/protected/me"
import auth from "./routes/public/auth"

const app = new Hono()

app.use("*", cors({ origin: ["http://localhost:5173"] }))

app.route("/auth", auth)
app.route("/me", me)

export default app
