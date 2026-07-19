'use client';

import { useState, useEffect } from 'react';
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
import {
  agregarFuncion,
  editarFuncion,
  eliminarFuncion,
} from '../store/slices/funcionesSlice';
import { Pelicula, Funcion } from '../types';

// --------------------------------------------------
// FUNCIÓN PARA CONVERTIR 24h A 12h (para guardar)
// --------------------------------------------------
const convertirHorario12h = (horario24: string): string => {
  if (!horario24) return '';
  
  const partes = horario24.split(':');
  let horas = parseInt(partes[0]);
  const minutos = partes[1] || '00';
  const ampm = horas >= 12 ? 'PM' : 'AM';
  
  horas = horas % 12;
  horas = horas ? horas : 12;
  
  return `${horas}:${minutos} ${ampm}`;
};

// --------------------------------------------------
// FUNCIÓN PARA CONVERTIR 12h A 24h (para editar)
// --------------------------------------------------
const convertirHorario24h = (horario12: string): string => {
  if (!horario12) return '';
  
  const limpio = horario12.trim().toUpperCase();
  const esPM = limpio.includes('PM');
  const esAM = limpio.includes('AM');
  
  const numeros = limpio.replace('AM', '').replace('PM', '').trim();
  const partes = numeros.split(':');
  
  let horas = parseInt(partes[0]);
  const minutos = partes[1] || '00';
  
  if (esPM && horas !== 12) {
    horas += 12;
  } else if (esAM && horas === 12) {
    horas = 0;
  }
  
  return `${String(horas).padStart(2, '0')}:${minutos}`;
};

// --------------------------------------------------
// FUNCIÓN PARA CONVERTIR DURACIÓN (HH:MM) A MINUTOS
// --------------------------------------------------
const duracionToMinutos = (duracion: string): number => {
  if (!duracion) return 0;
  const partes = duracion.split(':');
  const horas = parseInt(partes[0]) || 0;
  const minutos = parseInt(partes[1]) || 0;
  return horas * 60 + minutos;
};

// --------------------------------------------------
// FUNCIÓN PARA CONVERTIR MINUTOS A DURACIÓN (HH:MM)
// --------------------------------------------------
const minutosToDuracion = (minutos: number): string => {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

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
  const funciones = useSelector((state: RootState) => state.funciones.funciones);

  // --------------------------------------------------
  // ESTADO DEL FORMULARIO DE PELÍCULA
  // --------------------------------------------------
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    genero: '',
    duracion: '',
    clasificacion: '',
    sala: '',
    precio: '',
    estado: 'Disponible',
  });

  const [errores, setErrores] = useState<string[]>([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [peliculaEditando, setPeliculaEditando] = useState<Pelicula | null>(null);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // --------------------------------------------------
  // ESTADO PARA FUNCIONES
  // --------------------------------------------------
  const [funcionData, setFuncionData] = useState({
    id: '',
    peliculaId: '',
    sala: '',
    horario: '',
    fecha: '',
  });
  const [erroresFuncion, setErroresFuncion] = useState<string[]>([]);
  const [mensajeExitoFuncion, setMensajeExitoFuncion] = useState('');
  const [modoEdicionFuncion, setModoEdicionFuncion] = useState(false);
  const [funcionEditando, setFuncionEditando] = useState<Funcion | null>(null);
  const [funcionesTemporales, setFuncionesTemporales] = useState<Funcion[]>([]);

  // --------------------------------------------------
  // FUNCIÓN PARA GENERAR CÓDIGO
  // --------------------------------------------------
  const generarCodigo = (): string => {
    let maxNumero = 0;
    
    peliculas.forEach((pelicula) => {
      const codigo = pelicula.codigo;
      const numero = parseInt(codigo.replace('P', ''));
      if (!isNaN(numero) && numero > maxNumero) {
        maxNumero = numero;
      }
    });
    
    const nuevoNumero = maxNumero + 1;
    return `P${String(nuevoNumero).padStart(3, '0')}`;
  };

  // --------------------------------------------------
  // GENERAR CÓDIGO AUTOMÁTICAMENTE AL ABRIR EL FORMULARIO
  // --------------------------------------------------
  useEffect(() => {
    if (mostrarFormulario && !modoEdicion) {
      setFormData(prev => ({
        ...prev,
        codigo: generarCodigo(),
        estado: 'Disponible',
        duracion: '02:00',
      }));
      setFuncionesTemporales([]);
    }
  }, [mostrarFormulario, modoEdicion, peliculas]);

  // --------------------------------------------------
  // OBTENER FECHA ACTUAL PARA VALIDACIÓN
  // --------------------------------------------------
  const obtenerFechaMinima = (): string => {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0');
    const day = String(hoy.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fechaMinima = obtenerFechaMinima();

  // --------------------------------------------------
  // MANEJADORES DEL FORMULARIO DE PELÍCULA
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
    
    if (!formData.duracion) {
      erroresTemp.push('La duración es obligatoria');
    } else {
      const partes = formData.duracion.split(':');
      if (partes.length !== 2) {
        erroresTemp.push('Formato de duración inválido (HH:MM)');
      } else {
        const horas = parseInt(partes[0]);
        const minutos = parseInt(partes[1]);
        if (isNaN(horas) || isNaN(minutos)) {
          erroresTemp.push('La duración debe ser un número');
        } else if (horas < 0 || minutos < 0) {
          erroresTemp.push('La duración no puede ser negativa');
        } else if (horas === 0 && minutos === 0) {
          erroresTemp.push('La duración debe ser mayor a 0');
        } else if (horas > 6) {
          erroresTemp.push('La duración no puede superar las 6 horas');
        } else if (minutos >= 60) {
          erroresTemp.push('Los minutos deben ser menores a 60');
        }
      }
    }
    
    if (!formData.clasificacion) erroresTemp.push('Selecciona una clasificación');
    if (!formData.sala) erroresTemp.push('Selecciona una sala');
    if (parseFloat(formData.precio) <= 0) erroresTemp.push('El precio debe ser mayor a 0');
    if (!formData.estado) erroresTemp.push('Selecciona un estado');

    if (!modoEdicion && funcionesTemporales.length === 0) {
      erroresTemp.push('⚠️ Debes agregar al menos una función para la película');
    }

    if (modoEdicion) {
      const existe = peliculas.some(p => p.codigo === formData.codigo && p.id !== peliculaEditando?.id);
      if (existe) erroresTemp.push('Ya existe una película con ese código');
    }

    setErrores(erroresTemp);
    return erroresTemp.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const duracionMinutos = duracionToMinutos(formData.duracion);

    if (modoEdicion && peliculaEditando) {
      const peliculaEditada: Pelicula = {
        ...peliculaEditando,
        codigo: formData.codigo,
        nombre: formData.nombre,
        genero: formData.genero,
        duracion: duracionMinutos,
        clasificacion: formData.clasificacion,
        sala: formData.sala,
        precio: parseFloat(formData.precio),
        estado: formData.estado as 'Disponible' | 'No disponible',
      };
      dispatch(editarPelicula(peliculaEditada));
      setMensajeExito('✅ Película editada con éxito');
      setModoEdicion(false);
      setPeliculaEditando(null);
      setMostrarFormulario(false);
      
      setFuncionData({
        id: '',
        peliculaId: '',
        sala: '',
        horario: '',
        fecha: '',
      });
      setModoEdicionFuncion(false);
      setFuncionEditando(null);
      setFuncionesTemporales([]);
    } else {
      const nuevaPelicula: Pelicula = {
        id: formData.codigo,
        codigo: formData.codigo,
        nombre: formData.nombre,
        genero: formData.genero,
        duracion: duracionMinutos,
        clasificacion: formData.clasificacion,
        sala: formData.sala,
        precio: parseFloat(formData.precio),
        estado: formData.estado as 'Disponible' | 'No disponible',
      };
      
      dispatch(agregarPelicula(nuevaPelicula));
      
      funcionesTemporales.forEach(funcion => {
        const funcionConId: Funcion = {
          ...funcion,
          peliculaId: formData.codigo,
        };
        dispatch(agregarFuncion(funcionConId));
      });
      
      setMensajeExito(`✅ Película "${formData.nombre}" agregada con ${funcionesTemporales.length} función(es)`);
      setMostrarFormulario(false);
      setFuncionesTemporales([]);
    }

    setFormData({
      codigo: '',
      nombre: '',
      genero: '',
      duracion: '',
      clasificacion: '',
      sala: '',
      precio: '',
      estado: 'Disponible',
    });
    setErrores([]);
    setTimeout(() => setMensajeExito(''), 3000);
  };

  const handleEditar = (pelicula: Pelicula) => {
    setModoEdicion(true);
    setPeliculaEditando(pelicula);
    setMostrarFormulario(true);
    
    const duracionFormato = minutosToDuracion(pelicula.duracion);
    
    setFormData({
      codigo: pelicula.codigo,
      nombre: pelicula.nombre,
      genero: pelicula.genero,
      duracion: duracionFormato,
      clasificacion: pelicula.clasificacion,
      sala: pelicula.sala,
      precio: pelicula.precio.toString(),
      estado: pelicula.estado,
    });
    setFuncionesTemporales([]);
    
    setFuncionData({
      id: '',
      peliculaId: pelicula.id,
      sala: '',
      horario: '',
      fecha: '',
    });
    setModoEdicionFuncion(false);
    setFuncionEditando(null);
    setErrores([]);
    setErroresFuncion([]);
    setMensajeExito('');
    setMensajeExitoFuncion('');
  };

  const handleCancelarEdicion = () => {
    setModoEdicion(false);
    setPeliculaEditando(null);
    setMostrarFormulario(false);
    setFormData({
      codigo: '',
      nombre: '',
      genero: '',
      duracion: '',
      clasificacion: '',
      sala: '',
      precio: '',
      estado: 'Disponible',
    });
    setFuncionData({
      id: '',
      peliculaId: '',
      sala: '',
      horario: '',
      fecha: '',
    });
    setModoEdicionFuncion(false);
    setFuncionEditando(null);
    setFuncionesTemporales([]);
    setErrores([]);
    setErroresFuncion([]);
  };

  // --------------------------------------------------
  // MANEJADORES DE FUNCIONES
  // --------------------------------------------------
  const handleFuncionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFuncionData({
      ...funcionData,
      [e.target.name]: e.target.value,
    });
    setErroresFuncion([]);
    setMensajeExitoFuncion('');
  };

  const handleAgregarFuncionTemporal = (e: React.FormEvent) => {
    e.preventDefault();
    setErroresFuncion([]);
    setMensajeExitoFuncion('');

    const peliculaId = modoEdicion ? peliculaEditando?.id || '' : formData.codigo;

    if (!funcionData.sala) {
      setErroresFuncion(['❌ Selecciona una sala']);
      return;
    }
    if (!peliculaId) {
      setErroresFuncion(['❌ Primero completa el código de la película']);
      return;
    }
    if (!funcionData.horario) {
      setErroresFuncion(['❌ Selecciona un horario']);
      return;
    }
    if (!funcionData.fecha) {
      setErroresFuncion(['❌ Selecciona una fecha']);
      return;
    }

    const fechaHoy = new Date();
    fechaHoy.setHours(0, 0, 0, 0);
    const fechaSeleccionada = new Date(funcionData.fecha);
    fechaSeleccionada.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < fechaHoy) {
      setErroresFuncion(['❌ No se puede seleccionar una fecha pasada']);
      return;
    }

    const horario12h = convertirHorario12h(funcionData.horario);

    const funcionesExistentes = modoEdicion 
      ? funciones.filter(f => f.peliculaId === peliculaId)
      : funcionesTemporales;

    const existe = funcionesExistentes.some(
      f => f.sala === funcionData.sala && 
           f.horario === horario12h &&
           f.fecha === funcionData.fecha
    );

    if (existe) {
      setErroresFuncion(['❌ Ya existe una función en esa sala con ese horario y fecha']);
      return;
    }

    const nuevaFuncion: Funcion = {
      id: `F-TEMP-${Date.now()}`,
      peliculaId: peliculaId,
      sala: funcionData.sala,
      horario: horario12h,
      fecha: funcionData.fecha,
    };

    if (modoEdicion) {
      dispatch(agregarFuncion(nuevaFuncion));
      setMensajeExitoFuncion('✅ Función agregada con éxito');
    } else {
      setFuncionesTemporales([...funcionesTemporales, nuevaFuncion]);
      setMensajeExitoFuncion('✅ Función agregada temporalmente (se guardará al crear la película)');
    }

    setFuncionData({
      ...funcionData,
      horario: '',
      fecha: '',
    });
    setErroresFuncion([]);
    setTimeout(() => setMensajeExitoFuncion(''), 3000);
  };

  const handleEditarFuncion = (funcion: Funcion) => {
    setModoEdicionFuncion(true);
    setFuncionEditando(funcion);
    
    const horario24 = convertirHorario24h(funcion.horario);
    
    setFuncionData({
      id: funcion.id,
      peliculaId: funcion.peliculaId,
      sala: funcion.sala,
      horario: horario24,
      fecha: funcion.fecha,
    });
    setErroresFuncion([]);
    setMensajeExitoFuncion('');
  };

  const handleCancelarEdicionFuncion = () => {
    setModoEdicionFuncion(false);
    setFuncionEditando(null);
    setFuncionData({
      ...funcionData,
      horario: '',
      fecha: '',
    });
    setErroresFuncion([]);
  };

  const handleEliminarFuncionTemporal = (id: string) => {
    if (confirm('¿Eliminar esta función?')) {
      if (modoEdicion) {
        dispatch(eliminarFuncion(id));
      } else {
        setFuncionesTemporales(funcionesTemporales.filter(f => f.id !== id));
      }
      setMensajeExitoFuncion('✅ Función eliminada');
      setTimeout(() => setMensajeExitoFuncion(''), 2000);
    }
  };

  // --------------------------------------------------
  // OBTENER FUNCIONES DE LA PELÍCULA ACTUAL
  // --------------------------------------------------
  const getFuncionesPorPelicula = (peliculaId: string) => {
    return funciones.filter(f => f.peliculaId === peliculaId);
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

  const generos = [...new Set(peliculas.map(p => p.genero))];
  const clasificaciones = ['Infantil', 'Adolescentes', 'Adultos', 'Todos', 'Mayores de 16'];
  const salas = ['Sala 1', 'Sala 2', 'Sala 3'];
  const estados = ['Disponible', 'No disponible'];

  // --------------------------------------------------
  // RENDERIZADO
  // --------------------------------------------------
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🎬 Gestión de Películas</h1>
        {!mostrarFormulario && (
          <button
            onClick={() => {
              setMostrarFormulario(true);
              setModoEdicion(false);
              setPeliculaEditando(null);
              setFormData({
                codigo: generarCodigo(),
                nombre: '',
                genero: '',
                duracion: '02:00',
                clasificacion: '',
                sala: '',
                precio: '',
                estado: 'Disponible',
              });
              setFuncionesTemporales([]);
              setErrores([]);
              setMensajeExito('');
              setFuncionData({
                id: '',
                peliculaId: '',
                sala: '',
                horario: '',
                fecha: '',
              });
              setModoEdicionFuncion(false);
              setFuncionEditando(null);
              setErroresFuncion([]);
            }}
            className="btn btn-primary"
          >
            ➕ Nueva Película
          </button>
        )}
      </div>

      {mostrarFormulario && (
        <>
          {mensajeExito && <div className="success-container">{mensajeExito}</div>}
          {errores.length > 0 && (
            <div className="error-container">
              {errores.map((error, index) => (
                <p key={index}>❌ {error}</p>
              ))}
            </div>
          )}

          <div className="card-form">
            <div className="card-form-header">
              <h2 className="card-form-title">
                {modoEdicion ? '✏️ Editar Película' : '➕ Agregar Película'}
              </h2>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancelarEdicion}
              >
                ✕ Cerrar
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Código *</label>
                  <input
                    type="text"
                    name="codigo"
                    value={formData.codigo}
                    className="form-input"
                    disabled={true}
                    style={{ 
                      backgroundColor: 'rgba(255,255,255,0.03)', 
                      cursor: 'not-allowed',
                      color: '#6b7280'
                    }}
                  />
                  <small className="form-hint">🔑 El código se genera automáticamente</small>
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

                {/* 👇 NUEVO: Selector de duración con Horas y Minutos separados */}
                <div className="form-group">
                  <label className="form-label">⏱️ Duración *</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <input
                        type="number"
                        name="duracionHoras"
                        value={formData.duracion.split(':')[0] || '0'}
                        onChange={(e) => {
                          let horas = e.target.value;
                          if (parseInt(horas) > 6) horas = '6';
                          if (parseInt(horas) < 0) horas = '0';
                          const minutos = formData.duracion.split(':')[1] || '00';
                          setFormData({ ...formData, duracion: `${horas.padStart(2, '0')}:${minutos}` });
                        }}
                        className="form-input"
                        min="0"
                        max="6"
                        placeholder="0"
                        style={{ textAlign: 'center' }}
                      />
                      <small style={{ color: '#6b7280', fontSize: '11px', display: 'block', marginTop: '2px', textAlign: 'center' }}>
                        Horas (0-6)
                      </small>
                    </div>
                    <span style={{ color: '#6b7280', fontSize: '24px', fontWeight: '300' }}>:</span>
                    <div style={{ flex: 1 }}>
                      <input
                        type="number"
                        name="duracionMinutos"
                        value={formData.duracion.split(':')[1] || '00'}
                        onChange={(e) => {
                          let minutos = e.target.value;
                          if (parseInt(minutos) > 59) minutos = '59';
                          if (parseInt(minutos) < 0) minutos = '0';
                          const horas = formData.duracion.split(':')[0] || '00';
                          setFormData({ ...formData, duracion: `${horas}:${minutos.padStart(2, '0')}` });
                        }}
                        className="form-input"
                        min="0"
                        max="59"
                        placeholder="0"
                        style={{ textAlign: 'center' }}
                      />
                      <small style={{ color: '#6b7280', fontSize: '11px', display: 'block', marginTop: '2px', textAlign: 'center' }}>
                        Minutos (0-59)
                      </small>
                    </div>
                  </div>
                  <small className="form-hint">
                    ⏰ Ej: 2 horas 30 minutos = 2 : 30 · Máx. 6 horas
                  </small>
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
                    <option value="Infantil">👶 Infantil (Todas las edades)</option>
                    <option value="Adolescentes">🧑 Adolescentes (13+)</option>
                    <option value="Adultos">👨 Adultos (18+)</option>
                    <option value="Todos">👨‍👩‍👧‍👦 Todos los públicos</option>
                    <option value="Mayores de 16">🧑 Mayores de 16 (16+)</option>
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
                    min="0.01"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">📌 Estado *</label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Disponible">✅ Disponible</option>
                    <option value="No disponible">❌ No disponible</option>
                  </select>
                  <small className="form-hint">
                    {formData.estado === 'Disponible' 
                      ? '🟢 La película estará disponible para reservas' 
                      : '🔴 La película no estará disponible para reservas'}
                  </small>
                </div>

                <div className="form-group form-group-buttons">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-full"
                    disabled={!modoEdicion && funcionesTemporales.length === 0}
                  >
                    {modoEdicion ? '💾 Actualizar' : '➕ Agregar Película'}
                    {!modoEdicion && funcionesTemporales.length === 0 && ' (Agrega una función primero)'}
                  </button>
                </div>
                {!modoEdicion && funcionesTemporales.length === 0 && (
                  <p style={{ color: '#eab308', fontSize: '13px', textAlign: 'center', marginTop: '4px' }}>
                    ⚠️ Debes agregar al menos una función para crear la película
                  </p>
                )}
              </div>
            </form>

            {/* SECCIÓN DE FUNCIONES */}
            <div className="funciones-section">
              <h3 className="funciones-section-title">
                🎬 Funciones de {formData.nombre || 'la nueva película'}
                {!modoEdicion && funcionesTemporales.length > 0 && (
                  <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#4ade80', marginLeft: '12px' }}>
                    ({funcionesTemporales.length} función(es) agregada(s))
                  </span>
                )}
                {!modoEdicion && funcionesTemporales.length === 0 && (
                  <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#eab308', marginLeft: '12px' }}>
                    ⚠️ Obligatorio agregar al menos una función
                  </span>
                )}
              </h3>

              {mensajeExitoFuncion && <div className="success-container">{mensajeExitoFuncion}</div>}
              {erroresFuncion.length > 0 && (
                <div className="error-container">
                  {erroresFuncion.map((error, index) => (
                    <p key={index}>❌ {error}</p>
                  ))}
                </div>
              )}

              <div className="funcion-form-container">
                <h4 className="funcion-form-title">
                  {modoEdicionFuncion ? '✏️ Editar Función' : '➕ Agregar Función'}
                </h4>

                <form onSubmit={handleAgregarFuncionTemporal} className="funcion-form">
                  <input
                    type="hidden"
                    name="peliculaId"
                    value={modoEdicion ? peliculaEditando?.id || '' : formData.codigo}
                  />

                  <div className="funcion-form-group">
                    <label className="funcion-form-label">🧭 Sala *</label>
                    <select
                      name="sala"
                      value={funcionData.sala || ''}
                      onChange={handleFuncionChange}
                      className="funcion-form-select"
                    >
                      <option value="">Selecciona una sala</option>
                      <option value="Sala 1">Sala 1</option>
                      <option value="Sala 2">Sala 2</option>
                      <option value="Sala 3">Sala 3</option>
                    </select>
                  </div>

                  <div className="funcion-form-group">
                    <label className="funcion-form-label">📅 Fecha *</label>
                    <input
                      type="date"
                      name="fecha"
                      value={funcionData.fecha}
                      onChange={handleFuncionChange}
                      min={fechaMinima}
                      className="funcion-form-input"
                    />
                    <small className="funcion-form-hint"></small>
                  </div>

                  <div className="funcion-form-group">
                    <label className="funcion-form-label">⏰ Hora *</label>
                    <input
                      type="time"
                      name="horario"
                      value={funcionData.horario}
                      onChange={handleFuncionChange}
                      className="funcion-form-input"
                    />
                    <small className="funcion-form-hint"> </small>
                  </div>

                  <div className="funcion-form-actions">
                    <button type="submit" className="btn btn-primary btn-sm">
                      {modoEdicionFuncion ? '💾 Actualizar' : '➕ Agregar'}
                    </button>
                    {modoEdicionFuncion && (
                      <button type="button" className="btn btn-secondary btn-sm" onClick={handleCancelarEdicionFuncion}>
                        ❌
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {(() => {
                const funcionesMostrar = modoEdicion 
                  ? getFuncionesPorPelicula(peliculaEditando?.id || '')
                  : funcionesTemporales;
                
                return funcionesMostrar.length > 0 ? (
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Sala</th>
                          <th>Fecha</th>
                          <th>Horario</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {funcionesMostrar.map((funcion) => (
                          <tr key={funcion.id}>
                            <td>{funcion.sala}</td>
                            <td>{funcion.fecha}</td>
                            <td>{funcion.horario}</td>
                            <td>
                              <div className="acciones-grupo">
                                {modoEdicion && (
                                  <button
                                    onClick={() => handleEditarFuncion(funcion)}
                                    className="btn btn-warning btn-sm"
                                  >
                                    ✏️
                                  </button>
                                )}
                                <button
                                  onClick={() => handleEliminarFuncionTemporal(funcion.id)}
                                  className="btn btn-danger btn-sm"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="funciones-empty">
                    {modoEdicion 
                      ? 'No hay funciones registradas para esta película' 
                      : '⚠️ Agrega al menos una función para crear la película'}
                  </p>
                );
              })()}

              {!modoEdicion && funcionesTemporales.length > 0 && (
                <p style={{ color: '#4ade80', fontSize: '13px', textAlign: 'center', marginTop: '8px' }}>
                  ✅ {funcionesTemporales.length} función(es) lista(s) para guardar
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {!mostrarFormulario && (
        <>
          <div className="filters-container">
            <h3 className="filters-title">🔍 Búsqueda y Filtros de Películas</h3>
            <div className="filters-grid">
              <div className="form-group form-group-no-margin">
                <label className="form-label">Buscar por nombre</label>
                <input
                  type="text"
                  placeholder="Escribe para buscar..."
                  value={filtroNombre}
                  onChange={(e) => dispatch(setFiltroNombre(e.target.value))}
                  className="form-input"
                />
              </div>

              <div className="form-group form-group-no-margin">
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

              <div className="form-group form-group-no-margin">
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

              <div className="form-group form-group-no-margin">
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

              <div className="form-group form-group-no-margin">
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

          <div className="table-container table-container-scroll">
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
                    <td colSpan={9} className="table-empty">
                      No hay películas que coincidan con los filtros
                    </td>
                  </tr>
                ) : (
                  peliculasFiltradas.map((pelicula) => (
                    <tr key={pelicula.id}>
                      <td><strong>{pelicula.codigo}</strong></td>
                      <td>{pelicula.nombre}</td>
                      <td>{pelicula.genero}</td>
                      <td>
                        {Math.floor(pelicula.duracion / 60)}h {pelicula.duracion % 60}min
                      </td>
                      <td>
                        <span className="badge badge-clasificacion">
                          {pelicula.clasificacion}
                        </span>
                      </td>
                      <td>{pelicula.sala}</td>
                      <td>${pelicula.precio.toFixed(2)}</td>
                      <td>
                        <span className={pelicula.estado === 'Disponible' ? 'badge badge-success' : 'badge badge-danger'}>
                          {pelicula.estado}
                        </span>
                      </td>
                      <td>
                        <div className="acciones-grupo">
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

          <p className="table-counter">
            Mostrando {peliculasFiltradas.length} de {peliculas.length} películas
          </p>
        </>
      )}
    </div>
  );
}