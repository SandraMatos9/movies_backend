import { QueryResult } from "pg";

type TMovies = {
  id: number;
  name: string;
  category: string;
  duration: number;
  price: number;
};

type TMoviesRequest = Omit<TMovies, "id">;
type movieResults = QueryResult<TMovies>
export { TMovies, TMoviesRequest,movieResults };