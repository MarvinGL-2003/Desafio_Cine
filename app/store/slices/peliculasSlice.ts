import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Pelicula } from '@/app/types';

interface PeliculasState {
  peliculas: Pelicula[];
  filtroNombre: string;
  filtroGenero: string;
  filtroClasificacion: string;
  filtroSala: string;
  filtroEstado: string;
}

// 10 películas de ejemplo con clasificaciones en español
const peliculasEjemplo: Pelicula[] = [
  {
    id: 'P001',
    codigo: 'P001',
    nombre: 'Avengers: Endgame',
    genero: 'Acción',
    duracion: 181,
    clasificacion: 'Adolescentes',
    sala: 'Sala 1',
    precio: 12.50,
    estado: 'Disponible',
  },
  {
    id: 'P002',
    codigo: 'P002',
    nombre: 'El Rey León',
    genero: 'Animación',
    duracion: 118,
    clasificacion: 'Infantil',
    sala: 'Sala 2',
    precio: 10.00,
    estado: 'Disponible',
  },
  {
    id: 'P003',
    codigo: 'P003',
    nombre: 'Interestelar',
    genero: 'Ciencia Ficción',
    duracion: 169,
    clasificacion: 'Adolescentes',
    sala: 'Sala 3',
    precio: 14.00,
    estado: 'Disponible',
  },
  {
    id: 'P004',
    codigo: 'P004',
    nombre: 'Titanic',
    genero: 'Drama',
    duracion: 195,
    clasificacion: 'Adolescentes',
    sala: 'Sala 1',
    precio: 11.00,
    estado: 'Disponible',
  },
  {
    id: 'P005',
    codigo: 'P005',
    nombre: 'El Conjuro',
    genero: 'Terror',
    duracion: 112,
    clasificacion: 'Adultos',
    sala: 'Sala 2',
    precio: 9.50,
    estado: 'Disponible',
  },
  {
    id: 'P006',
    codigo: 'P006',
    nombre: 'Toy Story 4',
    genero: 'Animación',
    duracion: 100,
    clasificacion: 'Infantil',
    sala: 'Sala 3',
    precio: 8.50,
    estado: 'No disponible',
  },
  {
    id: 'P007',
    codigo: 'P007',
    nombre: 'El Padrino',
    genero: 'Drama',
    duracion: 175,
    clasificacion: 'Adultos',
    sala: 'Sala 1',
    precio: 13.00,
    estado: 'Disponible',
  },
  {
    id: 'P008',
    codigo: 'P008',
    nombre: 'Matrix',
    genero: 'Ciencia Ficción',
    duracion: 136,
    clasificacion: 'Adolescentes',
    sala: 'Sala 2',
    precio: 11.50,
    estado: 'Disponible',
  },
  {
    id: 'P009',
    codigo: 'P009',
    nombre: 'Mi Pobre Angelito',
    genero: 'Comedia',
    duracion: 103,
    clasificacion: 'Todos',
    sala: 'Sala 3',
    precio: 8.00,
    estado: 'Disponible',
  },
  {
    id: 'P010',
    codigo: 'P010',
    nombre: 'Dune',
    genero: 'Ciencia Ficción',
    duracion: 155,
    clasificacion: 'Adolescentes',
    sala: 'Sala 1',
    precio: 15.00,
    estado: 'Disponible',
  },
];

const initialState: PeliculasState = {
  peliculas: peliculasEjemplo,
  filtroNombre: '',
  filtroGenero: '',
  filtroClasificacion: '',
  filtroSala: '',
  filtroEstado: '',
};

const peliculasSlice = createSlice({
  name: 'peliculas',
  initialState,
  reducers: {
    agregarPelicula: (state, action: PayloadAction<Pelicula>) => {
      const existe = state.peliculas.some(p => p.codigo === action.payload.codigo);
      if (existe) {
        alert('❌ Ya existe una película con ese código');
        return;
      }
      
      if (action.payload.precio <= 0) {
        alert('❌ El precio debe ser mayor a 0');
        return;
      }
      
      state.peliculas.push(action.payload);
    },

    editarPelicula: (state, action: PayloadAction<Pelicula>) => {
      const index = state.peliculas.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        const existe = state.peliculas.some(
          p => p.codigo === action.payload.codigo && p.id !== action.payload.id
        );
        if (existe) {
          alert('❌ Ya existe una película con ese código');
          return;
        }
        
        if (action.payload.precio <= 0) {
          alert('❌ El precio debe ser mayor a 0');
          return;
        }
        
        state.peliculas[index] = action.payload;
      }
    },

    eliminarPelicula: (state, action: PayloadAction<string>) => {
      state.peliculas = state.peliculas.filter(p => p.id !== action.payload);
    },

    toggleEstadoPelicula: (state, action: PayloadAction<string>) => {
      const pelicula = state.peliculas.find(p => p.id === action.payload);
      if (pelicula) {
        pelicula.estado = pelicula.estado === 'Disponible' ? 'No disponible' : 'Disponible';
      }
    },

    setFiltroNombre: (state, action: PayloadAction<string>) => {
      state.filtroNombre = action.payload;
    },
    setFiltroGenero: (state, action: PayloadAction<string>) => {
      state.filtroGenero = action.payload;
    },
    setFiltroClasificacion: (state, action: PayloadAction<string>) => {
      state.filtroClasificacion = action.payload;
    },
    setFiltroSala: (state, action: PayloadAction<string>) => {
      state.filtroSala = action.payload;
    },
    setFiltroEstado: (state, action: PayloadAction<string>) => {
      state.filtroEstado = action.payload;
    },
  },
});

export const {
  agregarPelicula,
  editarPelicula,
  eliminarPelicula,
  toggleEstadoPelicula,
  setFiltroNombre,
  setFiltroGenero,
  setFiltroClasificacion,
  setFiltroSala,
  setFiltroEstado,
} = peliculasSlice.actions;

export default peliculasSlice.reducer;