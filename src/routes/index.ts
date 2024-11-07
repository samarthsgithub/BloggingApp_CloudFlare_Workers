import {Hono} from 'hono';
import userRoutes from "./user";
import blogRoutes from "./blog";

const mainRouter = new Hono();


mainRouter.route('/user',userRoutes);
mainRouter.route('/blog',blogRoutes);


export default mainRouter;