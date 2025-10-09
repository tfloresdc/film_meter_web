import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MovieCard.css';

const MovieCard = ({ item, tipo = 'pelicula', mostrarTipo = false, onClick }) => {
  const titulo = item.title || item.name || item.titulo || 'Sin título';
  const año = (item.release_date || item.first_air_date || '').slice(0, 4) || '—';
  const posterPath = item.poster_path || item.imagen || '';
  const imagen = posterPath
    ? `https://image.tmdb.org/t/p/w300${posterPath}`
    : 'https://via.placeholder.com/300x450?text=Sin+imagen';
  const rating = item.vote_average && Number(item.vote_average) > 0
    ? Number(item.vote_average).toFixed(1)
    : null;
  const director = item.director && item.director !== 'Desconocido' ? item.director : null;

  return (
    <Link
      to={`/detalle/${tipo}/${item.id}`}
      className="movie-card"
      aria-label={titulo}
      onClick={onClick} // <-- recibe el handler desde el padre
    >
      <div className="movie-card-image-container">
        <img
          className="movie-card-image"
          src={imagen}
          alt={titulo}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x450?text=Sin+imagen'; }}
        />
      </div>
      <div className="movie-card-info">
        <h3 className="movie-card-title" title={titulo}>{titulo}</h3>
        <div className="movie-card-meta">
          <span className="movie-card-year">{año}</span>
          <span className="movie-card-rating">⭐ {rating ? rating : '—'}</span>
          {mostrarTipo && <span className="movie-card-type">{tipo === 'serie' ? 'Serie' : 'Película'}</span>}
        </div>
        {director && <div className="movie-card-director">Dir: {director}</div>}
      </div>
    </Link>
  );
};

export default MovieCard;
