import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

import { JwtTokenSignatureMismatched } from "hono/utils/jwt/types";
import {Context} from 'hono';


export const post = async (c:Context)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
       try{
           const body:{
            title:string,
            blog:string
           } = await c.req.json();

        const res = await prisma.blog.create({
            data:{
                title:body.title,
                blog:body.blog,
                userId:c.get('userId'),
            }
        })
        return c.json({
            message:"Post successfully",
            post:{
                id:res.id,
                title:res.title,
                blog:res.blog,
            }
        })
       }catch(err){
           return c.body(`Internal server error : ${err}`,500);
       }
}

export const getAllBlogs = async(c:Context)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
     try{
          const res = await prisma.blog.findMany({
            include:{
                user:true
            }
          });

          return c.json({
            blogs:res.map((res)=>({
                id:res.id,
                username: res.user.username,
                userId:res.user.id,
                title: res.title,
                blog:res.blog
            }))
          })
     }catch(err){
        return c.body(`Internal server error: ${err}`, 500);
     }
}

export const getPostById = async(c:Context)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
    try{
      const response = await prisma.blog.findMany({
        where:{
            userId:c.get('userId') as number,
        },
      });
      return c.json({
        blog:response
      })
    }catch(err){
      return c.body(`Internal server error: ${err}`,500);
    }
}

export const updatePost = async(c:Context)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
    try{

     const id:number = Number(c.req.param('id'));
      const body:{
        title:string,
        blog:string
      }  = await c.req.json();
      
      const target = await prisma.blog.findFirst({
        where:{
            id:id,
            userId:c.get('userId')
        }
      });
      if(target==null){
        return c.body('Post does not exists');
      }
      const res = await prisma.blog.update({
        where:{
            id:id,
            userId:c.get('userId')
        },
        data:{
            title:body.title,
            blog:body.blog
        }
      });
      return c.json({
        data:{
            id:res.id,
            title:res.title,
            blog:res.blog
        }
      })
    }catch(error){
       return c.body(`Internal server error: ${error}`,500);
    }
}
