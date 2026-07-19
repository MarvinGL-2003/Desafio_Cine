'use client';

import {
  Fragment,
  useEffect,
  useState,
} from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import type {
  AppDispatch,
  RootState,
} from '../store/store';

import {
  agregarReserva,
} from '../store/slices/reservasSlice';

// --------------------------------------------------
// PÁGINA DE RESERVAS
// --------------------------------------------------
export default function ReservasPage() {
  const dispatch = useDispatch<AppDispatch>();

  // --------------------------------------------------
  // DATOS DE REDUX
  // --------------------------------------------------
  const peliculas = useSelector(
    (state: RootState) => state.peliculas.peliculas
  );

  const asientos = useSelector(
    (state: RootState) => state.asientos.asientos
  );

  const reservas = useSelector(
    (state: RootState) => state.reservas.reservas
  );

  const funciones = useSelector(
    (state: RootState) => state.funciones.funciones
  );

  const usuarioActual = useSelector(
    (state: RootState) =>
      state.usuarios.usuarioActual
  );

  // --------------------------------------------------
  // ESTADO LOCAL
  // --------------------------------------------------
  const [
    peliculaSeleccionada,
    setPeliculaSeleccionada,
  ] = useState('');

  const [
    funcionSeleccionada,
    setFuncionSeleccionada,
  ] = useState('');

  const [
    cantidadBoletos,
    setCantidadBoletos,
  ] = useState(1);

  const [
    asientosSeleccionados,
    setAsientosSeleccionados,
  ] = useState<string[]>([]);

  const [
    destinatario,
    setDestinatario,
  ] = useState('');

  const [
    mensaje,
    setMensaje,
  ] = useState('');

  const [
    mensajeTipo,
    setMensajeTipo,
  ] = useState<'exito' | 'error' | 'info'>(
    'info'
  );

  // --------------------------------------------------
  // OBTENER PELÍCULA Y FUNCIÓN
  // --------------------------------------------------
  const pelicula = peliculas.find(
    (peliculaActual) =>
      peliculaActual.id === peliculaSeleccionada
  );

  const funcion = funciones.find(
    (funcionActual) =>
      funcionActual.id === funcionSeleccionada
  );

  const peliculasDisponibles = peliculas.filter(
    (peliculaActual) =>
      peliculaActual.estado === 'Disponible'
  );

  const funcionesDisponibles = funciones.filter(
    (funcionActual) =>
      funcionActual.peliculaId ===
      peliculaSeleccionada
  );

  // --------------------------------------------------
  // ASIENTOS DE LA SALA
  // --------------------------------------------------
  const asientosSala = funcion
    ? asientos.filter(
        (asiento) =>
          asiento.sala === funcion.sala
      )
    : [];

  // Reservas pertenecientes a la función seleccionada
  const reservasDeEstaFuncion = reservas.filter(
    (reserva) =>
      reserva.funcionId === funcionSeleccionada
  );

  // IDs de asientos que ya fueron reservados
  const asientosReservadosEnEstaFuncion =
    reservasDeEstaFuncion.flatMap(
      (reserva) => reserva.asientosIds
    );

  // Se actualiza el estado visual de cada asiento
  const asientosConEstado = asientosSala.map(
    (asiento) => ({
      ...asiento,

      estado: asientosReservadosEnEstaFuncion.includes(
        asiento.id
      )
        ? ('Reservado' as const)
        : ('Disponible' as const),
    })
  );

  const asientosDisponibles =
    asientosConEstado.filter(
      (asiento) =>
        asiento.estado === 'Disponible'
    ).length;

  const cantidadAsientosOcupados =
    asientosConEstado.filter(
      (asiento) =>
        asiento.estado === 'Reservado'
    ).length;

  const totalAsientosSala =
    asientosConEstado.length;

  const total = pelicula
    ? pelicula.precio * cantidadBoletos
    : 0;

  // --------------------------------------------------
  // OBTENER DESTINATARIO DE UN ASIENTO
  // --------------------------------------------------
  const obtenerDestinatario = (
    asientoId: string
  ): string | null => {
    const reservaEncontrada =
      reservasDeEstaFuncion.find(
        (reserva) =>
          reserva.asientosIds.includes(asientoId)
      );

    return (
      reservaEncontrada?.destinatario ??
      null
    );
  };

  // --------------------------------------------------
  // SELECCIONAR O QUITAR ASIENTO
  // --------------------------------------------------
  const toggleAsiento = (
    asientoId: string
  ) => {
    const asientoEncontrado =
      asientosConEstado.find(
        (asiento) =>
          asiento.id === asientoId
      );

    if (!asientoEncontrado) {
      return;
    }

    if (
      asientoEncontrado.estado ===
      'Reservado'
    ) {
      const nombreDestinatario =
        obtenerDestinatario(asientoId);

      setMensaje(
        `❌ Este asiento ya está ocupado por ${
          nombreDestinatario || 'otra persona'
        }.`
      );

      setMensajeTipo('error');
      return;
    }

    const asientoYaSeleccionado =
      asientosSeleccionados.includes(
        asientoId
      );

    if (asientoYaSeleccionado) {
      setAsientosSeleccionados(
        asientosSeleccionados.filter(
          (id) => id !== asientoId
        )
      );

      setMensaje('');
      return;
    }

    if (
      asientosSeleccionados.length >=
      cantidadBoletos
    ) {
      setMensaje(
        `⚠️ Solo puedes seleccionar ${cantidadBoletos} asiento${
          cantidadBoletos > 1 ? 's' : ''
        }.`
      );

      setMensajeTipo('error');
      return;
    }

    setAsientosSeleccionados([
      ...asientosSeleccionados,
      asientoId,
    ]);

    setMensaje('');
  };

  // --------------------------------------------------
  // CAMBIAR CANTIDAD DE BOLETOS
  // --------------------------------------------------
  const handleCantidadBoletosChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nuevaCantidad = Number(
      e.target.value
    );

    if (
      Number.isNaN(nuevaCantidad) ||
      nuevaCantidad < 1
    ) {
      setCantidadBoletos(1);
      setAsientosSeleccionados([]);
      setMensaje('');
      return;
    }

    if (
      nuevaCantidad >
      asientosDisponibles
    ) {
      setMensaje(
        `⚠️ Solo hay ${asientosDisponibles} asientos disponibles.`
      );

      setMensajeTipo('error');

      setCantidadBoletos(
        asientosDisponibles > 0
          ? asientosDisponibles
          : 1
      );

      setAsientosSeleccionados([]);
      return;
    }

    setCantidadBoletos(nuevaCantidad);
    setAsientosSeleccionados([]);
    setMensaje('');
  };

  // --------------------------------------------------
  // CONFIRMAR RESERVA
  // --------------------------------------------------
  const handleConfirmarReserva = () => {
    if (!peliculaSeleccionada) {
      setMensaje(
        '⚠️ Selecciona una película.'
      );

      setMensajeTipo('error');
      return;
    }

    if (
      !funcionSeleccionada ||
      !funcion
    ) {
      setMensaje(
        '⚠️ Selecciona una función.'
      );

      setMensajeTipo('error');
      return;
    }

    if (!destinatario.trim()) {
      setMensaje(
        '⚠️ Ingresa el nombre del destinatario.'
      );

      setMensajeTipo('error');
      return;
    }

    if (
      asientosSeleccionados.length === 0
    ) {
      setMensaje(
        '⚠️ Selecciona al menos un asiento.'
      );

      setMensajeTipo('error');
      return;
    }

    if (
      asientosSeleccionados.length !==
      cantidadBoletos
    ) {
      setMensaje(
        `⚠️ Debes seleccionar exactamente ${cantidadBoletos} asiento${
          cantidadBoletos > 1 ? 's' : ''
        }.`
      );

      setMensajeTipo('error');
      return;
    }

    if (
      cantidadBoletos >
      asientosDisponibles
    ) {
      setMensaje(
        `⚠️ Solo hay ${asientosDisponibles} asientos disponibles.`
      );

      setMensajeTipo('error');
      return;
    }

    const hayAsientosOcupados =
      asientosSeleccionados.some(
        (asientoId) => {
          const asientoEncontrado =
            asientosConEstado.find(
              (asiento) =>
                asiento.id === asientoId
            );

          return (
            asientoEncontrado?.estado ===
            'Reservado'
          );
        }
      );

    if (hayAsientosOcupados) {
      setMensaje(
        '❌ Algunos asientos ya no están disponibles.'
      );

      setMensajeTipo('error');
      return;
    }

    if (!usuarioActual) {
      setMensaje(
        '❌ Debes iniciar sesión para reservar.'
      );

      setMensajeTipo('error');
      return;
    }

    const reservaId = `R-${Date.now()}`;

    dispatch(
      agregarReserva({
        id: reservaId,

        peliculaId:
          peliculaSeleccionada,

        funcionId:
          funcionSeleccionada,

        sala: funcion.sala,

        asientosIds: [
          ...asientosSeleccionados,
        ],

        total,

        fecha:
          new Date().toISOString(),

        usuarioNombre:
          usuarioActual.nombre,

        destinatario:
          destinatario.trim(),

        cantidadBoletos:
          asientosSeleccionados.length,
      })
    );

    setMensaje(
      `✅ ¡Reserva confirmada! Total: $${total.toFixed(
        2
      )}`
    );

    setMensajeTipo('exito');

    setAsientosSeleccionados([]);
    setCantidadBoletos(1);
    setDestinatario('');

    setTimeout(() => {
      setMensaje('');
    }, 5000);
  };

  // --------------------------------------------------
  // LIMPIAR ASIENTOS AL CAMBIAR PELÍCULA O FUNCIÓN
  // --------------------------------------------------
  useEffect(() => {
    setAsientosSeleccionados([]);
    setMensaje('');
  }, [
    peliculaSeleccionada,
    funcionSeleccionada,
  ]);

  // --------------------------------------------------
  // FILAS Y NÚMEROS DEL MAPA
  // --------------------------------------------------
  const filas = [
    ...new Set(
      asientosConEstado.map(
        (asiento) => asiento.fila
      )
    ),
  ].sort();

  const numeros = [
    ...new Set(
      asientosConEstado.map(
        (asiento) => asiento.numero
      )
    ),
  ].sort((a, b) => a - b);

  // --------------------------------------------------
  // RENDERIZADO
  // --------------------------------------------------
  return (
    <div>
      <h1 className="page-title">
        🎫 Reserva de Boletos
      </h1>

      {usuarioActual && (
        <div className="usuario-reserva-card">
          <div className="usuario-reserva-avatar">
            <span>👤</span>
          </div>

          <div className="usuario-reserva-info">
            <span className="usuario-reserva-nombre">
              {usuarioActual.nombre}
            </span>

            <span className="usuario-reserva-usuario">
              @{usuarioActual.usuario}
            </span>
          </div>

          <div className="usuario-reserva-badge">
            <span>
              🎫 Reservando ahora
            </span>
          </div>
        </div>
      )}

      {mensaje && (
        <div
          className={
            mensajeTipo === 'exito'
              ? 'success-container'
              : mensajeTipo === 'error'
              ? 'error-container'
              : 'info-container'
          }
        >
          {mensaje}
        </div>
      )}

      <div className="reservas-grid">
        {/* PANEL IZQUIERDO */}
        <div className="reservas-panel">
          <h2 className="reservas-panel-title">
            🎬 Seleccionar Película
          </h2>

          <div className="form-group">
            <label className="form-label">
              Película *
            </label>

            <select
              value={peliculaSeleccionada}
              onChange={(e) => {
                setPeliculaSeleccionada(
                  e.target.value
                );

                setFuncionSeleccionada('');
                setAsientosSeleccionados([]);
                setMensaje('');
              }}
              className="form-select"
            >
              <option value="">
                Selecciona una película
              </option>

              {peliculasDisponibles.map(
                (peliculaActual) => (
                  <option
                    key={peliculaActual.id}
                    value={peliculaActual.id}
                  >
                    {peliculaActual.nombre} -{' '}
                    {peliculaActual.sala} ($
                    {peliculaActual.precio.toFixed(
                      2
                    )}
                    )
                  </option>
                )
              )}
            </select>

            {peliculasDisponibles.length ===
              0 && (
              <p
                style={{
                  marginTop: '8px',
                  color: '#ef4444',
                  fontSize: '14px',
                }}
              >
                No hay películas disponibles
              </p>
            )}
          </div>

          {pelicula && (
            <>
              <div className="form-group">
                <label className="form-label">
                  Función *
                </label>

                <select
                  value={
                    funcionSeleccionada
                  }
                  onChange={(e) => {
                    setFuncionSeleccionada(
                      e.target.value
                    );

                    setAsientosSeleccionados(
                      []
                    );

                    setMensaje('');
                  }}
                  className="form-select"
                >
                  <option value="">
                    Selecciona una función
                  </option>

                  {funcionesDisponibles.map(
                    (funcionActual) => (
                      <option
                        key={
                          funcionActual.id
                        }
                        value={
                          funcionActual.id
                        }
                      >
                        {funcionActual.sala} -{' '}
                        {
                          funcionActual.horario
                        }{' '}
                        hs (
                        {funcionActual.fecha})
                      </option>
                    )
                  )}
                </select>

                {funcionesDisponibles.length ===
                  0 && (
                  <p
                    style={{
                      marginTop: '8px',
                      color: '#ef4444',
                      fontSize: '14px',
                    }}
                  >
                    No hay funciones
                    disponibles para esta
                    película
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Cantidad de boletos
                </label>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <input
                    type="number"
                    min="1"
                    max={
                      asientosDisponibles ||
                      1
                    }
                    value={cantidadBoletos}
                    onChange={
                      handleCantidadBoletosChange
                    }
                    className="form-input"
                    style={{
                      flex: 1,
                    }}
                  />

                  <span
                    style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    (máx.{' '}
                    {asientosDisponibles})
                  </span>
                </div>

                <small className="form-hint">
                  {cantidadAsientosOcupados >
                    0 &&
                    `${cantidadAsientosOcupados} asientos ocupados · ${asientosDisponibles} disponibles`}
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">
                  👤 Boletos a nombre de *
                </label>

                <input
                  type="text"
                  placeholder="Nombre de la persona que recibirá los boletos"
                  value={destinatario}
                  onChange={(e) => {
                    setDestinatario(
                      e.target.value
                    );

                    setMensaje('');
                  }}
                  className="form-input"
                />

                <small className="form-hint">
                  Ejemplo: Juan Pérez,
                  María Gómez, etc.
                </small>
              </div>

              <div className="reservas-resumen">
                <h3 className="reservas-resumen-title">
                  📋 Resumen
                </h3>

                <p className="reservas-resumen-item">
                  <strong>
                    Película:
                  </strong>{' '}
                  {pelicula.nombre}
                </p>

                <p className="reservas-resumen-item">
                  <strong>Sala:</strong>{' '}
                  {funcion?.sala ||
                    'Selecciona una función'}
                </p>

                <p className="reservas-resumen-item">
                  <strong>
                    Horario:
                  </strong>{' '}
                  {funcion?.horario ||
                    'Selecciona una función'}
                </p>

                <p className="reservas-resumen-item">
                  <strong>
                    Precio por boleto:
                  </strong>{' '}
                  $
                  {pelicula.precio.toFixed(
                    2
                  )}
                </p>

                <p className="reservas-resumen-item">
                  <strong>
                    Boletos:
                  </strong>{' '}
                  {cantidadBoletos}
                </p>

                <p
                  className="reservas-resumen-item"
                  style={{
                    color: '#6b7280',
                    fontSize: '12px',
                  }}
                >
                  Disponibles:{' '}
                  {asientosDisponibles} ·
                  Ocupados:{' '}
                  {
                    cantidadAsientosOcupados
                  }
                </p>

                <p className="reservas-resumen-item">
                  <strong>
                    Reservado por:
                  </strong>{' '}
                  {usuarioActual?.nombre ||
                    'No autenticado'}
                </p>

                <p
                  className="reservas-resumen-item"
                  style={{
                    fontWeight: 'bold',
                    color: '#a78bfa',
                  }}
                >
                  <strong>
                    Destinatario:
                  </strong>{' '}
                  {destinatario ||
                    '(pendiente)'}
                </p>

                <hr />

                <p className="reservas-total">
                  Total: $
                  {total.toFixed(2)}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  handleConfirmarReserva
                }
                className="btn btn-success reservas-boton-confirmar"
                disabled={
                  asientosSeleccionados.length !==
                    cantidadBoletos ||
                  !funcionSeleccionada ||
                  !usuarioActual ||
                  !destinatario.trim() ||
                  cantidadBoletos >
                    asientosDisponibles
                }
              >
                ✅ Confirmar Reserva
              </button>

              {cantidadBoletos >
                asientosDisponibles && (
                <p
                  className="reservas-alerta"
                  style={{
                    color: '#ef4444',
                  }}
                >
                  ⚠️ No hay suficientes
                  asientos disponibles
                  (máximo{' '}
                  {asientosDisponibles})
                </p>
              )}

              {!destinatario.trim() && (
                <p
                  className="reservas-alerta"
                  style={{
                    color: '#eab308',
                  }}
                >
                  ⚠️ Ingresa el nombre del
                  destinatario
                </p>
              )}

              {asientosSeleccionados.length !==
                cantidadBoletos &&
                asientosSeleccionados.length >
                  0 && (
                  <p className="reservas-alerta">
                    ⚠️ Selecciona{' '}
                    {cantidadBoletos -
                      asientosSeleccionados.length}{' '}
                    asiento
                    {cantidadBoletos -
                      asientosSeleccionados.length >
                    1
                      ? 's'
                      : ''}{' '}
                    más
                  </p>
                )}

              {!usuarioActual && (
                <p
                  className="reservas-alerta"
                  style={{
                    color: '#ef4444',
                  }}
                >
                  ⚠️ Debes iniciar sesión
                  para reservar
                </p>
              )}
            </>
          )}
        </div>

        {/* PANEL DERECHO */}
        <div className="reservas-panel">
          <h2 className="reservas-panel-title">
            💺 Seleccionar Asientos
          </h2>

          {pelicula && funcion ? (
            <>
              <div className="seats-info">
                <span>
                  Seleccionados:{' '}
                  <strong>
                    {
                      asientosSeleccionados.length
                    }
                  </strong>{' '}
                  / {cantidadBoletos}
                </span>

                <span>
                  Totales:{' '}
                  {totalAsientosSala}
                </span>

                <span
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                  }}
                >
                  Disponibles:{' '}
                  {asientosDisponibles} ·
                  Ocupados:{' '}
                  {
                    cantidadAsientosOcupados
                  }
                </span>

                <span
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                  }}
                >
                  Función:{' '}
                  {funcion.horario}
                </span>
              </div>

              <div className="seats-legend">
                <span className="seats-legend-item">
                  <span className="seats-legend-box seats-legend-available" />
                  Disponible
                </span>

                <span className="seats-legend-item">
                  <span className="seats-legend-box seats-legend-selected" />
                  Seleccionado
                </span>

                <span className="seats-legend-item">
                  <span className="seats-legend-box seats-legend-reserved" />
                  Ocupado
                </span>

                <span
                  className="seats-legend-item"
                  style={{
                    fontSize: '11px',
                    color: '#6b7280',
                  }}
                >
                  🖱️ Pasa el mouse sobre
                  un asiento ocupado para ver
                  quién reservó
                </span>
              </div>

              <div className="seats-container">
                <div className="seats-grid">
                  <div className="seats-grid-header" />

                  {numeros.map(
                    (numero) => (
                      <div
                        key={`col-${numero}`}
                        className="seats-grid-header"
                      >
                        {numero}
                      </div>
                    )
                  )}

                  {filas.map((fila) => (
                    <Fragment
                      key={`fila-${fila}`}
                    >
                      <div className="seats-grid-fila">
                        {fila}
                      </div>

                      {numeros.map(
                        (numero) => {
                          const asiento =
                            asientosConEstado.find(
                              (
                                asientoActual
                              ) =>
                                asientoActual.fila ===
                                  fila &&
                                asientoActual.numero ===
                                  numero
                            );

                          if (!asiento) {
                            return (
                              <div
                                key={`vacio-${fila}-${numero}`}
                                className="seats-grid-empty"
                              />
                            );
                          }

                          const estaSeleccionado =
                            asientosSeleccionados.includes(
                              asiento.id
                            );

                          const estaOcupado =
                            asiento.estado ===
                            'Reservado';

                          const nombreDestinatario =
                            estaOcupado
                              ? obtenerDestinatario(
                                  asiento.id
                                )
                              : null;

                          return (
                            <button
                              type="button"
                              key={asiento.id}
                              onClick={() =>
                                toggleAsiento(
                                  asiento.id
                                )
                              }
                              disabled={
                                estaOcupado
                              }
                              className={`seat ${
                                estaOcupado
                                  ? 'seat-reserved'
                                  : estaSeleccionado
                                  ? 'seat-selected'
                                  : 'seat-available'
                              }`}
                              title={
                                estaOcupado
                                  ? `👤 ${
                                      nombreDestinatario ||
                                      'Ocupado'
                                    }`
                                  : ''
                              }
                              style={
                                estaOcupado
                                  ? {
                                      cursor:
                                        'help',
                                    }
                                  : {}
                              }
                            >
                              {asiento.fila}
                              {asiento.numero}
                            </button>
                          );
                        }
                      )}
                    </Fragment>
                  ))}
                </div>

                <div className="seats-screen">
                  🎬 PANTALLA
                </div>

                <div className="seats-instructions">
                  <span>
                    👆 Haz clic en un asiento
                    para seleccionarlo
                  </span>

                  <span>
                    Selecciona{' '}
                    {cantidadBoletos} asiento
                    {cantidadBoletos > 1
                      ? 's'
                      : ''}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <p className="seats-empty">
              🎬 Selecciona una película y
              una función para ver los
              asientos
            </p>
          )}
        </div>
      </div>
    </div>
  );
}