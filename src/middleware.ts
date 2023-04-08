import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "./database";
import { TMovies, TMoviesRequest, movieResults } from "./interfaces";

const idMovieExistsMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
    
  const id: number = parseInt(request.params.id)
  const queryString: string = `
        SELECT
            * 
        FROM 
            movies
        WHERE
            id = $1;
        `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<movieResults> = await client.query(
    queryConfig
  );
  console.log(queryResult)

  if (queryResult.rowCount === 0) {
    return response.status(404).json({
      error: "Movie not found!",
    });
  }
  console.log(queryResult.rows[0])
  response.locals.movie = queryResult.rows[0];
  return next();
};

const moviesMiddlewareNameExist = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
    const name: any = request.body.name;
    let queryString: string = "";
    let queryResult: QueryResult;
  
    if (name) {
      queryString = `
          SELECT
              * 
          FROM
              movies
          WHERE
              name = $1;
      `;
      const queryConfig: QueryConfig = {
        text: queryString,
        values: [name],
      };
      queryResult = await client.query(queryConfig);
      console.log(queryResult.rowCount)
      if(queryResult.rowCount !=0){
        return response.status(409).json({
            error: "Movie name already exists!"
        }
     )
      }

    }
//    
  return next();

};

export { idMovieExistsMiddleware, moviesMiddlewareNameExist };
