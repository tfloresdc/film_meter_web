import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Peliculas.css';
import MovieCard from '../components/MovieCard';

const Peliculas = () => {
  const [populares, setPopulares] = useState([]);
  const [valoradas, setValoradas] = useState([]);

  const token = process.env.REACT_APP_TMDB_ACCESS_TOKEN;

  useEffect(() => {
    const fetchPeliculas = async () => {
      try {
        const [resPop, resVal] = await Promise.all([
          fetch('https://api.themoviedb.org/3/movie/popular?language=es-MX&page=1', {
            headers: { Authorization: `Bearer ${token}`, accept: 'application/json' }
          }),
          fetch('https://api.themoviedb.org/3/movie/top_rated?language=es-MX&page=1', {
            headers: { Authorization: `Bearer ${token}`, accept: 'application/json' }
          })
        ]);

        const dataPop = await resPop.json();
        const dataVal = await resVal.json();

        setPopulares(dataPop.results.slice(0, 15));
        setValoradas(dataVal.results.slice(0, 15));
      } catch (error) {
        console.error('Error al cargar películas:', error);
      }
    };

    fetchPeliculas();
  }, [token]);

  const renderTarjetas = (lista) =>
    lista.map((item) => (
      <MovieCard key={item.id} item={item} tipo="pelicula" />
    ));

  return (
    <div className="peliculas-page">
      <main className="peliculas-secciones">
        <section>
          <h2>Películas Populares</h2>
          <div className="peliculas-grid">{renderTarjetas(populares)}</div>
        </section>

        <section>
          <h2>Películas Mejor Valoradas</h2>
          <div className="peliculas-grid">{renderTarjetas(valoradas)}</div>
        </section>
      </main>
    </div>
  );
};

export default Peliculas;