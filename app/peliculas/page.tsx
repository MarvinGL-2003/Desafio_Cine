'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import {
  agregarPelicula,
  editarPelicula,
  eliminarPelicula,
  toggleEstadoPelicula,
  setFiltroNombre,
  setFiltroGenero,
  setFiltroClasificacion,
  setFiltroSala,
  setFiltroEstado,
} from '../store/slices/peliculasSlice';
import { Pelicula } from '../types';

// --------------------------------------------------
// PÁGINA DE PELÍCULAS
// --------------------------------------------------
export default function PeliculasPage() {
  const dispatch = useDispatch();
  const {
    peliculas,
    filtroNombre,
    filtroGenero,
    filtroClasificacion,
    filtroSala,
    filtroEstado,
  } = useSelector((state: RootState) => state.peliculas);

  // --------------------------------------------------
  // ESTADO DEL FORMULARIO
  // --------------------------------------------------
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    genero: '',
    duracion: '',
    clasificacion: '',
    sala: '',
    precio: '',
  });

  const [errores, setErrores] = useState<string[]>([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [peliculaEditando, setPeliculaEditando] = useState<Pelicula | null>(null);
  const [mensajeExito, setMensajeExito] = useState('');

  // --------------------------------------------------
  // MANEJADORES DEL FORMULARIO
  // --------------------------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validarFormulario = (): boolean => {
    const erroresTemp: string[] = [];

    if (!formData.codigo.trim()) erroresTemp.push('El código es obligatorio');
    if (!formData.nombre.trim()) erroresTemp.push('El nombre es obligatorio');
    if (!formData.genero) erroresTemp.push('Selecciona un género');
    if (!formData.duracion || parseInt(formData.duracion) <= 0) {
      erroresTemp.push('La duración debe ser mayor a 0');
    }
    if (!formData.clasificacion) erroresTemp.push('Selecciona una clasificación');
    if (!formData.sala) erroresTemp.push('Selecciona una sala');
    if (parseFloat(formData.precio) < 0) erroresTemp.push('El precio no puede ser negativo');

    // Validar código duplicado
    if (!modoEdicion) {
      const existe = peliculas.some(p => p.codigo === formData.codigo);
      if (existe) erroresTemp.push('Ya existe una película con ese código');
    } else {
      const existe = peliculas.some(p => p.codigo === formData.codigo && p.id !== peliculaEditando?.id);
      if (existe) erroresTemp.push('Ya existe una película con ese código');
    }

    setErrores(erroresTemp);
    return erroresTemp.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    if (modoEdicion && peliculaEditando) {
      // Editar película
      const peliculaEditada: Pelicula = {
        ...peliculaEditando,
        codigo: formData.codigo,
        nombre: formData.nombre,
        genero: formData.genero,
        duracion: parseInt(formData.duracion),
        clasificacion: formData.clasificacion,
        sala: formData.sala,
        precio: parseFloat(formData.precio),
      };
      dispatch(editarPelicula(peliculaEditada));
      setMensajeExito('✅ Película editada con éxito');
      setModoEdicion(false);
      setPeliculaEditando(null);
    } else {
      // Agregar nueva película
      const nuevaPelicula: Pelicula = {
        id: formData.codigo,
        codigo: formData.codigo,
        nombre: formData.nombre,
        genero: formData.genero,
        duracion: parseInt(formData.duracion),
        clasificacion: formData.clasificacion,
        sala: formData.sala,
        precio: parseFloat(formData.precio),
        estado: 'Disponible',
      };
      dispatch(agregarPelicula(nuevaPelicula));
      setMensajeExito('✅ Película agregada con éxito');
    }

    // Limpiar formulario
    setFormData({
      codigo: '',
      nombre: '',
      genero: '',
      duracion: '',
      clasificacion: '',
      sala: '',
      precio: '',
    });
    setErrores([]);

    // Limpiar mensaje después de 3 segundos
    setTimeout(() => setMensajeExito(''), 3000);
  };

  const handleEditar = (pelicula: Pelicula) => {
    setModoEdicion(true);
    setPeliculaEditando(pelicula);
    setFormData({
      codigo: pelicula.codigo,
      nombre: pelicula.nombre,
      genero: pelicula.genero,
      duracion: pelicula.duracion.toString(),
      clasificacion: pelicula.clasificacion,
      sala: pelicula.sala,
      precio: pelicula.precio.toString(),
    });
    setErrores([]);
    setMensajeExito('');
  };

  const handleCancelarEdicion = () => {
    setModoEdicion(false);
    setPeliculaEditando(null);
    setFormData({
      codigo: '',
      nombre: '',
      genero: '',
      duracion: '',
      clasificacion: '',
      sala: '',
      precio: '',
    });
    setErrores([]);
  };

  // --------------------------------------------------
  // FILTRAR PELÍCULAS
  // --------------------------------------------------
  const peliculasFiltradas = peliculas.filter(p => {
    const matchNombre = p.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
    const matchGenero = filtroGenero === '' || p.genero === filtroGenero;
    const matchClasificacion = filtroClasificacion === '' || p.clasificacion === filtroClasificacion;
    const matchSala = filtroSala === '' || p.sala === filtroSala;
    const matchEstado = filtroEstado === '' || p.estado === filtroEstado;
    return matchNombre && matchGenero && matchClasificacion && matchSala && matchEstado;
  });

  // --------------------------------------------------
  // OPCIONES PARA FILTROS
  // --------------------------------------------------
  const generos = [...new Set(peliculas.map(p => p.genero))];
  const clasificaciones = [...new Set(peliculas.map(p => p.clasificacion))];
  const salas = [...new Set(peliculas.map(p => p.sala))];
  const estados = ['Disponible', 'No disponible'];

  // --------------------------------------------------
  // RENDERIZADO
  // --------------------------------------------------
  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: '#1f2937' }}>
        🎬 Gestión de Películas
      </h1>

      {/* MENSAJE DE ÉXITO */}
      {mensajeExito && (
        <div className="success-container">{mensajeExito}</div>
      )}

      {/* MENSAJE DE ERROR */}
      {errores.length > 0 && (
        <div className="error-container">
          {errores.map((error, index) => (
            <p key={index}>❌ {error}</p>
          ))}
        </div>
      )}

      {/* --------------------------------------------------
      FORMULARIO PARA AGREGAR/EDITAR
      -------------------------------------------------- */}
      <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
          {modoEdicion ? '✏️ Editar Película' : '➕ Agregar Película'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Código *</label>
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                className="form-input"
                placeholder="Ej: P001"
                disabled={modoEdicion}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="form-input"
                placeholder="Nombre de la película"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Género *</label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Seleccionar</option>
                <option value="Acción">Acción</option>
                <option value="Animación">Animación</option>
                <option value="Ciencia Ficción">Ciencia Ficción</option>
                <option value="Comedia">Comedia</option>
                <option value="Drama">Drama</option>
                <option value="Terror">Terror</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Duración (minutos) *</label>
              <input
                type="number"
                name="duracion"
                value={formData.duracion}
                onChange={handleChange}
                className="form-input"
                placeholder="120"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Clasificación *</label>
              <select
                name="clasificacion"
                value={formData.clasificacion}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Seleccionar</option>
                <option value="G">G</option>
                <option value="PG">PG</option>
                <option value="PG-13">PG-13</option>
                <option value="R">R</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Sala *</label>
              <select
                name="sala"
                value={formData.sala}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Seleccionar</option>
                <option value="Sala 1">Sala 1</option>
                <option value="Sala 2">Sala 2</option>
                <option value="Sala 3">Sala 3</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Precio ($) *</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                className="form-input"
                placeholder="10.00"
                step="0.01"
              />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                {modoEdicion ? '💾 Actualizar' : '➕ Agregar'}
              </button>
              {modoEdicion && (
                <button type="button" className="btn btn-secondary" onClick={handleCancelarEdicion}>
                  ❌ Cancelar
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* --------------------------------------------------
      FILTROS
      -------------------------------------------------- */}
      <div className="filters-container">
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
          🔍 Búsqueda y Filtros
        </h3>
        <div className="filters-grid">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Buscar por nombre</label>
            <input
              type="text"
              placeholder="Escribe para buscar..."
              value={filtroNombre}
              onChange={(e) => dispatch(setFiltroNombre(e.target.value))}
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Género</label>
            <select
              value={filtroGenero}
              onChange={(e) => dispatch(setFiltroGenero(e.target.value))}
              className="form-select"
            >
              <option value="">Todos</option>
              {generos.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Clasificación</label>
            <select
              value={filtroClasificacion}
              onChange={(e) => dispatch(setFiltroClasificacion(e.target.value))}
              className="form-select"
            >
              <option value="">Todas</option>
              {clasificaciones.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Sala</label>
            <select
              value={filtroSala}
              onChange={(e) => dispatch(setFiltroSala(e.target.value))}
              className="form-select"
            >
              <option value="">Todas</option>
              {salas.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => dispatch(setFiltroEstado(e.target.value))}
              className="form-select"
            >
              <option value="">Todos</option>
              {estados.map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------
      TABLA DE PELÍCULAS
      -------------------------------------------------- */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Género</th>
              <th>Duración</th>
              <th>Clasificación</th>
              <th>Sala</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {peliculasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                  No hay películas que coincidan con los filtros
                </td>
              </tr>
            ) : (
              peliculasFiltradas.map((pelicula) => (
                <tr key={pelicula.id}>
                  <td><strong>{pelicula.codigo}</strong></td>
                  <td>{pelicula.nombre}</td>
                  <td>{pelicula.genero}</td>
                  <td>{pelicula.duracion} min</td>
                  <td>{pelicula.clasificacion}</td>
                  <td>{pelicula.sala}</td>
                  <td>${pelicula.precio.toFixed(2)}</td>
                  <td>
                    <span className={pelicula.estado === 'Disponible' ? 'badge badge-success' : 'badge badge-danger'}>
                      {pelicula.estado}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleEditar(pelicula)}
                        className="btn btn-warning btn-sm"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => dispatch(toggleEstadoPelicula(pelicula.id))}
                        className="btn btn-primary btn-sm"
                      >
                        🔄
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar "${pelicula.nombre}"?`)) {
                            dispatch(eliminarPelicula(pelicula.id));
                          }
                        }}
                        className="btn btn-danger btn-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CONTADOR DE RESULTADOS */}
      <p style={{ marginTop: '12px', fontSize: '14px', color: '#6b7280' }}>
        Mostrando {peliculasFiltradas.length} de {peliculas.length} películas
      </p>
    </div>
  );
}