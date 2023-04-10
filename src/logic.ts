import { Response, Request } from "express";
import { client } from "./database";
import { QueryConfig, QueryResult } from "pg";
import { TMovies, TMoviesRequest, movieResults } from "./interfaces";
import format from "pg-format";

const createMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const moviesData: TMoviesRequest = request.body;

  const queryString: string = format(
    `
        INSERT INTO
            movies
            (%I)
        VALUES
            (%L)
        RETURNING *;
        `,

    Object.keys(moviesData),
    Object.values(moviesData)
  );

  const queryResult: QueryResult<movieResults> = await client.query(
    queryString
  );
  const createdMovie = queryResult.rows[0];
  return response.status(201).json(createdMovie);
};

const listMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const category: any = request.query.category;
  let queryString: string = "";
  let queryResult: QueryResult;

  if (category) {
    queryString = `
        SELECT
            * 
        FROM
            movies
        WHERE
            category = $1;
    `;
    const queryConfig: QueryConfig = {
      text: queryString,
      values: [category],
    };
    queryResult = await client.query(queryConfig);
    if (queryResult.rowCount === 0) {
      queryString = `
        SELECT
            * 
        FROM
            movies;
        `;
      queryResult = await client.query(queryString);
    }
  } else {
    queryString = `
        SELECT
            * 
        FROM
            movies;
        `;
    queryResult = await client.query(queryString);
  }

  const allMovies = queryResult.rows;
  return response.status(200).json(allMovies);
};

const idMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const movie: TMovies = response.locals.movie;

  return response.status(200).json(movie);
};

const updateMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const moviesData: Partial<TMoviesRequest> = request.body;
  const id: number = parseInt(request.params.id);
  const queryString: string = format(
    `
        UPDATE
            movies
            SET(%I)=ROW(%L)
        WHERE
            id=$1
        RETURNING *;
        `,
    Object.keys(moviesData),
    Object.values(moviesData)
  );
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TMovies> = await client.query(queryConfig);
  const results = queryResult.rows[0];
  return response.status(200).json(results);
};

const deleteMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = parseInt(request.params.id);
  const queryString: string = `
    DELETE FROM
        movies
    WHERE
        id=$1;
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  await client.query(queryConfig);
  return response.status(204).send();
};
export { createMovies, listMovies, idMovies, updateMovies, deleteMovies };
