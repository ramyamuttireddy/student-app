import jwt from "@elysiajs/jwt";
import Elysia, { error, t } from "elysia";
import { prisma } from "../models/db";

export const authRouter = new Elysia({ prefix: "auth" })

  .use(
    jwt({
      secret: Bun.env.JWT_TOKEN as string,
    })
  )

  .post(
    "/login",
    async ({ body, jwt }) => {
      try {
        const { email, password } = body;

        const student = await prisma.student.findFirst({
          where: {
            email,
          },
        });

        if (!student) {
          return error(401, "Invalid Credentials");
        }

        const isPasswordCorrect = await Bun.password.verify(
          password,
          student?.password
        );

        if (!isPasswordCorrect) {
          return error(401, "Invalid Credentials");
        }

        const token = await jwt.sign({
            sub:student.id,
        })

        return {
            token,
            student : {
                id:student.id,
                name:student.name,
                email:student.email,
                surname:student.surname
            }
        }

      } catch (error) {
        console.log("Error On Login");
      }
    },
    {
      body: t.Object({
        email: t.String({
          minLength: 1,
        }),
        password: t.String({
          minLength: 1,
        }),
      }),
    }
  );
