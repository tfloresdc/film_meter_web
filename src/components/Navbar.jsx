import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/Navbar.css';
import MovieCard from './MovieCard';

import { AiFillHome } from 'react-icons/ai';
import { MdLocalMovies, MdOutlineNewReleases } from 'react-icons/md';
import { FiSearch, FiTv, FiMenu } from "react-icons/fi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  // Scroll top
  const [scrolled, setScrolled] = useState(false);

  const token = process.env.REACT_APP_TMDB_ACCESS_TOKEN;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (!query.trim()) {
        setResultados([]);
        return;
      }

      const bloqueados = JSON.parse(localStorage.getItem('bloqueados') || '[]');
      const contenidoManual = JSON.parse(localStorage.getItem('contenidoManual') || '[]');

      const buscarContenido = async () => {
        const endpoints = [
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=es-MX&page=1`,
          `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}&language=es-MX&page=1`,
        ];

        try {
          const [resPeliculas, resSeries] = await Promise.all(
            endpoints.map(url =>
              fetch(url, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  accept: 'application/json',
                },
              }).then(r => r.json())
            )
          );

          // LOGS PARA DEPURAR
          console.log('Peliculas:', resPeliculas);
          console.log('Series:', resSeries);

          const apiResultados = [
            ...(Array.isArray(resPeliculas.results) ? resPeliculas.results.map(r => ({ ...r, tipo: 'pelicula' })) : []),
            ...(Array.isArray(resSeries.results) ? resSeries.results.map(r => ({ ...r, tipo: 'serie' })) : []),
          ];

          // LOGS PARA DEPURAR
          console.log('apiResultados:', apiResultados);

          const filtradosAPI = apiResultados.filter(item => item && !bloqueados.includes(item.id));
          const filtradosManual = contenidoManual.filter(item =>
            item.titulo && item.titulo.toLowerCase().includes(query.toLowerCase())
          );

          // LOGS PARA DEPURAR
          console.log('filtradosManual:', filtradosManual);

          setResultados([...filtradosManual, ...filtradosAPI]);
        } catch (error) {
          console.error('Error al buscar contenido:', error);
        }
      };

      buscarContenido();
    }, 400);

    return () => clearTimeout(delay);
  }, [query, token]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-left">
        <img src={logo} alt="FilmMeter Logo" className="logo" />
      </div>
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <FiMenu />
      </button>
      <ul className={`navbar-center ${menuOpen ? 'open' : ''}`}>
        <li>
          <Link to="/">
            <AiFillHome className="nav-icon"/> Inicio
          </Link>
        </li>
        <li>
          <Link to="/peliculas">
            <MdLocalMovies className="nav-icon"/> Películas
          </Link>
        </li>
        <li>
          <Link to="/series">
            <FiTv className="nav-icon"/> Series
          </Link>
        </li>
        <li>
          <Link to="/estrenos">
            <MdOutlineNewReleases className="nav-icon"/> Estrenos
          </Link>
        </li>
      </ul>
      

      <div className="navbar-right">
        <form onSubmit={(e) => e.preventDefault()} className="navbar-form">
          <span className="search-icon">
            <FiSearch/>
          </span>
          <input
            type="text"
            placeholder="Buscar película..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="navbar-input"
          />
        </form>
      </div>

      {resultados.length > 0 && (
        <div className="search-results">
          <div className="search-grid">
            {resultados.slice(0, 6).map((item) => (
              <MovieCard
                key={item.id}
                item={{
                  id: item.id,
                  title: item.titulo || item.title || item.name,
                  overview: item.descripcion || item.overview || '',
                  poster_path: item.poster_path || '',
                  imagen: item.imagen || '',
                  tipo: item.tipo,
                  release_date: item.release_date || '',
                }}
              />
            ))}
          </div>z
        </div>
      )}
    </nav>
  );
};

export default Navbar;
