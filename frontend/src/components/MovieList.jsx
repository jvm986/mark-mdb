import React from "react";
import { Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import MovieCard from "./MovieCard";

export default function MovieList({
  loading,
  movies,
  setMovies,
  addMovie,
  scrapeMovie,
  deleteMovie,
  watchMovie,
}) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          {(loading ? Array.from(new Array(4)) : movies).map((movie, index) => (
            <Grid key={index} item md={3} sm={4} xs={12}>
              {loading ? (
                <Skeleton variant="rect" width={210} height={330} />
              ) : (
                <MovieCard
                  movie={movie}
                  setMovies={setMovies}
                  loading={loading}
                  addMovie={addMovie}
                  scrapeMovie={scrapeMovie}
                  deleteMovie={deleteMovie}
                  watchMovie={watchMovie}
                />
              )}
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
