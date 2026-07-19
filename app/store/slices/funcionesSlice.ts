import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Funcion } from '@/app/types';

// ============================================================
// FUNCIONES CON FORMATO 12 HORAS (Agosto - Septiembre 2026)
// ============================================================
const funcionesEjemplo: Funcion[] = [
  // ==================== SALA 1 ====================
  // Avengers: Endgame (P001)
  { id: 'F1', peliculaId: 'P001', sala: 'Sala 1', horario: '2:30 PM', fecha: '2026-08-10' },
  { id: 'F2', peliculaId: 'P001', sala: 'Sala 2', horario: '6:00 PM', fecha: '2026-08-10' },

  // Titanic (P004)
  { id: 'F7', peliculaId: 'P004', sala: 'Sala 3', horario: '2:00 PM', fecha: '2026-08-11' },
  { id: 'F8', peliculaId: 'P004', sala: 'Sala 1', horario: '7:00 PM', fecha: '2026-08-11' },
  
  
  // El Padrino (P007)
  { id: 'F12', peliculaId: 'P007', sala: 'Sala 2', horario: '5:00 PM', fecha: '2026-08-12' },
  { id: 'F13', peliculaId: 'P007', sala: 'Sala 3', horario: '9:00 PM', fecha: '2026-08-12' },

  
  // Dune (P010)
  { id: 'F16', peliculaId: 'P010', sala: 'Sala 1', horario: '4:00 PM', fecha: '2026-08-13' },
  { id: 'F17', peliculaId: 'P010', sala: 'Sala 1', horario: '7:30 PM', fecha: '2026-08-13' },

  // ==================== SALA 2 ====================
  // El Rey León (P002)
  { id: 'F21', peliculaId: 'P002', sala: 'Sala 2', horario: '11:00 AM', fecha: '2026-08-10' },
  { id: 'F22', peliculaId: 'P002', sala: 'Sala 2', horario: '3:00 PM', fecha: '2026-08-10' },

  
  // El Conjuro (P005)
  { id: 'F27', peliculaId: 'P005', sala: 'Sala 3', horario: '7:00 PM', fecha: '2026-08-11' },
  { id: 'F28', peliculaId: 'P005', sala: 'Sala 3', horario: '9:30 PM', fecha: '2026-08-11' },

  // Matrix (P008)
  { id: 'F32', peliculaId: 'P008', sala: 'Sala 1', horario: '2:00 PM', fecha: '2026-08-12' },
  { id: 'F33', peliculaId: 'P008', sala: 'Sala 2', horario: '6:00 PM', fecha: '2026-08-12' },


  // ==================== SALA 3 ====================
  // Interestelar (P003)
  { id: 'F37', peliculaId: 'P003', sala: 'Sala 3', horario: '1:00 PM', fecha: '2026-08-10' },
  { id: 'F38', peliculaId: 'P003', sala: 'Sala 1', horario: '5:00 PM', fecha: '2026-08-10' },

  
  // Mi Pobre Angelito (P009)
  { id: 'F43', peliculaId: 'P009', sala: 'Sala 2', horario: '10:00 AM', fecha: '2026-08-11' },
  { id: 'F44', peliculaId: 'P009', sala: 'Sala 3', horario: '2:00 PM', fecha: '2026-08-11' },

  // Toy Story 4 (P006) - Película No disponible
  { id: 'F48', peliculaId: 'P006', sala: 'Sala 3', horario: '12:00 PM', fecha: '2026-08-15' },
  { id: 'F49', peliculaId: 'P006', sala: 'Sala 2', horario: '4:00 PM', fecha: '2026-08-22' },
];

interface FuncionesState {
  funciones: Funcion[];
}

const initialState: FuncionesState = {
  funciones: funcionesEjemplo,
};

const funcionesSlice = createSlice({
  name: 'funciones',
  initialState,
  reducers: {
    agregarFuncion: (state, action: PayloadAction<Funcion>) => {
      const existe = state.funciones.some(
        f => f.sala === action.payload.sala && 
             f.horario === action.payload.horario &&
             f.fecha === action.payload.fecha
      );
      
      if (existe) {
        alert('❌ Ya existe una función en esa sala con ese horario y fecha');
        return;
      }
      
      state.funciones.push(action.payload);
    },

    eliminarFuncion: (state, action: PayloadAction<string>) => {
      state.funciones = state.funciones.filter(f => f.id !== action.payload);
    },

    editarFuncion: (state, action: PayloadAction<Funcion>) => {
      const index = state.funciones.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        const existe = state.funciones.some(
          f => f.sala === action.payload.sala && 
               f.horario === action.payload.horario &&
               f.fecha === action.payload.fecha &&
               f.id !== action.payload.id
        );
        
        if (existe) {
          alert('❌ Ya existe una función en esa sala con ese horario y fecha');
          return;
        }
        
        state.funciones[index] = action.payload;
      }
    },
  },
});

export const { agregarFuncion, eliminarFuncion, editarFuncion } = funcionesSlice.actions;
export default funcionesSlice.reducer;