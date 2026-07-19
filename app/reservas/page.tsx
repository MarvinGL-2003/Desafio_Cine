'use client';

import { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { agregarReserva } from '../store/slices/reservasSlice';

// --------------------------------------------------
// PÁGINA DE RESERVAS
// --------------------------------------------------
export default function ReservasPage() {
  const dispatch = useDispatch();
  const peliculas = useSelector((state: RootState) => state.peliculas.peliculas);
  const asientos = useSelector((state: RootState) => state.asientos.asientos);
  const reservas = useSelector((state: RootState) => state.reservas.reservas);
  const funciones = useSelector((state: RootState) => state.funciones.funciones);
  const usuarioActual = useSelector((state: RootState) => state.usuarios.usuarioActual);

  // --------------------------------------------------
  // ESTADO LOCAL
  // --------------------------------------------------
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState('');
  const [funcionSeleccionada, setFuncionSeleccionada] = useState('');
  const [cantidadBoletos, setCantidadBoletos] = useState(1);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState<string[]>([]);
  const [destinatario, setDestinatario] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mensajeTipo, setMensajeTipo] = useState<'exito' | 'error' | 'info'>('info');

  // --------------------------------------------------
  // OBTENER DATOS
  // --------------------------------------------------
  const pelicula = peliculas.find(p => p.id === peliculaSeleccionada);
  const funcionesDisponibles = funciones.filter(f => f.peliculaId === peliculaSeleccionada);
  const funcion = funciones.find(f => f.id === funcionSeleccionada);
  const peliculasDisponibles = peliculas.filter(p => p.estado === 'Disponible');

  const asientosSala = funcion
    ? asientos.filter(a => a.sala === funcion.sala)
    : [];

  const reservasDeEstaFuncion = reservas.filter(r => r.funcionId === funcionSeleccionada);
  const asientosReservadosEnEstaFuncion = reservasDeEstaFuncion.flatMap(r => r.asientosIds);

  const asientosConEstado = asientosSala.map(a => ({
    ...a,
    estado: asientosReservadosEnEstaFuncion.includes(a.id) ? 'Reservado' : 'Disponible'
  }));

  const asientosDisponibles = asientosConEstado.filter(a => a.estado === 'Disponible').length;
  const asientosOcupados = asientosConEstado.filter(a => a.estado === 'Reservado').length;
  const totalAsientosSala = asientosConEstado.length;

  const total = pelicula ? pelicula.precio * cantidadBoletos : 0;

  // --------------------------------------------------
  // MANEJADORES
  // --------------------------------------------------
  const toggleAsiento = (asientoId: string) => {
    const asiento = asientosConEstado.find(a => a.id === asientoId);
    if (!asiento) return;

    if (asiento.estado === 'Reservado') {
      const destinatarioAsiento = obtenerDestinatario(asientoId);
      setMensaje(`❌ Este asiento ya está ocupado por ${destinatarioAsiento || 'alguien'}`);
      setMensajeTipo('error');
      return;
    }

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

  const obtenerDestinatario = (asientoId: string): string | null => {
    const reserva = reservasDeEstaFuncion.find(r => r.asientosIds.includes(asientoId));
    return reserva?.destinatario || null;
  };

  const handleCantidadBoletosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (val > 0) {
      if (val > asientosDisponibles) {
        setMensaje(`⚠️ Solo hay ${asientosDisponibles} asientos disponibles.`);
        setMensajeTipo('error');
        setCantidadBoletos(asientosDisponibles);
        setAsientosSeleccionados([]);
        return;
      }
      setCantidadBoletos(val);
      setAsientosSeleccionados([]);
      setMensaje('');
    } else {
      setCantidadBoletos(1);
      setAsientosSeleccionados([]);
      setMensaje('');
    }
  };

  const handleConfirmarReserva = () => {
    if (!peliculaSeleccionada) {
      setMensaje('⚠️ Selecciona una película');
      setMensajeTipo('error');
      return;
    }

    if (!funcionSeleccionada) {
      setMensaje('⚠️ Selecciona una función');
      setMensajeTipo('error');
      return;
    }

    if (!destinatario.trim()) {
      setMensaje('⚠️ Ingresa el nombre del destinatario');
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

    if (cantidadBoletos > asientosDisponibles) {
      setMensaje(`⚠️ Solo hay ${asientosDisponibles} asientos disponibles.`);
      setMensajeTipo('error');
      return;
    }

    const asientosOcupados = asientosSeleccionados.some(id => {
      const asiento = asientosConEstado.find(a => a.id === id);
      return asiento?.estado === 'Reservado';
    });

    if (asientosOcupados) {
      setMensaje('❌ Algunos asientos ya no están disponibles');
      setMensajeTipo('error');
      return;
    }

    if (!usuarioActual) {
      setMensaje('❌ Debes iniciar sesión para reservar');
      setMensajeTipo('error');
      return;
    }

    const reservaId = `R-${Date.now()}`;
    
    dispatch(agregarReserva({
      id: reservaId,
      peliculaId: peliculaSeleccionada,
      funcionId: funcionSeleccionada,
      sala: funcion!.sala,
      asientosIds: asientosSeleccionados,
      total: total,
      fecha: new Date().toISOString(),
      cantidadBoletos: cantidadBoletos,
      usuarioId: usuarioActual.id,
      usuarioNombre: usuarioActual.nombre,
      destinatario: destinatario.trim(),
    }));

    setMensaje(`✅ ¡Reserva confirmada! Total: $${total.toFixed(2)}`);
    setMensajeTipo('exito');
    setAsientosSeleccionados([]);
    setCantidadBoletos(1);
    setDestinatario('');

    setTimeout(() => setMensaje(''), 5000);
  };

  useEffect(() => {
    setAsientosSeleccionados([]);
    setMensaje('');
  }, [peliculaSeleccionada, funcionSeleccionada]);

  // ============================================================
  // OBTENER FILAS Y NÚMEROS PARA EL MAPA
  // ============================================================
  const filas = [...new Set(asientosConEstado.map(a => a.fila))].sort();
  const numeros = [...new Set(asientosConEstado.map(a => a.numero))].sort((a, b) => a - b);

  // ============================================================
  // RENDERIZADO
  // ============================================================
  return (
    <div>
      <h1 className="page-title">🎫 Reserva de Boletos</h1>

      {usuarioActual && (
        <div className="usuario-reserva-card">
          <div className="usuario-reserva-avatar">
            <span>👤</span>
          </div>
          <div className="usuario-reserva-info">
            <span className="usuario-reserva-nombre">{usuarioActual.nombre}</span>
            <span className="usuario-reserva-usuario">@{usuarioActual.usuario}</span>
          </div>
          <div className="usuario-reserva-badge">
            <span>🎫 Reservando ahora</span>
          </div>
        </div>
      )}

      {mensaje && (
        <div className={
          mensajeTipo === 'exito' ? 'success-container' :
          mensajeTipo === 'error' ? 'error-container' :
          'info-container'
        }>
          {mensaje}
        </div>
      )}

      <div className="reservas-grid">
        {/* PANEL IZQUIERDO */}
        <div className="reservas-panel">
          <h2 className="reservas-panel-title">🎬 Seleccionar Película</h2>

          <div className="form-group">
            <label className="form-label">Película *</label>
            <select
              value={peliculaSeleccionada}
              onChange={(e) => {
                setPeliculaSeleccionada(e.target.value);
                setFuncionSeleccionada('');
                setAsientosSeleccionados([]);
                setMensaje('');
              }}
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
                <label className="form-label">Función *</label>
                <select
                  value={funcionSeleccionada}
                  onChange={(e) => {
                    setFuncionSeleccionada(e.target.value);
                    setAsientosSeleccionados([]);
                    setMensaje('');
                  }}
                  className="form-select"
                >
                  <option value="">Selecciona una función</option>
                  {funcionesDisponibles.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.sala} - {f.horario} hs ({f.fecha})
                    </option>
                  ))}
                </select>
                {funcionesDisponibles.length === 0 && (
                  <p style={{ marginTop: '8px', color: '#ef4444', fontSize: '14px' }}>
                    No hay funciones disponibles para esta película
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Cantidad de boletos</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    min="1"
                    max={asientosDisponibles || 1}
                    value={cantidadBoletos}
                    onChange={handleCantidadBoletosChange}
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                    (máx. {asientosDisponibles})
                  </span>
                </div>
                <small className="form-hint">
                  {asientosOcupados > 0 && `${asientosOcupados} asientos ocupados · ${asientosDisponibles} disponibles`}
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">👤 Boletos a nombre de *</label>
                <input
                  type="text"
                  placeholder="Nombre de la persona que recibirá los boletos"
                  value={destinatario}
                  onChange={(e) => setDestinatario(e.target.value)}
                  className="form-input"
                />
                <small className="form-hint">Ej: Juan Pérez, María Gómez, etc.</small>
              </div>

              <div className="reservas-resumen">
                <h3 className="reservas-resumen-title">📋 Resumen</h3>
                <p className="reservas-resumen-item"><strong>Película:</strong> {pelicula.nombre}</p>
                <p className="reservas-resumen-item"><strong>Sala:</strong> {funcion?.sala || 'Selecciona una función'}</p>
                <p className="reservas-resumen-item"><strong>Horario:</strong> {funcion?.horario || 'Selecciona una función'}</p>
                <p className="reservas-resumen-item"><strong>Precio por boleto:</strong> ${pelicula.precio.toFixed(2)}</p>
                <p className="reservas-resumen-item"><strong>Boletos:</strong> {cantidadBoletos}</p>
                <p className="reservas-resumen-item" style={{ color: '#6b7280', fontSize: '12px' }}>
                  Disponibles: {asientosDisponibles} · Ocupados: {asientosOcupados}
                </p>
                <p className="reservas-resumen-item"><strong>Reservado por:</strong> {usuarioActual?.nombre || 'No autenticado'}</p>
                <p className="reservas-resumen-item" style={{ fontWeight: 'bold', color: '#a78bfa' }}>
                  <strong>Destinatario:</strong> {destinatario || '(pendiente)'}
                </p>
                <hr />
                <p className="reservas-total">Total: ${total.toFixed(2)}</p>
              </div>

              <button
                onClick={handleConfirmarReserva}
                className="btn btn-success reservas-boton-confirmar"
                disabled={
                  asientosSeleccionados.length !== cantidadBoletos || 
                  !funcionSeleccionada || 
                  !usuarioActual ||
                  !destinatario.trim() ||
                  cantidadBoletos > asientosDisponibles
                }
              >
                ✅ Confirmar Reserva
              </button>
              {cantidadBoletos > asientosDisponibles && (
                <p className="reservas-alerta" style={{ color: '#ef4444' }}>
                  ⚠️ No hay suficientes asientos disponibles (máx. {asientosDisponibles})
                </p>
              )}
              {!destinatario.trim() && (
                <p className="reservas-alerta" style={{ color: '#eab308' }}>
                  ⚠️ Ingresa el nombre del destinatario
                </p>
              )}
              {asientosSeleccionados.length !== cantidadBoletos && asientosSeleccionados.length > 0 && (
                <p className="reservas-alerta">
                  ⚠️ Selecciona {cantidadBoletos - asientosSeleccionados.length} asientos más
                </p>
              )}
              {!usuarioActual && (
                <p className="reservas-alerta" style={{ color: '#ef4444' }}>
                  ⚠️ Debes iniciar sesión para reservar
                </p>
              )}
            </>
          )}
        </div>

        {/* PANEL DERECHO: MAPA DE ASIENTOS */}
        <div className="reservas-panel">
          <h2 className="reservas-panel-title">💺 Seleccionar Asientos</h2>

          {pelicula && funcion ? (
            <>
              <div className="seats-info">
                <span>Seleccionados: <strong>{asientosSeleccionados.length}</strong> / {cantidadBoletos}</span>
                <span>Totales: {totalAsientosSala}</span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                  Disponibles: {asientosDisponibles} · Ocupados: {asientosOcupados}
                </span>
                {funcionSeleccionada && (
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    Función: {funcion.horario}
                  </span>
                )}
              </div>

              <div className="seats-legend">
                <span className="seats-legend-item">
                  <span className="seats-legend-box seats-legend-available"></span> Disponible
                </span>
                <span className="seats-legend-item">
                  <span className="seats-legend-box seats-legend-selected"></span> Seleccionado
                </span>
                <span className="seats-legend-item">
                  <span className="seats-legend-box seats-legend-reserved"></span> Ocupado
                </span>
                <span className="seats-legend-item" style={{ fontSize: '11px', color: '#6b7280' }}>
                  🖱️ Pasa el mouse sobre un asiento ocupado para ver quién reservó
                </span>
              </div>

              <div className="seats-container">
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
                        const asiento = asientosConEstado.find(
                          a => a.fila === fila && a.numero === num
                        );
                        if (!asiento) {
                          return <div key={`empty-${fila}${num}`} className="seats-grid-empty"></div>;
                        }
                        const estaSeleccionado = asientosSeleccionados.includes(asiento.id);
                        const estaOcupado = asiento.estado === 'Reservado';
                        const destinatarioAsiento = estaOcupado ? obtenerDestinatario(asiento.id) : null;
                        
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
                            title={estaOcupado ? `👤 ${destinatarioAsiento || 'Ocupado'}` : ''}
                            style={estaOcupado ? { cursor: 'help' } : {}}
                          >
                            {asiento.fila}{asiento.numero}
                          </button>
                        );
                      })}
                    </Fragment>
                  ))}
                </div>

                <div className="seats-screen">🎬 PANTALLA</div>

                <div className="seats-instructions">
                  <span>👆 Haz clic en un asiento para seleccionarlo</span>
                  <span>Selecciona {cantidadBoletos} asiento{cantidadBoletos > 1 ? 's' : ''}</span>
                </div>
              </div>
            </>
          ) : (
            <p className="seats-empty">
              🎬 Selecciona una película y una función para ver los asientos
            </p>
          )}
        </div>
      </div>
    </div>
  );
}