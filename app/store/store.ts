import { configureStore } from '@reduxjs/toolkit';
import peliculasReducer from './slices/peliculasSlice';
import asientosReducer from './slices/asientosSlice';
import reservasReducer from './slices/reservasSlice';
import usuariosReducer from './slices/usuariosSlice';
<<<<<<< HEAD
=======
import funcionesReducer from './slices/funcionesSlice';

// --------------------------------------------------
// FUNCIONES PARA PERSISTENCIA CON LOCALSTORAGE
// --------------------------------------------------

const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('cineState', serializedState);
  } catch (e) {
    // Ignorar errores
  }
};

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('cineState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
};

const preloadedState = loadState();
>>>>>>> 42eaf552ff54b0b7b5a42d8265e0aa8a799c890e

// --------------------------------------------------
// CONFIGURAR EL STORE
// --------------------------------------------------
export const store = configureStore({
  reducer: {
    peliculas: peliculasReducer,
    asientos: asientosReducer,
    reservas: reservasReducer,
    usuarios: usuariosReducer,
<<<<<<< HEAD
=======
    funciones: funcionesReducer,
>>>>>>> 42eaf552ff54b0b7b5a42d8265e0aa8a799c890e
  },
});

// --------------------------------------------------
// GUARDAR AUTOMÁTICAMENTE
// --------------------------------------------------
store.subscribe(() => {
  saveState(store.getState());
});

// --------------------------------------------------
// TIPOS
// --------------------------------------------------
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;