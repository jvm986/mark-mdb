import React, { useEffect } from "react";
import { Button } from "@material-ui/core";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function MovieDetail() {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState();

  const scrapeMovie = async (imdbID) => {
    await fetch(`/api/movies/${imdbID}/scrape/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    getMovie(imdbID);
  };

  const addMovie = async () => {
    await fetch("/api/movies/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movie),
    });
  };

  const getMovie = async (imdbID) => {
    const localResults = await fetch(`/api/movies/${imdbID}/`);
    const movie = await localResults.json();
    if (localResults.status === 200) {
      setMovie(movie);
    } else {
      const searchURL = new URL("https://www.omdbapi.com/");
      searchURL.searchParams.append("apikey", "925782bd");
      searchURL.searchParams.append("i", imdbID);
      const results = await fetch(searchURL);
      const resultsJSON = await results.json();
      const resultsObject = {
        title: resultsJSON.Title,
        year: resultsJSON.Year,
        imdbID: resultsJSON.imdbID,
        poster: resultsJSON.Poster,
      };
      setMovie(resultsObject);
    }
  };

  useEffect(() => {
    getMovie(imdbID);
  }, [imdbID]);

  return (
    <div>
      {!movie ? (
        "loading"
      ) : !movie.created_at ? (
        <Button onClick={() => addMovie()}>Add</Button>
      ) : movie.download ? (
        <Button onClick={() => window.open(movie.download)}>Download</Button>
      ) : (
        <Button onClick={() => scrapeMovie(movie.imdbID)}>Check</Button>
      )}
    </div>
  );
}
