import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Estrenos.css';

const Estrenos = () => {
  const [estrenos, setEstrenos] = useState([]);

  const token = process.env.REACT_APP_TMDB_ACCESS_TOKEN;

  useEffect(() => {
    const fetchEstrenos = async () => {
      try {
        const res = await fetch('https://api.themoviedb.org/3/movie/now_playing?language=es-MX&page=1', {
          headers: { Authorization: `Bearer ${token}`, accept: 'application/json' }
        });

        const data = await res.json();
        setEstrenos(data.results.slice(0, 15));
      } catch (error) {
        console.error('Error al cargar estrenos:', error);
      }
    };

    fetchEstrenos();
  }, [token]);

  const renderTarjetas = (lista) =>
    lista.map((item) => (
      <Link
        key={item.id}
        to={`/detalle/pelicula/${item.id}`}
        className="estrenos-card"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <img
          src={item.poster_path
            ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
            : 'https://via.placeholder.com/200x300?text=Sin+imagen'}
          alt={item.title}
        />
        <p>{item.title}</p>
      </Link>
    ));

  return (
    <div className="estrenos-page">
      <main className="estrenos-secciones">
        <section>
          <h2>Estrenos</h2>
          <div className="estrenos-grid">{renderTarjetas(estrenos)}</div>
        </section>
      </main>
    </div>
  );
};

export default Estrenos;