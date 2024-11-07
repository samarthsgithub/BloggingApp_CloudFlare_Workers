import { Hono } from 'hono'
import {PrismaClient} from '@prisma/client/edge'
import {withAccelerate} from '@prisma/extension-accelerate'
import{cors} from 'hono/cors';
import mainRouter from './routes/index'

const app = new Hono()
app.use(cors());
app.route('/api/v1',mainRouter);


export default app
