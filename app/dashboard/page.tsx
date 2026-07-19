'use client';

import { useDispatch, useSelector } from 'react-redux';
<<<<<<< HEAD
import { useEffect, useState } from 'react';
=======
import { useEffect, useState, Fragment } from 'react';
>>>>>>> 42eaf552ff54b0b7b5a42d8265e0aa8a799c890e
import { useRouter } from 'next/navigation';

import type { AppDispatch, RootState } from '../store/store';
import { cerrarSesion } from '../store/slices/usuariosSlice';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

export default function DashboardPage() {
  // ============================================================
  // USUARIO Y SESIÓN
  // ============================================================
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const usuarioActual = useSelector(
    (state: RootState) => state.usuarios.usuarioActual
  );

  useEffect(() => {
    if (!usuarioActual) {
      router.replace('/loggin');
    }
  }, [usuarioActual, router]);

  const handleCerrarSesion = () => {
    dispatch(cerrarSesion());
    router.replace('/loggin');
  };

  // ============================================================
<<<<<<< HEAD
  // FORZAR ACTUALIZACIÓN CON ESTADO
=======
  // FORZAR ACTUALIZACIÓN
>>>>>>> 42eaf552ff54b0b7b5a42d8265e0aa8a799c890e
  // ============================================================
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // ============================================================
  // OBTENER DATOS DEL STORE
  // ============================================================
  const peliculas = useSelector(
    (state: RootState) => state.peliculas.peliculas
  );

  const asientos = useSelector(
    (state: RootState) => state.asientos.asientos
  );

  const reservas = useSelector(
    (state: RootState) => state.reservas.reservas
  );
<<<<<<< HEAD
=======

  const funciones = useSelector(
    (state: RootState) => state.funciones.funciones
  );

  // ============================================================
  // ESTADO PARA FILTROS
  // ============================================================
  const [filtroPeliculaId, setFiltroPeliculaId] = useState<string>('');
  const [filtroFuncionId, setFiltroFuncionId] = useState<string>('');

  // ============================================================
  // FUNCIÓN: OBTENER ASIENTOS OCUPADOS POR FUNCIÓN
  // ============================================================
  const getAsientosOcupadosPorFuncion = (funcionId: string): string[] => {
    const reservasFuncion = reservas.filter(r => r.funcionId === funcionId);
    return reservasFuncion.flatMap(r => r.asientosIds);
  };

  // ============================================================
  // FUNCIÓN: OBTENER DESTINATARIO DE UN ASIENTO
  // ============================================================
  const obtenerDestinatario = (funcionId: string, asientoId: string): string | null => {
    const reserva = reservas.find(
      r => r.funcionId === funcionId && r.asientosIds.includes(asientoId)
    );
    return reserva?.destinatario || null;
  };

  // ============================================================
  // CALCULAR ASIENTOS OCUPADOS TOTALES
  // ============================================================
  const todosLosAsientosOcupados = reservas.flatMap(r => r.asientosIds);
  const asientosOcupadosSet = new Set(todosLosAsientosOcupados);
  const totalAsientosOcupadosReales = asientosOcupadosSet.size;
>>>>>>> 42eaf552ff54b0b7b5a42d8265e0aa8a799c890e

  // ============================================================
  // ESTADÍSTICAS BÁSICAS
  // ============================================================
  const totalPeliculas = peliculas.length;
<<<<<<< HEAD
=======
  const totalFunciones = funciones.length;
>>>>>>> 42eaf552ff54b0b7b5a42d8265e0aa8a799c890e

  const peliculasDisponibles = peliculas.filter(
    (pelicula) => pelicula.estado === 'Disponible'
  ).length;

  const totalAsientos = asientos.length;
<<<<<<< HEAD

  const totalAsientosDisponibles = asientos.filter(
    (asiento) => asiento.estado === 'Disponible'
  ).length;

  const totalAsientosOcupados = asientos.filter(
    (asiento) => asiento.estado === 'Reservado'
  ).length;
=======
  const totalAsientosDisponiblesReales = totalAsientos - totalAsientosOcupadosReales;
>>>>>>> 42eaf552ff54b0b7b5a42d8265e0aa8a799c890e

  const totalBoletosVendidos = reservas.reduce(
    (acumulador, reserva) =>
      acumulador +
      (reserva.cantidadBoletos || reserva.asientosIds.length),
<<<<<<< HEAD
    0
  );

  const ingresosGenerados = reservas.reduce(
    (acumulador, reserva) => acumulador + reserva.total,
    0
  );
=======
    0
  );

  const ingresosGenerados = reservas.reduce(
    (acumulador, reserva) => acumulador + reserva.total,
    0
  );

  const porcentajeOcupacionReal = totalAsientos > 0
    ? Math.round((totalAsientosOcupadosReales / totalAsientos) * 100)
    : 0;

  // ============================================================
  // ASIENTOS FILTRADOS POR PELÍCULA Y FUNCIÓN
  // ============================================================
  const obtenerAsientosFiltrados = () => {
    if (filtroFuncionId) {
      const funcion = funciones.find(f => f.id === filtroFuncionId);
      if (funcion) {
        const asientosSala = asientos.filter(a => a.sala === funcion.sala);
        const asientosOcupadosEnFuncion = getAsientosOcupadosPorFuncion(filtroFuncionId);
        
        return asientosSala.map(a => ({
          ...a,
          estado: asientosOcupadosEnFuncion.includes(a.id) ? 'Reservado' : 'Disponible'
        }));
      }
    }
    
    if (filtroPeliculaId) {
      const pelicula = peliculas.find(p => p.id === filtroPeliculaId);
      if (pelicula) {
        const asientosSala = asientos.filter(a => a.sala === pelicula.sala);
        const funcionesPelicula = funciones.filter(f => f.peliculaId === filtroPeliculaId);
        const asientosOcupadosPelicula = funcionesPelicula.flatMap(f => 
          getAsientosOcupadosPorFuncion(f.id)
        );
        const asientosOcupadosSetPelicula = new Set(asientosOcupadosPelicula);
        
        return asientosSala.map(a => ({
          ...a,
          estado: asientosOcupadosSetPelicula.has(a.id) ? 'Reservado' : 'Disponible'
        }));
      }
    }
    
    return asientos.map(a => ({
      ...a,
      estado: asientosOcupadosSet.has(a.id) ? 'Reservado' : 'Disponible'
    }));
  };

  const asientosFiltrados = obtenerAsientosFiltrados();

  const asientosFiltradosDisponibles = asientosFiltrados.filter(
    a => a.estado === 'Disponible'
  ).length;

  const asientosFiltradosOcupados = asientosFiltrados.filter(
    a => a.estado === 'Reservado'
  ).length;

  const asientosFiltradosTotal = asientosFiltrados.length;
  const porcentajeOcupacionFiltrado = asientosFiltradosTotal > 0
    ? Math.round((asientosFiltradosOcupados / asientosFiltradosTotal) * 100)
    : 0;

  // ============================================================
  // OBTENER SALAS DISPONIBLES SEGÚN FILTRO
  // ============================================================
  const obtenerSalasFiltradas = (): string[] => {
    if (!filtroPeliculaId && !filtroFuncionId) {
      return ['Sala 1', 'Sala 2', 'Sala 3'];
    }

    if (filtroFuncionId) {
      const funcion = funciones.find(f => f.id === filtroFuncionId);
      return funcion ? [funcion.sala] : [];
    }

    if (filtroPeliculaId) {
      const funcionesPelicula = funciones.filter(f => f.peliculaId === filtroPeliculaId);
      const salasUnicas = [...new Set(funcionesPelicula.map(f => f.sala))];
      return salasUnicas;
    }

    return [];
  };

  const salasFiltradas = obtenerSalasFiltradas();

  // ============================================================
  // ASIENTOS POR SALA
  // ============================================================
  const asientosPorSala = salasFiltradas.map((sala) => {
    const asientosSala = asientosFiltrados.filter(a => a.sala === sala);
    const totalSala = asientosSala.length;
    const disponibles = asientosSala.filter(a => a.estado === 'Disponible').length;
    const ocupados = asientosSala.filter(a => a.estado === 'Reservado').length;
    
    return {
      sala,
      disponibles,
      ocupados,
      total: totalSala,
      porcentajeOcupacion: totalSala > 0 
        ? Math.round((ocupados / totalSala) * 100) 
        : 0
    };
  });
>>>>>>> 42eaf552ff54b0b7b5a42d8265e0aa8a799c890e

  // ============================================================
  // PELÍCULA MÁS RESERVADA
  // ============================================================
  const contadorPeliculas: Record<string, number> = {};

  reservas.forEach((reserva) => {
    const pelicula = peliculas.find(
      (pelicula) => pelicula.id === reserva.peliculaId
    );

    if (pelicula) {
      contadorPeliculas[pelicula.nombre] =
        (contadorPeliculas[pelicula.nombre] || 0) +
        (reserva.cantidadBoletos || reserva.asientosIds.length);
    }
  });

  if (Object.keys(contadorPeliculas).length === 0) {
    const datosEjemplo: Record<string, number> = {
      'El Padrino': 8,
      'El Rey León': 8,
      Interestelar: 6,
      Titanic: 4,
      'El Conjuro': 2,
    };

    Object.entries(datosEjemplo).forEach(([nombre, cantidad]) => {
      const existe = peliculas.some(
        (pelicula) => pelicula.nombre === nombre
      );

      if (existe) {
        contadorPeliculas[nombre] = cantidad;
      }
    });
  }

  let peliculaMasReservada = 'Ninguna';
  let maxReservas = 0;

  for (const [nombre, cantidad] of Object.entries(contadorPeliculas)) {
    if (cantidad > maxReservas) {
      maxReservas = cantidad;
      peliculaMasReservada = nombre;
    }
  }

  // ============================================================
  // DATOS PARA GRÁFICOS
  // ============================================================
  const datosAsientosFiltrados = [
    { name: 'Disponibles', value: asientosFiltradosDisponibles },
    { name: 'Ocupados', value: asientosFiltradosOcupados },
  ];

  const datosAsientosPorSalaFiltrados = salasFiltradas.map((sala) => {
    const asientosSala = asientosFiltrados.filter(a => a.sala === sala);
    const disponibles = asientosSala.filter(a => a.estado === 'Disponible').length;
    const ocupados = asientosSala.filter(a => a.estado === 'Reservado').length;
    return { sala, disponibles, ocupados };
  });

  const datosPeliculasMasReservadas = Object.entries(contadorPeliculas)
    .filter(([, cantidad]) => cantidad > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
<<<<<<< HEAD
    .map(([nombre, cantidad]) => ({
      nombre,
      reservas: cantidad,
    }));

  const datosAsientos = [
    {
      name: 'Disponibles',
      value: totalAsientosDisponibles,
    },
    {
      name: 'Ocupados',
      value: totalAsientosOcupados,
    },
  ];

  const COLORS = ['#22c55e', '#ef4444'];

  const diasSemana = [
    'Lun',
    'Mar',
    'Mié',
    'Jue',
    'Vie',
    'Sáb',
    'Dom',
  ];

=======
    .map(([nombre, cantidad]) => ({ nombre, reservas: cantidad }));

  const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
>>>>>>> 42eaf552ff54b0b7b5a42d8265e0aa8a799c890e
  const datosVentasDiarias = diasSemana.map((dia) => ({
    dia,
    ventas: Math.floor(Math.random() * 20) + 5,
  }));

  // ============================================================
<<<<<<< HEAD
=======
  // OPCIONES PARA FILTROS
  // ============================================================
  const peliculasConFunciones = peliculas.filter(p => 
    funciones.some(f => f.peliculaId === p.id)
  );

  const funcionesFiltradas = funciones.filter(f => 
    filtroPeliculaId === '' || f.peliculaId === filtroPeliculaId
  );

  // ============================================================
  // OBTENER FILAS Y NÚMEROS PARA MAPA DE ASIENTOS
  // ============================================================
  const filas = [...new Set(asientosFiltrados.map(a => a.fila))].sort();
  const numeros = [...new Set(asientosFiltrados.map(a => a.numero))].sort((a, b) => a - b);

  const COLORS_PIE = ['#22c55e', '#ef4444'];
  
  // 👇 NUEVO: Colores para gráficos en modo oscuro
  const COLORS_BAR = ['#818cf8', '#a78bfa', '#c084fc', '#f472b6', '#fbbf24'];
  const CHART_COLORS = {
    grid: '#374151',
    axis: '#9ca3af',
    tooltipBg: '#1a1a2e',
    tooltipBorder: 'rgba(255,255,255,0.1)',
    tooltipText: '#e5e7eb',
    legendText: '#e5e7eb',
  };

  // ============================================================
>>>>>>> 42eaf552ff54b0b7b5a42d8265e0aa8a799c890e
  // VERIFICAR SESIÓN
  // ============================================================
  if (!usuarioActual) {
    return (
<<<<<<< HEAD
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
=======
      <div className="auth-page">
>>>>>>> 42eaf552ff54b0b7b5a42d8265e0aa8a799c890e
        <p>Verificando sesión...</p>
      </div>
    );
  }

  // ============================================================
  // RENDERIZADO
  // ============================================================
  return (
    <div key={refreshKey}>
<<<<<<< HEAD
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
            }}
          >
            📊 Dashboard
          </h1>

          <p
            style={{
              marginTop: '5px',
              color: '#6b7280',
            }}
          >
=======
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-header-title">📊 Dashboard</h1>
          <p className="dashboard-header-subtitle">
>>>>>>> 42eaf552ff54b0b7b5a42d8265e0aa8a799c890e
            Bienvenido, <strong>{usuarioActual.nombre}</strong>
          </p>
        </div>

<<<<<<< HEAD
        <div
          style={{
            display: 'flex',
            gap: '10px',
          }}
        >
          <button
            onClick={handleRefresh}
            className="btn btn-primary"
            style={{
              padding: '8px 20px',
            }}
          >
            🔄 Actualizar Datos
          </button>

          <button
            onClick={handleCerrarSesion}
            style={{
              padding: '8px 20px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#dc2626',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
=======
        <div className="dashboard-header-actions">
          <button onClick={handleRefresh} className="btn btn-primary">
            🔄 Actualizar Datos
          </button>
          <button onClick={handleCerrarSesion} className="btn-logout">
>>>>>>> 42eaf552ff54b0b7b5a42d8265e0aa8a799c890e
            🚪 Cerrar sesión
          </button>
        </div>
      </div>

      {/* ============================================================
      FILTROS
      ============================================================ */}
      <div className="filters-container">
        <h3 className="filters-title">🔍 Filtrar Asientos por Película y Función</h3>
        <div className="filters-grid">
          <div className="form-group form-group-no-margin">
            <label className="form-label">Película</label>
            <select
              value={filtroPeliculaId}
              onChange={(e) => {
                setFiltroPeliculaId(e.target.value);
                setFiltroFuncionId('');
              }}
              className="form-select"
            >
              <option value="">Todas las películas</option>
              {peliculasConFunciones.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          <div className="form-group form-group-no-margin">
            <label className="form-label">Función</label>
            <select
              value={filtroFuncionId}
              onChange={(e) => setFiltroFuncionId(e.target.value)}
              className="form-select"
              disabled={!filtroPeliculaId}
            >
              <option value="">Todas las funciones</option>
              {funcionesFiltradas.map(f => {
                const pelicula = peliculas.find(p => p.id === f.peliculaId);
                return (
                  <option key={f.id} value={f.id}>
                    {pelicula?.nombre || 'Sin película'} - {f.sala} - {f.horario} ({f.fecha})
                  </option>
                );
              })}
            </select>
            {!filtroPeliculaId && (
              <small className="form-hint">Selecciona una película primero</small>
            )}
          </div>

          <div className="form-group form-group-no-margin" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={() => {
                setFiltroPeliculaId('');
                setFiltroFuncionId('');
              }}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              🔄 Limpiar filtros
            </button>
          </div>
        </div>

        {(filtroPeliculaId || filtroFuncionId) && (
          <div className="dashboard-filters-summary">
            <span><strong>Total asientos:</strong> {asientosFiltradosTotal}</span>
            <span style={{ color: '#22c55e' }}><strong>Disponibles:</strong> {asientosFiltradosDisponibles}</span>
            <span style={{ color: '#ef4444' }}><strong>Ocupados:</strong> {asientosFiltradosOcupados}</span>
            <span><strong>Ocupación:</strong> {porcentajeOcupacionFiltrado}%</span>
            {filtroPeliculaId && (
              <span style={{ color: '#2563eb' }}>
                <strong>Filtro:</strong> {peliculas.find(p => p.id === filtroPeliculaId)?.nombre || 'Todas'}
                {filtroFuncionId && ` - ${funciones.find(f => f.id === filtroFuncionId)?.horario || ''}`}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ============================================================
      TARJETAS DE ESTADÍSTICAS PRINCIPALES
      ============================================================ */}
      <div className="dashboard-grid">
        <div className="card card-blue">
          <p className="card-title">Total Películas</p>
          <p className="card-value">{totalPeliculas}</p>
          <p className="card-sub">
            {peliculasDisponibles} disponibles
          </p>
        </div>

        <div className="card card-green">
          <p className="card-title">Boletos Vendidos</p>
          <p className="card-value">{totalBoletosVendidos}</p>
          <p className="card-sub">{reservas.length} reservas realizadas</p>
        </div>

        <div className="card card-indigo">
          <p className="card-title">Total Funciones</p>
          <p className="card-value">{totalFunciones}</p>
          <p className="card-sub">
            {funciones.filter(f => reservas.some(r => r.funcionId === f.id)).length} con reservas
          </p>
        </div>

        <div className="card card-yellow">
          <p className="card-title">Ingresos Generados</p>
<<<<<<< HEAD
          <p className="card-value">
            ${ingresosGenerados.toFixed(2)}
          </p>
=======
          <p className="card-value">${ingresosGenerados.toFixed(2)}</p>
          <p className="card-sub">Promedio: ${reservas.length > 0 ? (ingresosGenerados / reservas.length).toFixed(2) : '0.00'}</p>
>>>>>>> 42eaf552ff54b0b7b5a42d8265e0aa8a799c890e
        </div>

        <div className="card card-purple">
          <p className="card-title">Asientos Totales</p>
          <p className="card-value">{totalAsientos}</p>
<<<<<<< HEAD
          <p className="card-sub">
            {totalAsientosDisponibles} disponibles
          </p>
=======
          <p className="card-sub">{totalAsientosDisponiblesReales} disponibles</p>
>>>>>>> 42eaf552ff54b0b7b5a42d8265e0aa8a799c890e
        </div>

        <div className="card card-red">
          <p className="card-title">Asientos Ocupados</p>
<<<<<<< HEAD
          <p className="card-value">
            {totalAsientosOcupados}
          </p>
        </div>

        <div className="card card-purple">
          <p className="card-title">
            Película Más Reservada
          </p>

          <p
            className="card-value"
            style={{
              fontSize: '20px',
            }}
          >
            {peliculaMasReservada}
          </p>
=======
          <p className="card-value">{totalAsientosOcupadosReales}</p>
          <p className="card-sub">{porcentajeOcupacionReal}% ocupación</p>
        </div>

        <div className="card card-purple" style={{ gridColumn: 'span 2' }}>
          <p className="card-title">🎬 Película Más Reservada</p>
          <p className="card-value" style={{ fontSize: '24px' }}>{peliculaMasReservada}</p>
          <p className="card-sub">{maxReservas} boletos reservados</p>
>>>>>>> 42eaf552ff54b0b7b5a42d8265e0aa8a799c890e
        </div>
      </div>

      {/* ============================================================
      ESTADO DE ASIENTOS POR SALA (SOLO CON FILTROS)
      ============================================================ */}
      {(filtroPeliculaId || filtroFuncionId) && asientosPorSala.length > 0 && (
        <>
          <h2 className="section-title">🏛️ Estado de Asientos por Sala</h2>
          <div className="dashboard-grid">
            {asientosPorSala.map((sala) => (
              <div key={sala.sala} className="card card-purple">
                <p className="card-title">{sala.sala}</p>
                <p className="card-value">{sala.total}</p>
                <p className="card-sub">
                  {sala.disponibles} disponibles · {sala.ocupados} ocupados
                </p>
                <div style={{ marginTop: '8px' }}>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${sala.porcentajeOcupacion}%`,
                      height: '100%',
                      backgroundColor: sala.porcentajeOcupacion > 80 ? '#ef4444' : 
                                       sala.porcentajeOcupacion > 50 ? '#eab308' : '#22c55e',
                      borderRadius: '3px',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                  <p className="card-sub" style={{ marginTop: '4px' }}>
                    Ocupación: {sala.porcentajeOcupacion}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ============================================================
      MAPA DE ASIENTOS Y GRÁFICOS (SOLO CON FILTROS)
      ============================================================ */}
      {(filtroPeliculaId || filtroFuncionId) && (
        <>
          <div className="card-form">
            <h2 className="card-form-title">
              💺 Mapa de Asientos
              <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#6b7280', marginLeft: '12px' }}>
                {filtroPeliculaId ? peliculas.find(p => p.id === filtroPeliculaId)?.nombre || '' : ''}
                {filtroFuncionId && ` - ${funciones.find(f => f.id === filtroFuncionId)?.horario || ''}`}
              </span>
            </h2>

            <div className="seats-container">
              <div className="seats-info">
                <span>Totales: {asientosFiltradosTotal} asientos</span>
                <span>
                  <span style={{ color: '#22c55e' }}>● {asientosFiltradosDisponibles} disponibles</span>
                  <span style={{ color: '#ef4444', marginLeft: '12px' }}>● {asientosFiltradosOcupados} ocupados</span>
                </span>
              </div>

              <div className="seats-legend">
                <span className="seats-legend-item">
                  <span className="seats-legend-box seats-legend-available"></span> Disponible
                </span>
                <span className="seats-legend-item">
                  <span className="seats-legend-box seats-legend-occupied"></span> Ocupado
                </span>
                <span className="seats-legend-item" style={{ fontSize: '11px', color: '#6b7280' }}>
                  🖱️ Pasa el mouse sobre un asiento ocupado para ver quién reservó
                </span>
              </div>

              <div className="seats-grid">
                <div className="seats-grid-header" key="header-empty"></div>
                
                {numeros.map((num) => (
                  <div key={`col-${num}`} className="seats-grid-header">
                    {num}
                  </div>
                ))}

                {filas.map((fila) => (
                  <Fragment key={`fila-group-${fila}`}>
                    <div key={`label-${fila}`} className="seats-grid-fila">
                      {fila}
                    </div>
                    {numeros.map((num) => {
                      const asiento = asientosFiltrados.find(
                        a => a.fila === fila && a.numero === num
                      );
                      if (!asiento) {
                        return <div key={`empty-${fila}${num}`} className="seats-grid-empty"></div>;
                      }
                      const estaOcupado = asiento.estado === 'Reservado';
                      
                      let destinatario = null;
                      if (estaOcupado && filtroFuncionId) {
                        destinatario = obtenerDestinatario(filtroFuncionId, asiento.id);
                      }
                      
                      return (
                        <div
                          key={asiento.id}
                          className={`seat ${estaOcupado ? 'seat-reserved' : 'seat-available'}`}
                          style={{ cursor: estaOcupado ? 'help' : 'default' }}
                          title={estaOcupado ? `👤 ${destinatario || 'Ocupado'}` : ''}
                        >
                          {asiento.fila}{asiento.numero}
                        </div>
                      );
                    })}
                  </Fragment>
                ))}
              </div>

              <div className="seats-screen">🎬 PANTALLA</div>

              <div className="seats-instructions">
                <span>📍 Asientos disponibles en gris · Ocupados en rojo</span>
                <span>Total: {asientosFiltradosTotal} asientos</span>
              </div>
            </div>
          </div>

          {/* ============================================================
          GRÁFICOS DE ASIENTOS (CON ESTILO OSCURO)
          ============================================================ */}
          <div className="chart-grid">
            <div className="chart-container">
              <h2 className="chart-title">
                💺 Estado de Asientos
                <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#6b7280', marginLeft: '8px' }}>
                  {filtroPeliculaId ? peliculas.find(p => p.id === filtroPeliculaId)?.nombre || '' : ''}
                  {filtroFuncionId && ` (${funciones.find(f => f.id === filtroFuncionId)?.horario || ''})`}
                </span>
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={datosAsientosFiltrados}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {datosAsientosFiltrados.map((entrada, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS_PIE[index % COLORS_PIE.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a2e', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      color: '#e5e7eb',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend wrapperStyle={{ color: '#e5e7eb' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h2 className="chart-title">📊 Asientos por Sala</h2>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datosAsientosPorSalaFiltrados}>
                  <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="sala" 
                    stroke="#9ca3af" 
                    tick={{ fill: '#9ca3af' }} 
                  />
                  <YAxis 
                    stroke="#9ca3af" 
                    tick={{ fill: '#9ca3af' }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a2e', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      color: '#e5e7eb',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend wrapperStyle={{ color: '#e5e7eb' }} />
                  <Bar dataKey="disponibles" fill="#22c55e" name="Disponibles" />
                  <Bar dataKey="ocupados" fill="#ef4444" name="Ocupados" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* ============================================================
      GRÁFICOS ADICIONALES (CON ESTILO OSCURO)
      ============================================================ */}
      <div className="chart-grid">
<<<<<<< HEAD
        {/* Películas más reservadas */}
        {datosPeliculasMasReservadas.length > 0 && (
          <div className="chart-container">
            <h2
              style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
                color: '#374151',
              }}
            >
              🎬 Películas Más Reservadas
            </h2>
=======
        {datosPeliculasMasReservadas.length > 0 && (
          <div className="chart-container">
            <h2 className="chart-title">🎬 Películas Más Reservadas</h2>
>>>>>>> 42eaf552ff54b0b7b5a42d8265e0aa8a799c890e

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosPeliculasMasReservadas} layout="vertical">
                <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  stroke="#9ca3af" 
                  tick={{ fill: '#9ca3af' }} 
                />
                <YAxis 
                  dataKey="nombre" 
                  type="category" 
                  width={100} 
                  stroke="#9ca3af" 
                  tick={{ fill: '#9ca3af' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a2e', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    color: '#e5e7eb',
                    borderRadius: '8px'
                  }} 
                  formatter={(value) => `${value} boletos`} 
                />
                <Legend wrapperStyle={{ color: '#e5e7eb' }} />
                <Bar 
                  dataKey="reservas" 
                  fill="#818cf8" 
                  name="Boletos reservados" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

<<<<<<< HEAD
        {/* Estado de los asientos */}
        <div className="chart-container">
          <h2
            style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#374151',
            }}
          >
            💺 Estado de Asientos
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={datosAsientos}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${((percent || 0) * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {datosAsientos.map((entrada, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Ventas de la semana */}
        <div
          className="chart-container"
          style={{
            gridColumn: '1 / -1',
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#374151',
            }}
          >
            📈 Ventas de la Semana
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datosVentasDiarias}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey="ventas"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
=======
        <div className="chart-container">
          <h2 className="chart-title">📈 Ventas de la Semana</h2>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={datosVentasDiarias}>
              <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
              <XAxis 
                dataKey="dia" 
                stroke="#9ca3af" 
                tick={{ fill: '#9ca3af' }} 
              />
              <YAxis 
                stroke="#9ca3af" 
                tick={{ fill: '#9ca3af' }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a2e', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  color: '#e5e7eb',
                  borderRadius: '8px'
                }} 
                formatter={(value) => `${value} boletos`} 
              />
              <Legend wrapperStyle={{ color: '#e5e7eb' }} />
              <Area
                type="monotone"
                dataKey="ventas"
                stroke="#818cf8"
                fill="url(#colorGradient)"
                fillOpacity={0.3}
                name="Boletos vendidos"
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity={0.6}/>
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
            </AreaChart>
>>>>>>> 42eaf552ff54b0b7b5a42d8265e0aa8a799c890e
          </ResponsiveContainer>
        </div>
      </div>

<<<<<<< HEAD
      {/* TOTAL DE RESERVAS */}
      <div
        style={{
          marginTop: '16px',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '14px',
        }}
      >
        Total de reservas: {reservas.length}
=======
      {/* ============================================================
      TARJETAS ADICIONALES
      ============================================================ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginTop: '24px'
      }}>
        <div className="card card-blue">
          <p className="card-title">Total de Reservas</p>
          <p className="card-value">{reservas.length}</p>
          <p className="card-sub">
            {reservas.length > 0 ? `${Math.round((reservas.filter(r => r.funcionId).length / reservas.length) * 100)}% con función asignada` : 'Sin reservas aún'}
          </p>
        </div>

        <div className="card card-green">
          <p className="card-title">Promedio por Reserva</p>
          <p className="card-value">
            ${reservas.length > 0 ? (ingresosGenerados / reservas.length).toFixed(2) : '0.00'}
          </p>
          <p className="card-sub">
            {reservas.length > 0 ? `${(totalBoletosVendidos / reservas.length).toFixed(1)} boletos por reserva` : 'Sin reservas aún'}
          </p>
        </div>
>>>>>>> 42eaf552ff54b0b7b5a42d8265e0aa8a799c890e
      </div>
    </div>
  );
}