import React, { useState, useEffect } from "react";
import MovieList from "./MovieList";
import { useParams } from "react-router-dom";

export default function MovieSearch() {
  const { searchTerm } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMovies = async (searchTerm) => {
    const searchURL = new URL("https://www.omdbapi.com/");
    searchURL.searchParams.append("apikey", "925782bd");
    searchURL.searchParams.append("s", searchTerm);
    const results = await fetch(searchURL);
    const resultsJSON = await results.json();
    const resultsObject = resultsJSON.Search.map((movie) => {
      return {
        title: movie.Title,
        year: movie.Year,
        imdbID: movie.imdbID,
        poster: movie.Poster,
      };
    });
    setMovies(resultsObject);
    setLoading(false);
  };

  useEffect(() => {
    getMovies(searchTerm);
  }, [searchTerm]);

  return <MovieList movies={movies} loading={loading} />;
}
