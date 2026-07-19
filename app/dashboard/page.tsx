'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
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
  LineChart,
  Line,
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
  console.log("Usuario actual:", usuarioActual);

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
  // FORZAR ACTUALIZACIÓN CON ESTADO
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

  // ============================================================
  // ESTADÍSTICAS BÁSICAS
  // ============================================================
  const totalPeliculas = peliculas.length;

  const peliculasDisponibles = peliculas.filter(
    (pelicula) => pelicula.estado === 'Disponible'
  ).length;

  const totalAsientos = asientos.length;

  const totalAsientosDisponibles = asientos.filter(
    (asiento) => asiento.estado === 'Disponible'
  ).length;

  const totalAsientosOcupados = asientos.filter(
    (asiento) => asiento.estado === 'Reservado'
  ).length;

  const totalBoletosVendidos = reservas.reduce(
    (acumulador, reserva) =>
      acumulador +
      (reserva.cantidadBoletos || reserva.asientosIds.length),
    0
  );

  const ingresosGenerados = reservas.reduce(
    (acumulador, reserva) => acumulador + reserva.total,
    0
  );

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

  // Si no hay reservas, usar datos de ejemplo
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

  
  const datosPeliculasMasReservadas = Object.entries(contadorPeliculas)
  .filter(([, cantidad]) => cantidad > 0)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
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

  const datosVentasDiarias = diasSemana.map((dia) => ({
    dia,
    ventas: Math.floor(Math.random() * 20) + 5,
  }));

  // ============================================================
  // VERIFICAR SESIÓN
  // ============================================================
  if (!usuarioActual) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>Verificando sesión...</p>
      </div>
    );
  }

  // ============================================================
  // RENDERIZADO
  // ============================================================
  return (
    <div key={refreshKey}>
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
            Bienvenido, <strong>{usuarioActual.nombre}</strong>
          </p>
        </div>

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
            🚪 Cerrar sesión
          </button>
        </div>
      </div>

      {/* TARJETAS DE ESTADÍSTICAS */}
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
        </div>

        <div className="card card-yellow">
          <p className="card-title">Ingresos Generados</p>
          <p className="card-value">
            ${ingresosGenerados.toFixed(2)}
          </p>
        </div>

        <div className="card card-purple">
          <p className="card-title">Asientos Totales</p>
          <p className="card-value">{totalAsientos}</p>
          <p className="card-sub">
            {totalAsientosDisponibles} disponibles
          </p>
        </div>

        <div className="card card-red">
          <p className="card-title">Asientos Ocupados</p>
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
        </div>
      </div>

      {/* GRÁFICOS */}
      <div className="chart-grid">
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

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosPeliculasMasReservadas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reservas" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

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
          </ResponsiveContainer>
        </div>
      </div>

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
      </div>
    </div>
  );
}