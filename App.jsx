import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = '83cfeb3b'; // Replace with your OMDB API key

  const fetchMovies = async (term) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${term}&apikey=${apiKey}`);
      const data = await response.json();
      if (data.Response === 'True') {
        setMovies(data.Search);
      } else {
        setError(data.Error);
      }
    } catch (err) {
      setError('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      fetchMovies(searchTerm);
    }
  };

  const fetchMovieDetails = async (movieId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`);
      const data = await response.json();
      if (data.Response === 'True') {
        setSelectedMovie(data);
      } else {
        setError(data.Error);
      }
    } catch (err) {
      setError('Failed to fetch movie details');
    } finally {
      setLoading(false);
    }
  };

  const addToFavourites = (movie) => {
    if (!favourites.find((fav) => fav.imdbID === movie.imdbID)) {
      setFavourites([...favourites, movie]);
    }
  };

  const removeFromFavourites = (movieId) => {
    setFavourites(favourites.filter((movie) => movie.imdbID !== movieId));
  };

  return (
    <div className="App">
      <h1>IMDB Clone</h1>

      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!selectedMovie && !loading && movies.length > 0 && (
        <div className="movie-list">
          {movies.map((movie) => (
            <div key={movie.imdbID} className="movie-card">
              <img src={movie.Poster} alt={movie.Title} />
              <h2>{movie.Title}</h2>
              <p>{movie.Year}</p>
              <button onClick={() => fetchMovieDetails(movie.imdbID)}>View Details</button>
              <button onClick={() => addToFavourites(movie)}>Add to Favourites</button>
            </div>
          ))}
        </div>
      )}

      {selectedMovie && !loading && (
        <div className="movie-details">
          <h2>{selectedMovie.Title}</h2>
          <img src={selectedMovie.Poster} alt={selectedMovie.Title} className="movie-poster" />
          <div className="details">
            <p><strong>Year:</strong> {selectedMovie.Year}</p>
            <p><strong>Rated:</strong> {selectedMovie.Rated}</p>
            <p><strong>Director:</strong> {selectedMovie.Director}</p>
            <p><strong>Actors:</strong> {selectedMovie.Actors}</p>
            <p><strong>Plot:</strong> {selectedMovie.Plot}</p>
            <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
            <p><strong>IMDB Rating:</strong> {selectedMovie.imdbRating}</p>
          </div>
          <button onClick={() => addToFavourites(selectedMovie)}>Add to Favourites</button>
          <button onClick={() => setSelectedMovie(null)}>Back to Search</button>
        </div>
      )}

      <h2>Favourites</h2>
      {favourites.length > 0 ? (
        <div className="movie-list">
          {favourites.map((movie) => (
            <div key={movie.imdbID} className="movie-card">
              <img src={movie.Poster} alt={movie.Title} />
              <h2>{movie.Title}</h2>
              <p>{movie.Year}</p>
              <button onClick={() => removeFromFavourites(movie.imdbID)}>Remove from Favourites</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No favourites added yet.</p>
      )}
    </div>
  );
};

export default App;
