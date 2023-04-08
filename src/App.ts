import express, { Application } from "express";
import { startDatabase } from "./database";
import { createMovies, deleteMovies, idMovies, listMovies, updateMovies } from "./logic";
import { idMovieExistsMiddleware, moviesMiddlewareNameExist } from "./middleware";

const app: Application = express();
app.use(express.json());

app.post("/movies",moviesMiddlewareNameExist,createMovies);
app.get("/movies",listMovies);
app.get("/movies/:id",idMovieExistsMiddleware, idMovies);
app.patch("/movies/:id",idMovieExistsMiddleware,moviesMiddlewareNameExist,updateMovies);
app.delete("/movies/:id",idMovieExistsMiddleware,deleteMovies);

app.listen(3000, async () => {
  await startDatabase();
  console.log("Server is running");
});
