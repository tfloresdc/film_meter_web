import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Series.css';
import MovieCard from '../components/MovieCard';

const Series = () => {
  const [populares, setPopulares] = useState([]);
  const [valoradas, setValoradas] = useState([]);

  const token = process.env.REACT_APP_TMDB_ACCESS_TOKEN;

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const [resPop, resVal] = await Promise.all([
          fetch('https://api.themoviedb.org/3/tv/popular?language=es-MX&page=1', {
            headers: { Authorization: `Bearer ${token}`, accept: 'application/json' }
          }),
          fetch('https://api.themoviedb.org/3/tv/top_rated?language=es-MX&page=1', {
            headers: { Authorization: `Bearer ${token}`, accept: 'application/json' }
          })
        ]);

        const dataPop = await resPop.json();
        const dataVal = await resVal.json();

        setPopulares(dataPop.results.slice(0, 15));
        setValoradas(dataVal.results.slice(0, 15));
      } catch (error) {
        console.error('Error al cargar series:', error);
      }
    };

    fetchSeries();
  }, [token]);

  const renderTarjetas = (lista) =>
    lista.map((item) => (
      <MovieCard key={item.id} item={item} tipo="serie" />
    ));

  return (
    <div className="series-page">
      <main className="series-secciones">
        <section>
          <h2>Series Populares</h2>
          <div className="series-grid">{renderTarjetas(populares)}</div>
        </section>

        <section>
          <h2>Series Mejor Valoradas</h2>
          <div className="series-grid">{renderTarjetas(valoradas)}</div>
        </section>
      </main>
    </div>
  );
};

export default Series;