import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Inicio.css';

import { TiInfoLarge } from "react-icons/ti";
import { IoMdPlayCircle } from "react-icons/io";

const MAX_SINOPSIS = 220;

const Inicio = () => {
  const [peliculasPopulares, setPeliculasPopulares] = useState([]);
  const [seriesPopulares, setSeriesPopulares] = useState([]);
  const [peliculasValoradas, setPeliculasValoradas] = useState([]);
  const [seriesValoradas, setSeriesValoradas] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [detalles, setDetalles] = useState(null);
  const [mostrarSinopsisCompleta, setMostrarSinopsisCompleta] = useState(false);

  const token = process.env.REACT_APP_TMDB_ACCESS_TOKEN;

  useEffect(() => {
    const fetchData = async () => {
      const endpoints = {
        peliculasPopulares: 'https://api.themoviedb.org/3/movie/popular?language=es-MX&page=1',
        seriesPopulares: 'https://api.themoviedb.org/3/tv/popular?language=es-MX&page=1',
        peliculasValoradas: 'https://api.themoviedb.org/3/movie/top_rated?language=es-MX&page=1',
        seriesValoradas: 'https://api.themoviedb.org/3/tv/top_rated?language=es-MX&page=1',
      };

      try {
        const [resPeliculas, resSeries, resValoradas, resSeriesValoradas] = await Promise.all([
          fetch(endpoints.peliculasPopulares, { headers: { Authorization: `Bearer ${token}`, accept: 'application/json' } }),
          fetch(endpoints.seriesPopulares, { headers: { Authorization: `Bearer ${token}`, accept: 'application/json' } }),
          fetch(endpoints.peliculasValoradas, { headers: { Authorization: `Bearer ${token}`, accept: 'application/json' } }),
          fetch(endpoints.seriesValoradas, { headers: { Authorization: `Bearer ${token}`, accept: 'application/json' } }),
        ]);

        const dataPeliculas = await resPeliculas.json();
        const dataSeries = await resSeries.json();
        const dataValoradas = await resValoradas.json();
        const dataSeriesValoradas = await resSeriesValoradas.json();

        setPeliculasPopulares(dataPeliculas.results.slice(0, 10));
        setSeriesPopulares(dataSeries.results.slice(0, 10));
        setPeliculasValoradas(dataValoradas.results.slice(0, 10));
        setSeriesValoradas(dataSeriesValoradas.results.slice(0, 10));
      } catch (error) {
        console.error('Error al obtener contenido:', error);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceActual((prev) => (prev + 1) % peliculasPopulares.length);
    }, 10000);

    return () => clearInterval(intervalo);
  }, [peliculasPopulares]);

  useEffect(() => {
    const obtenerDetalles = async () => {
      if (peliculasPopulares.length === 0) return;

      const id = peliculasPopulares[indiceActual].id;
      const url = `https://api.themoviedb.org/3/movie/${id}?language=es-MX&append_to_response=credits`;

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
          },
        });

        const data = await response.json();
        const director = data.credits.crew.find((persona) => persona.job === 'Director');
        setDetalles({
          director: director ? director.name : 'Desconocido',
          duracion: data.runtime,
          generos: data.genres.map(genre => genre.name).join(', '),
        });
      } catch (error) {
        console.error('Error al obtener detalles de la película:', error);
      }
    };

    obtenerDetalles();
  }, [indiceActual, peliculasPopulares, token]);

  if (peliculasPopulares.length === 0 || !detalles) {
    return <div className="inicio-loading">Cargando contenido...</div>;
  }

  const actual = peliculasPopulares[indiceActual];
  const fondo = actual?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${actual.backdrop_path}`
    : 'https://via.placeholder.com/1200x600?text=Sin+imagen';

  // --- NUEVO: lógica para sinopsis recortada ---
  const sinopsis = actual.overview || 'Sin sinopsis disponible.';
  const esLarga = sinopsis.length > MAX_SINOPSIS;
  const sinopsisCorta = esLarga ? sinopsis.slice(0, MAX_SINOPSIS - 1) : sinopsis;

  const renderTarjetas = (lista, tipo) =>
    lista.map((item) => (
      <Link
        key={item.id}
        to={`/detalle/${tipo}/${item.id}`}
        className="custom-movie-card"
      >
        <div className="custom-card-image-container">
          <img
            src={
              item.poster_path
                ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                : 'https://via.placeholder.com/200x300?text=Sin+imagen'
            }
            alt={item.title || item.name}
            className="custom-card-image"
          />
          <div className="custom-card-info">
            <h3 className="custom-card-title">{item.title || item.name}</h3>
            <div className="custom-card-meta">
              <span className="custom-card-year">
                {new Date(item.release_date || item.first_air_date).getFullYear()}
              </span>
              <span className="custom-card-rating">
                ⭐ {item.vote_average.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    ));

  return (
    <div className="inicio-page">
      <div className="hero-banner" style={{ backgroundImage: `url(${fondo})` }}>
        <div className="banner-overlay">
          <div className="banner-content">
            <div className="movie-info">
              <p className="info-director">Dirigida por {detalles.director}</p>
              <h1 className="movie-title">{actual.title}</h1>
              <div className="movie-meta">
                <span>{new Date(actual.release_date).getFullYear()}</span>
                <span>{detalles.duracion} min</span>
                <span className="rating">
                  ⭐ {actual.vote_average.toFixed(1)}
                </span>
              </div>
              <p className="movie-description">
                {mostrarSinopsisCompleta || !esLarga ? (
                  <>
                    {sinopsis}
                    {esLarga && (
                      <span
                        className="ver-menos"
                        style={{ color: '#FFD700', cursor: 'pointer', fontWeight: 500, marginLeft: 8 }}
                        onClick={() => setMostrarSinopsisCompleta(false)}
                      >
                        ...menos
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    {sinopsisCorta}
                    <span
                      className="ver-mas"
                      style={{ color: '#FFD700', cursor: 'pointer', fontWeight: 500, marginLeft: 8 }}
                      onClick={() => setMostrarSinopsisCompleta(true)}
                    >
                      ...
                    </span>
                  </>
                )}
              </p>
              <div className="movie-genres">
                {detalles.generos}
              </div>
            </div>

            <div className="banner-controls">
              <button 
                onClick={() => setIndiceActual((prev) => (prev === 0 ? peliculasPopulares.length - 1 : prev - 1))} 
                className="control-btn nav-btn"
                aria-label="Anterior"
                title="Anterior"
              >
                ‹
              </button>
              <button 
                onClick={() => setIndiceActual((prev) => (prev + 1) % peliculasPopulares.length)} 
                className="control-btn nav-btn"
                aria-label="Siguiente"
                title="Siguiente"
              >
                ›
              </button>
              <a
                href={`/detalle/pelicula/${actual.id}`}
                className="control-btn info-btn"
                title="Ver más información"
              >
                <TiInfoLarge className="btn-icon" />
                Más información
              </a>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(actual.title + ' trailer')}`}
                className="control-btn trailer-btn"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver tráiler"
              >
                <IoMdPlayCircle className="btn-icon" />
                Ver tráiler
              </a>
            </div>
          </div>
        </div>
      </div>

      <main className="content-sections">
        <section className="content-row">
          <div className="section-header">
            <h2>Películas Populares</h2>
            <Link className="see-all" to="/peliculas">Ver todo</Link>
          </div>
          <div className="movies-scroll">
            {renderTarjetas(peliculasPopulares, 'pelicula')}
          </div>
        </section>

        <section className="content-row">
          <div className="section-header">
            <h2>Series Populares</h2>
            <Link className="see-all" to="/series">Ver todo</Link>
          </div>
          <div className="movies-scroll">
            {renderTarjetas(seriesPopulares, 'serie')}
          </div>
        </section>

        <section className="content-row">
          <div className="section-header">
            <h2>Películas Mejor Valoradas</h2>
            <Link className="see-all" to="/peliculas?top=true">Ver todo</Link>
          </div>
          <div className="movies-scroll">
            {renderTarjetas(peliculasValoradas, 'pelicula')}
          </div>
        </section>

        <section className="content-row">
          <div className="section-header">
            <h2>Series Mejor Valoradas</h2>
            <Link className="see-all" to="/series?top=true">Ver todo</Link>
          </div>
          <div className="movies-scroll">
            {renderTarjetas(seriesValoradas, 'serie')}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Inicio;