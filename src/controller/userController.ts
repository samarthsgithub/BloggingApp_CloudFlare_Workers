import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Context } from 'hono';
import { Jwt } from 'hono/utils/jwt';
const JWTKEY = 'mysecretkey';

// Initialize Prisma Client once at the top level


export const signup = async (c: Context) => {
    try {
        console.log('0');
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
          }).$extends(withAccelerate());
              console.log('1');
  
        const body: { username: string; email: string; password: string } = await c.req.json();
          console.log('2');
        const user = await prisma.user.create({
            data: {
                username: body.username,
                email: body.email,
                password: body.password,
            },
        });
        console.log('4');

        const userId =  user.id;
        const token = await Jwt.sign({ userId },JWTKEY);
        console.log('5');

        return c.json({
            msg: "User created successfully",
            token,
            user: {
                userId,
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        console.error("Error during signup:", err);
        return c.json({ msg: "Error creating user", error: err }, 500);
    }
};

export const signin = async (c: Context) => {
    try {

        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
          }).$extends(withAccelerate());
        

        const body: { email: string; password: string } = await c.req.json();

        const ifExist = await prisma.user.findFirst({
            where: {
                email: body.email,
                password: body.password,
            },
        });

        if (!ifExist) {
            return c.body("User does not exist", 401);
        }

        const userId = ifExist.id;
        const token = await Jwt.sign({ userId }, JWTKEY);

        return c.json({
            message: "Login successful",
            token,
            user: {
                userId,
                username: ifExist.username,
                email: ifExist.email,
            },
        });
    } catch (err) {
        console.error("Error during signin:", err);
        return c.body(`Internal server error, ${err}`, 500);
    }
};
