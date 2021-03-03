import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import GetAppIcon from "@material-ui/icons/GetApp";
import RefreshIcon from "@material-ui/icons/Refresh";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import MovieIcon from "@material-ui/icons/Movie";
// import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  media: {
    height: 330,
  },
  icon: {
    cursor: "pointer",
  },
});

export default function MovieCard({
  movie,
  addMovie,
  scrapeMovie,
  deleteMovie,
  watchMovie,
}) {
  // const history = useHistory();
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          onClick={() => {
            movie.download
              ? window.open(movie.download)
              : console.log("Download not available ...");
          }}
          className={classes.media}
          image={movie.poster}
          title={movie.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {movie.title}
          </Typography>
          <Typography variant="body1" color="textSecondary" component="p">
            {movie.year}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            onClick={() => watchMovie(movie.imdbID)}
          >
            {movie.watched
              ? `Watched ${new Date(movie.watched_on).toDateString()}`
              : "Unwatched!"}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {movie.download ? (
          <GetAppIcon
            className={classes.icon}
            color="primary"
            onClick={() => window.open(movie.download)}
          />
        ) : movie.created_at ? (
          <RefreshIcon
            className={classes.icon}
            color="primary"
            onClick={() => scrapeMovie(movie.imdbID)}
          />
        ) : (
          <AddIcon
            className={classes.icon}
            size="small"
            color="primary"
            onClick={() => addMovie(movie)}
          />
        )}
        {movie.created_at ? (
          <DeleteIcon
            className={classes.icon}
            color="primary"
            onClick={() => deleteMovie(movie.imdbID)}
          />
        ) : null}
        {movie.created_at && !movie.watched_on ? (
          <MovieIcon
            className={classes.icon}
            color="primary"
            onClick={() => watchMovie(movie.imdbID)}
          />
        ) : null}
      </CardActions>
    </Card>
  );
}
