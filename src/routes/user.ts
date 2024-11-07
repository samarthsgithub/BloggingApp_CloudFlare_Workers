import {Hono} from 'hono';
import {signup,signin} from '../controller/userController';

const userRoutes = new Hono();

userRoutes.post('/signup',signup);
userRoutes.post('/signin',signin);

export default userRoutes;