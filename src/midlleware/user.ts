import {Context,Next} from 'hono';
import{env} from 'hono/adapter';
import {Jwt} from 'hono/utils/jwt';

export async function authmiddleware(c:Context,next:Next){
    const JWT_TOKEN = 'mysecretkey';

    try{
      const authHeader = c.req.header("Authorization");
      console.log(authHeader);
      if(authHeader&&authHeader.startsWith("Bearer")){
        const token = authHeader.split(" ")[1];
        const decode = await Jwt.verify(token,JWT_TOKEN);
        if(decode && typeof decode.userId==='number'){
            c.set("userId",decode.userId);
            await next();
        }else{
            return c.body("you are unauthorized user",401);
        }
      }else{
        return c.body("Authorization header is missing or improperly formatted", 401)
      }
    }catch(err){ 
       return c.body('unauthorized',401);
    }
}