import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "./database";
import { TMovies, TMoviesRequest, movieResults } from "./interfaces";

const idMovieExistsMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  // const id: number = parseInt(request.params.id)
  const { id } = request.params;
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

  if (queryResult.rowCount === 0) {
    return response.status(404).json({
      message: "error : Movie not found",
    });
  }
  response.locals.movie = queryResult.rows[0];
  return next();
};

const moviesMiddlewareNameExist = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const name: any = request.query.name;
  let queryString: string = "";
  let queryResult: QueryResult;

  if (name) {
    queryString = `
        SELECT
            * 
        FROM
            movies
        WHERE
            name = $;
    `;
    const queryConfig: QueryConfig = {
      text: queryString,
      values: [name],
    };

    
    queryResult = await client.query(queryConfig);
  } else {
    queryString = `
        SELECT
            * 
        FROM
            movies;
        `;

    queryResult = await client.query(queryString);
    if (queryResult.rowCount === 0) {
      return response.status(409).json({
        message: "error: Movie name already exists!",
      });
    }
    response.locals.movie = queryResult.rows[0];
    return next();
  }
};

export { idMovieExistsMiddleware, moviesMiddlewareNameExist };
