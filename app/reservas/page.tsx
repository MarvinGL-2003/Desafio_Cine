'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { reservarAsientos } from '../store/slices/asientosSlice';
import { agregarReserva } from '../store/slices/reservasSlice';

// --------------------------------------------------
// PÁGINA DE RESERVAS
// --------------------------------------------------
export default function ReservasPage() {
  const dispatch = useDispatch();
  const peliculas = useSelector((state: RootState) => state.peliculas.peliculas);
  const asientos = useSelector((state: RootState) => state.asientos.asientos);
  const reservas = useSelector((state: RootState) => state.reservas.reservas);

  // --------------------------------------------------
  // ESTADO LOCAL
  // --------------------------------------------------
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState('');
  const [cantidadBoletos, setCantidadBoletos] = useState(1);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [mensajeTipo, setMensajeTipo] = useState<'exito' | 'error' | 'info'>('info');

  // --------------------------------------------------
  // OBTENER DATOS DE LA PELÍCULA SELECCIONADA
  // --------------------------------------------------
  const pelicula = peliculas.find(p => p.id === peliculaSeleccionada);
  const peliculasDisponibles = peliculas.filter(p => p.estado === 'Disponible');

  // Asientos de la sala de la película seleccionada
  const asientosSala = pelicula
    ? asientos.filter(a => a.sala === pelicula.sala)
    : [];

  // Calcular total
  const total = pelicula ? pelicula.precio * cantidadBoletos : 0;

  // --------------------------------------------------
  // MANEJADORES
  // --------------------------------------------------
  const toggleAsiento = (asientoId: string) => {
    const asiento = asientos.find(a => a.id === asientoId);
    if (!asiento) return;

    // Si está reservado, no se puede seleccionar
    if (asiento.estado === 'Reservado') {
      setMensaje('❌ Este asiento ya está ocupado');
      setMensajeTipo('error');
      return;
    }

    // Seleccionar o deseleccionar
    if (asientosSeleccionados.includes(asientoId)) {
      setAsientosSeleccionados(asientosSeleccionados.filter(id => id !== asientoId));
      setMensaje('');
    } else {
      if (asientosSeleccionados.length < cantidadBoletos) {
        setAsientosSeleccionados([...asientosSeleccionados, asientoId]);
        setMensaje('');
      } else {
        setMensaje(`⚠️ Solo puedes seleccionar ${cantidadBoletos} asientos`);
        setMensajeTipo('error');
      }
    }
  };

  const handleConfirmarReserva = () => {
    // Validaciones
    if (!peliculaSeleccionada) {
      setMensaje('⚠️ Selecciona una película');
      setMensajeTipo('error');
      return;
    }

    if (asientosSeleccionados.length === 0) {
      setMensaje('⚠️ Selecciona al menos un asiento');
      setMensajeTipo('error');
      return;
    }

    if (asientosSeleccionados.length !== cantidadBoletos) {
      setMensaje(`⚠️ Debes seleccionar exactamente ${cantidadBoletos} asientos`);
      setMensajeTipo('error');
      return;
    }

    // Verificar que los asientos sigan disponibles
    const asientosOcupados = asientosSeleccionados.some(id => {
      const asiento = asientos.find(a => a.id === id);
      return asiento?.estado === 'Reservado';
    });

    if (asientosOcupados) {
      setMensaje('❌ Algunos asientos ya no están disponibles');
      setMensajeTipo('error');
      return;
    }

    // Confirmar reserva
    const reservaId = `R-${Date.now()}`;
    dispatch(reservarAsientos(asientosSeleccionados));
    dispatch(agregarReserva({
      id: reservaId,
      peliculaId: peliculaSeleccionada,
      sala: pelicula!.sala,
      asientosIds: asientosSeleccionados,
      total: total,
      fecha: new Date().toISOString(),
      cantidadBoletos: cantidadBoletos,
    }));

    setMensaje(`✅ ¡Reserva confirmada! Total: $${total.toFixed(2)}`);
    setMensajeTipo('exito');
    setAsientosSeleccionados([]);
    setCantidadBoletos(1);

    // Limpiar mensaje después de 5 segundos
    setTimeout(() => setMensaje(''), 5000);
  };

  // Limpiar selección al cambiar de película
  useEffect(() => {
    setAsientosSeleccionados([]);
    setMensaje('');
  }, [peliculaSeleccionada]);

  // --------------------------------------------------
  // RENDERIZADO
  // --------------------------------------------------
  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: '#1f2937' }}>
        🎫 Reserva de Boletos
      </h1>

      {/* MENSAJE */}
      {mensaje && (
        <div className={
          mensajeTipo === 'exito' ? 'success-container' :
          mensajeTipo === 'error' ? 'error-container' :
          'info-container'
        } style={mensajeTipo === 'info' ? {
          backgroundColor: '#dbeafe',
          border: '1px solid #60a5fa',
          color: '#1e3a8a',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '16px',
        } : {}}>
          {mensaje}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* --------------------------------------------------
        PANEL IZQUIERDO: SELECCIÓN
        -------------------------------------------------- */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            🎬 Seleccionar Película
          </h2>

          <div className="form-group">
            <label className="form-label">Película *</label>
            <select
              value={peliculaSeleccionada}
              onChange={(e) => setPeliculaSeleccionada(e.target.value)}
              className="form-select"
            >
              <option value="">Selecciona una película</option>
              {peliculasDisponibles.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre} - {p.sala} (${p.precio.toFixed(2)})
                </option>
              ))}
            </select>
            {peliculasDisponibles.length === 0 && (
              <p style={{ marginTop: '8px', color: '#ef4444', fontSize: '14px' }}>
                No hay películas disponibles
              </p>
            )}
          </div>

          {pelicula && (
            <>
              <div className="form-group">
                <label className="form-label">Cantidad de boletos</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={cantidadBoletos}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setCantidadBoletos(val > 0 ? val : 1);
                    setAsientosSeleccionados([]);
                    setMensaje('');
                  }}
                  className="form-input"
                />
              </div>

              <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '8px' }}>
                <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>📋 Resumen</h3>
                <p><strong>Película:</strong> {pelicula.nombre}</p>
                <p><strong>Sala:</strong> {pelicula.sala}</p>
                <p><strong>Precio por boleto:</strong> ${pelicula.precio.toFixed(2)}</p>
                <p><strong>Boletos:</strong> {cantidadBoletos}</p>
                <hr style={{ margin: '8px 0' }} />
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb' }}>
                  Total: ${total.toFixed(2)}
                </p>
              </div>

              <button
                onClick={handleConfirmarReserva}
                className="btn btn-success"
                style={{ width: '100%', marginTop: '16px', padding: '12px' }}
                disabled={asientosSeleccionados.length !== cantidadBoletos}
              >
                ✅ Confirmar Reserva
              </button>
              {asientosSeleccionados.length !== cantidadBoletos && asientosSeleccionados.length > 0 && (
                <p style={{ marginTop: '8px', fontSize: '14px', color: '#eab308' }}>
                  ⚠️ Selecciona {cantidadBoletos - asientosSeleccionados.length} asientos más
                </p>
              )}
            </>
          )}
        </div>

        {/* --------------------------------------------------
        PANEL DERECHO: MAPA DE ASIENTOS
        -------------------------------------------------- */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            💺 Seleccionar Asientos
          </h2>

          {pelicula ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#6b7280' }}>
                <span>Seleccionados: <strong>{asientosSeleccionados.length}</strong> / {cantidadBoletos}</span>
                <span>Totales: {asientosSala.length}</span>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '13px' }}>
                <span><span style={{ display: 'inline-block', width: '16px', height: '16px', background: '#e5e7eb', borderRadius: '4px', verticalAlign: 'middle' }}></span> Disponible</span>
                <span><span style={{ display: 'inline-block', width: '16px', height: '16px', background: '#22c55e', borderRadius: '4px', verticalAlign: 'middle' }}></span> Seleccionado</span>
                <span><span style={{ display: 'inline-block', width: '16px', height: '16px', background: '#ef4444', borderRadius: '4px', verticalAlign: 'middle' }}></span> Ocupado</span>
              </div>

              <div className="seats-grid">
                {asientosSala.map((asiento) => {
                  const estaSeleccionado = asientosSeleccionados.includes(asiento.id);
                  const estaOcupado = asiento.estado === 'Reservado';
                  return (
                    <button
                      key={asiento.id}
                      onClick={() => toggleAsiento(asiento.id)}
                      disabled={estaOcupado}
                      className={`seat ${
                        estaOcupado ? 'seat-reserved' :
                        estaSeleccionado ? 'seat-selected' :
                        'seat-available'
                      }`}
                    >
                      {asiento.fila}{asiento.numero}
                    </button>
                  );
                })}
              </div>

              <p style={{ marginTop: '12px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
                {asientosSala.length === 0 && 'No hay asientos disponibles en esta sala'}
              </p>
            </>
          ) : (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px 0' }}>
              🎬 Selecciona una película para ver los asientos
            </p>
          )}
        </div>
      </div>
    </div>
  );
}