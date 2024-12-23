import Elysia, { t } from "elysia";
import { prisma } from "../models/db";
import { authPulgin } from "../auth/authpulgin";

export const studentRouter = new Elysia({ prefix: "/students" })

  // Fetch all students
  .get("/data", async () => {
    try {
      const students = await prisma.student.findMany({});
      return students;
    } catch (error) {
      console.error("Error fetching student information:", error);
      return { error: "Failed to fetch student information" };
    }
  })

  

  // Create a new student
  .post(
    "/create",
    async ({ body }) => {
      try {
        const {
          name,
          surname,
          fatherName,
          matherName,
          age,
          gender,
          bloodGroup,
          courseOfStudy,
          collageName,
          phone,
          email,
          password,
        } = body;

        const hashedPassword = await Bun.password.hash(password);

        const newStudent = await prisma.student.create({
          data: {
            name,
            surname,
            fatherName,
            matherName,
            age,
            gender,
            bloodGroup,
            courseOfStudy,
            collageName,
            phone,
            email,
            password: hashedPassword,
          },
        });

        // Return student without password
        const student = {
          name: newStudent.name,
          surname: newStudent.surname,
          fatherName: newStudent.fatherName,
          matherName: newStudent.matherName,
          age: newStudent.age,
          gender: newStudent.gender,
          bloodGroup: newStudent.bloodGroup,
          courseOfStudy: newStudent.courseOfStudy,
          collageName: newStudent.collageName,
          phone: newStudent.phone,
          email: newStudent.email,
        };
        return student;
      } catch (error) {
        console.error("Error creating student:", error);
        return { error: "Failed to create student" };
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        surname: t.String({ minLength: 1 }),
        fatherName: t.String({ minLength: 1 }),
        matherName: t.String({ minLength: 1 }),
        age: t.Number(),
        gender: t.String({ minLength: 1 }),
        bloodGroup: t.String({ minLength: 1 }),
        courseOfStudy: t.String({ minLength: 1 }),
        collageName: t.String({ minLength: 1 }),
        phone: t.String({minLength:1}),
        email: t.String({ minLength: 1 }),
        password: t.String({ minLength: 1 }),
      }),
    }
  )

  // Update student by ID
  .put(
    "/:id",
    async ({ params, body }) => {
      try {
        const { id } = params;
        const updatedStudent = await prisma.student.update({
          where: { id },
          data: body,
        });
        return updatedStudent;
      } catch (error) {
        console.error("Error updating student data:", error);
        return { error: "Failed to update student data" };
      }
    },
    {
      params: t.Object({
        id: t.String({ minLength: 1 }),
      }),
      body: t.Partial(
        t.Object({
          name: t.String({ minLength: 1 }),
          surname: t.String({ minLength: 1 }),
          fatherName: t.String({ minLength: 1 }),
          matherName: t.String({ minLength: 1 }),
          age: t.Number(),
          gender: t.String({ minLength: 1 }),
          bloodGroup: t.String({ minLength: 1 }),
          courseOfStudy: t.String({ minLength: 1 }),
          collageName: t.String({ minLength: 1 }),
          phone: t.String({minLength:1}),
          email: t.String({ minLength: 1 }),
        })
      ),
    }
  )

  // Delete student by ID
  .delete(
    "/:id",
    async ({ params }) => {
      try {
        const { id } = params;
        const student = await prisma.student.delete({
          where: { 
            id:id

           },
        });
        return student;
      } catch (error) {
        console.error("Error deleting student data:", error);
        return { error: "Failed to delete student data" };
      }
    },
    {
      params: t.Object({
        id: t.String({ minLength: 1 }),
      }),
    }
  )
 .use(authPulgin)
 // Fetch a single student by Id
 .get(
  "/:id",
  async ({ params }) => {
    try {
      const { id } = params;
      console.log(id)
      const student = await prisma.student.findFirst({
        where: {
          id,
        },
      });

      if (!student) {
        return { error: "Student not found" };
      }
      return student;
    } catch (error) {
      console.error("Error fetching individual student data:", error);
      return { error: "Failed to fetch individual student data" };
    }
  },
  {
    params: t.Object({
      id: t.String({ minLength: 1 }),
    }),
  }
);
