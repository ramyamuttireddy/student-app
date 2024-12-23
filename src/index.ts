import { Elysia } from "elysia";
import { studentRouter } from "./routes/studentrouter";
import swagger from "@elysiajs/swagger";
import cors from "@elysiajs/cors";
import { logger } from "@bogeychan/elysia-logger";
import { authPulgin } from "./auth/authpulgin";
import { authRouter } from "./routes/autorouter";

const app = new Elysia()
.get("/", () => "Main Page")
.use(cors())
.use(logger())
.use(swagger())
.use(studentRouter)
.use(authRouter)
.listen(5000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
