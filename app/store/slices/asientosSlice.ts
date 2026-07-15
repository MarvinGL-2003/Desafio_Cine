import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Asiento } from '@/app/types';

const generarAsientosEjemplo = (): Asiento[] => {
  const asientos: Asiento[] = [];
  const salas = ['Sala 1', 'Sala 2', 'Sala 3'];
  const filas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const asientosPorFila = 8;

  salas.forEach(sala => {
    filas.forEach(fila => {
      for (let i = 1; i <= asientosPorFila; i++) {
        asientos.push({
          id: `${sala}-${fila}${i}`,
          fila,
          numero: i,
          sala,
          estado: 'Disponible',
        });
      }
    });
  });

  return asientos;
};

interface AsientosState {
  asientos: Asiento[];
}

const initialState: AsientosState = {
  asientos: generarAsientosEjemplo(),
};

const asientosSlice = createSlice({
  name: 'asientos',
  initialState,
  reducers: {
    reservarAsientos: (state, action: PayloadAction<string[]>) => {
      state.asientos = state.asientos.map(asiento =>
        action.payload.includes(asiento.id) && asiento.estado === 'Disponible'
          ? { ...asiento, estado: 'Reservado' }
          : asiento
      );
    },

    liberarAsientos: (state, action: PayloadAction<string[]>) => {
      state.asientos = state.asientos.map(asiento =>
        action.payload.includes(asiento.id)
          ? { ...asiento, estado: 'Disponible' }
          : asiento
      );
    },
  },
});

export const { reservarAsientos, liberarAsientos } = asientosSlice.actions;
export default asientosSlice.reducer;