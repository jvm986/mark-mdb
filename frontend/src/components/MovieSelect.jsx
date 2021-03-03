import React, { useEffect, useState } from "react";

import MovieList from "./MovieList";

export default function MovieSelect() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMovies = async () => {
    const results = await fetch("/api/movies/");
    const resultsJSON = await results.json();
    setMovies(resultsJSON);
    setLoading(false);
  };

  useEffect(() => {
    getMovies();
  }, []);

  return <MovieList movies={movies} loading={loading} />;
}
