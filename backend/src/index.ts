import { Hono } from "hono"
import me from "./routes/protected/me"
import auth from "./routes/public/auth"

const app = new Hono()

app.route("/auth", auth)
app.route("/me", me)

export default app
