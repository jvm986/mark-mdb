import React, { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import { Container, Box } from "@material-ui/core";
import { Route, BrowserRouter } from "react-router-dom";
import _ from "lodash";

import Header from "./Header";
import MovieList from "./MovieList";
import MovieDetail from "./MovieDetail";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [myMovies, setMyMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const getMyMovies = async () => {
    const result = await fetch("/api/movies/");
    const movies = await result.json();
    return movies;
  };

  const addMovie = async (movie) => {
    await fetch("/api/movies/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movie),
    });
    setSearchTerm("");
    const movies = await getMyMovies();
    scrapeMovie(movie.imdbID);
    setMovies(movies);
    setMyMovies(movies);
  };

  const scrapeMovie = async (imdbID) => {
    await fetch(`/api/movies/${imdbID}/scrape/`, {
      method: "GET",
    });
    const movies = await getMyMovies();
    setMovies(movies);
    setMyMovies(movies);
  };

  const deleteMovie = async (imdbID) => {
    await fetch(`/api/movies/${imdbID}/`, {
      method: "DELETE",
    });
    const movies = await getMyMovies();
    setMovies(movies);
    setMyMovies(movies);
  };

  const watchMovie = async (imdbID) => {
    const date = {
      watched_on: new Date().toISOString().slice(0, 10),
      watched: true,
    };
    await fetch(`/api/movies/${imdbID}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(date),
    });
    const movies = await getMyMovies();
    setMovies(movies);
    setMyMovies(movies);
  };

  const debounceSearch = useRef(
    _.debounce((searchTerm, myMovies) => {
      if (searchTerm) {
        searchMovies(searchTerm).then((results) => {
          if (results !== null) {
            const movies = results.map(
              (movie) =>
                myMovies.find((myMovie) => myMovie.imdbID === movie.imdbID) ||
                movie
            );
            setMovies(movies);
          }
        });
      } else {
        const movies = getMyMovies();
        setMyMovies(movies);
      }
    }, 350)
  );

  const searchMovies = async (searchTerm) => {
    const searchURL = new URL("https://www.omdbapi.com/");
    searchURL.searchParams.append("apikey", "925782bd");
    searchURL.searchParams.append("s", searchTerm.trim());
    const result = await fetch(searchURL);
    const movies = await result.json();
    if (movies.Search) {
      const moviesFiltered = movies.Search.filter((movie) => {
        return movie.Poster !== "N/A";
      });
      const serialisedMovies = moviesFiltered.map((movie) => {
        return {
          title: movie.Title,
          year: movie.Year,
          imdbID: movie.imdbID,
          poster: movie.Poster,
        };
      });
      return serialisedMovies;
    }
    return null;
  };

  useEffect(() => {
    setLoading(true);
    getMyMovies().then((movies) => {
      setMovies(movies);
      setMyMovies(movies);
      setLoading(false);
    });
  }, [setLoading]);

  useEffect(() => {
    if (searchTerm) {
      debounceSearch.current(searchTerm, myMovies);
    }
  }, [searchTerm, myMovies]);

  useEffect(() => {
    if (!searchTerm) {
      getMyMovies().then((movies) => {
        setMovies(movies);
        setMyMovies(movies);
        setLoading(false);
      });
    }
  }, [searchTerm]);

  return (
    <BrowserRouter>
      <Container maxWidth="md">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Box mt={2}>
          <Route
            path="/"
            exact
            render={() => (
              <MovieList
                movies={movies}
                setMovies={setMovies}
                loading={loading}
                addMovie={addMovie}
                scrapeMovie={scrapeMovie}
                deleteMovie={deleteMovie}
                watchMovie={watchMovie}
              />
            )}
          />
          <Route path="/movie/:imdbID" exact component={MovieDetail} />
        </Box>
      </Container>
    </BrowserRouter>
  );
}

const container = document.getElementById("root");
render(<App />, container);
