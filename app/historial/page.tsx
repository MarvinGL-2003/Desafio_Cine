'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '../store/store';
import { cancelarReserva } from '../store/slices/reservasSlice';
import { liberarAsientos } from '../store/slices/asientosSlice';

export default function HistorialPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const reservas = useSelector((state: RootState) => state.reservas.reservas);
  const peliculas = useSelector((state: RootState) => state.peliculas.peliculas);
  const funciones = useSelector((state: RootState) => state.funciones.funciones);
  const usuarioActual = useSelector((state: RootState) => state.usuarios.usuarioActual);

  const [mensaje, setMensaje] = useState('');
  const [mensajeTipo, setMensajeTipo] = useState<'exito' | 'error' | 'info'>('info');
  const [filtroUsuario, setFiltroUsuario] = useState('');

  if (!usuarioActual) {
    router.replace('/loggin');
    return null;
  }

  const getNombrePelicula = (peliculaId: string) => {
    const pelicula = peliculas.find(p => p.id === peliculaId);
    return pelicula ? pelicula.nombre : 'Película eliminada';
  };

  const getHorarioFuncion = (funcionId?: string) => {
    if (!funcionId) return 'N/A';
    const funcion = funciones.find(f => f.id === funcionId);
    return funcion ? `${funcion.horario} - ${funcion.fecha}` : 'Función eliminada';
  };

  const reservasFiltradas = reservas.filter(r => {
    if (filtroUsuario) {
      return r.destinatario?.toLowerCase().includes(filtroUsuario.toLowerCase()) ||
             r.usuarioNombre.toLowerCase().includes(filtroUsuario.toLowerCase());
    }
    return true;
  });

  const reservasOrdenadas = [...reservasFiltradas].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  const handleCancelarReserva = (reservaId: string, asientosIds: string[]) => {
    if (!confirm('¿Estás seguro de cancelar esta reserva? Los asientos quedarán disponibles nuevamente.')) {
      return;
    }

    // 1. Liberar los asientos
    dispatch(liberarAsientos(asientosIds));
    
    // 2. Cancelar la reserva
    dispatch(cancelarReserva(reservaId));

    setMensaje('✅ Reserva cancelada correctamente. Los asientos están disponibles nuevamente.');
    setMensajeTipo('exito');
    setTimeout(() => setMensaje(''), 3000);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📋 Historial de Ventas / Reservas</h1>
        <span style={{ fontSize: '14px', color: '#6b7280' }}>
          Total: {reservas.length} reservas
        </span>
      </div>

      {mensaje && (
        <div className={
          mensajeTipo === 'exito' ? 'success-container' :
          mensajeTipo === 'error' ? 'error-container' :
          'info-container'
        }>
          {mensaje}
        </div>
      )}

      <div className="filters-container">
        <h3 className="filters-title">🔍 Buscar por cliente o destinatario</h3>
        <div className="filters-grid">
          <div className="form-group form-group-no-margin">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              placeholder="Buscar por cliente o destinatario..."
              value={filtroUsuario}
              onChange={(e) => setFiltroUsuario(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group form-group-no-margin" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={() => setFiltroUsuario('')}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              🔄 Limpiar
            </button>
          </div>
        </div>
      </div>

      <div className="table-container table-container-scroll">
        <table className="table">
          <thead>
            <tr>
              <th># Reserva</th>
              <th>Película</th>
              <th>Sala</th>
              <th>Fecha/Hora</th>
              <th>Boletos</th>
              <th>Total</th>
              <th>Reservado por</th>
              <th>Destinatario</th>
              <th>Fecha Reserva</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservasOrdenadas.length === 0 ? (
              <tr>
                <td colSpan={10} className="table-empty">
                  {reservas.length === 0 
                    ? 'No hay reservas registradas aún' 
                    : 'No hay reservas que coincidan con el filtro'}
                </td>
              </tr>
            ) : (
              reservasOrdenadas.map((reserva) => (
                <tr key={reserva.id}>
                  <td><strong>{reserva.id}</strong></td>
                  <td>{getNombrePelicula(reserva.peliculaId)}</td>
                  <td>{reserva.sala}</td>
                  <td>{getHorarioFuncion(reserva.funcionId)}</td>
                  <td>{reserva.cantidadBoletos || reserva.asientosIds.length}</td>
                  <td><strong>${reserva.total.toFixed(2)}</strong></td>
                  <td>{reserva.usuarioNombre}</td>
                  <td>
                    <span style={{ fontWeight: 'bold', color: '#2563eb' }}>
                      {reserva.destinatario || 'N/A'}
                    </span>
                  </td>
                  <td>{formatearFecha(reserva.fecha)}</td>
                  <td>
                    <button
                      onClick={() => handleCancelarReserva(reserva.id, reserva.asientosIds)}
                      className="btn btn-danger btn-sm"
                    >
                      🗑️ Cancelar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="table-counter">
        Mostrando {reservasOrdenadas.length} de {reservas.length} reservas
      </p>
    </div>
  );
}