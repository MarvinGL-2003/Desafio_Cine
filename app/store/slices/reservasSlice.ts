import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reserva } from '@/app/types';

interface ReservasState {
  reservas: Reserva[];
  ultimaReserva: Reserva | null;
}

const initialState: ReservasState = {
  reservas: [],
  ultimaReserva: null,
};

const reservasSlice = createSlice({
  name: 'reservas',
  initialState,
  reducers: {
    agregarReserva: (state, action: PayloadAction<Reserva>) => {
      state.reservas.push(action.payload);
      state.ultimaReserva = action.payload;
    },

    cancelarReserva: (state, action: PayloadAction<string>) => {
      state.reservas = state.reservas.filter(r => r.id !== action.payload);
      if (state.ultimaReserva?.id === action.payload) {
        state.ultimaReserva = null;
      }
    },

    limpiarUltimaReserva: (state) => {
      state.ultimaReserva = null;
    },
  },
});

export const { agregarReserva, cancelarReserva, limpiarUltimaReserva } = reservasSlice.actions;
export default reservasSlice.reducer;