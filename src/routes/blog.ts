import {Hono} from 'hono';
import { authmiddleware } from "../midlleware/user";
import {post,getAllBlogs,getPostById,updatePost} from '../controller/blogController';
const blogRoutes = new Hono();

blogRoutes.post('/post',authmiddleware,post);
blogRoutes.get('/getAllBlogs',authmiddleware,getAllBlogs);
blogRoutes.get('/getBlogById/:id',authmiddleware,getPostById);
blogRoutes.put('/update/:id',authmiddleware,updatePost);

export default blogRoutes;