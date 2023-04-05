import { Response,Request } from "express";

export function teste(request:Request, response:Response){
    return response.json("OI")
    
}