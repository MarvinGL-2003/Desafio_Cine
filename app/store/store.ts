import { configureStore } from '@reduxjs/toolkit';
import peliculasReducer from './slices/peliculasSlice';
import asientosReducer from './slices/asientosSlice';
import reservasReducer from './slices/reservasSlice';
import usuariosReducer from './slices/usuariosSlice';

// --------------------------------------------------
// CONFIGURAR EL STORE
// --------------------------------------------------
export const store = configureStore({
  reducer: {
    peliculas: peliculasReducer,
    asientos: asientosReducer,
    reservas: reservasReducer,
    usuarios: usuariosReducer,
  },
});

// --------------------------------------------------
// TIPOS PARA USAR EN TODA LA APLICACIÓN
// --------------------------------------------------
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
