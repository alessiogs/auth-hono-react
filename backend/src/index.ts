import { Hono } from "hono"
import { cors } from "hono/cors"
import me from "./routes/protected/meRoutes"
import auth from "./routes/public/authRoutes"

const app = new Hono()

app.use(
  "*",
  cors({
    origin: ["http://localhost:5173"],
    allowHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
)

app.route("/auth", auth)
app.route("/me", me)

export default app
