import jwt from "@elysiajs/jwt";
import Elysia, { error } from "elysia";
import { prisma } from "../models/db";

console.log(Bun.env.JWT_TOKEN ,"token")

export const authPulgin = (app:Elysia) => 
    app.use(
        jwt({
          secret : Bun.env.JWT_TOKEN as string  
        })
    )

    .derive(async({jwt , headers , set}) => {
       const authorization = headers.authorization;
       if(!authorization?.startsWith("Bearer")) {
        return error(401 , "Unauthorized")
       }

       const token = authorization.slice(7);
       const payLoad = await jwt.verify(token)
       if(!payLoad) {
        return error(401 ,"Unauthorized")
       }
       console.log(payLoad,"payLoad")

       const student = await prisma.student.findUnique({
        where : {
            id : payLoad.sub as string
        }
       })
       if(!student) {
        return error(401 ,"Unauthorized")
       }

       return {
        student : {
            name:student.name,
            email:student.email,
            surname:student.surname
        }
       }
    }) 