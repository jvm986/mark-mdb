// import fetch from "cross-fetch";
import React, { useState, useRef } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import _ from "lodash";
import { useEffect } from "react";

export default function Asynchronous() {
  const [options, setOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState();
  const [loading, setLoading] = useState(false);

  const debounceSearch = useRef(
    _.debounce((searchTerm) => {
      searchMovies(searchTerm).then((results) => {
        console.log(results.Search);
        if (results.Search) {
          setLoading(false);
          setOptions(results.Search);
        }
      });
    }, 350)
  );

  const searchMovies = (searchTerm) => {
    const searchURL = new URL("https://www.omdbapi.com/");
    searchURL.searchParams.append("apikey", "925782bd");
    searchURL.searchParams.append("s", searchTerm);
    return fetch(searchURL).then((results) => results.json());
  };

  const handleSubmit = () => {
    console.log("hi");
  };

  useEffect(() => {
    if (searchTerm) {
      setLoading(true);
      debounceSearch.current(searchTerm);
    } else {
      setOptions([]);
    }
  }, [searchTerm]);

  return (
    <form onSubmit={() => handleSubmit()}>
      <Autocomplete
        id="asynchronous-demo"
        style={{ width: 300 }}
        onOpen={() => {
          setLoading(false);
          setOptions([]);
        }}
        onInputChange={(event) => {
          setSearchTerm(event.target.value);
        }}
        getOptionSelected={(option, value) => option.Title === value.Title}
        getOptionLabel={(option) => option.Title}
        options={options}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </form>
  );
}
