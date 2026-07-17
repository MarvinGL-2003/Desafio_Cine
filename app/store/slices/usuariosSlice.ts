import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Usuario } from "@/app/types";

interface UsuariosState {
  usuarios: Usuario[];
  usuarioActual: Usuario | null;
}

const initialState: UsuariosState = {
  usuarios: [],
  usuarioActual: null,
};

const usuariosSlice = createSlice({
  name: "usuarios",
  initialState,
  reducers: {
    agregarUsuario: (state, action: PayloadAction<Usuario>) => {
      state.usuarios.push(action.payload);
    },

    iniciarSesion: (state, action: PayloadAction<Usuario>) => {
      state.usuarioActual = action.payload;
    },

    cerrarSesion: (state) => {
      state.usuarioActual = null;
    },

    eliminarUsuario: (state, action: PayloadAction<string>) => {
      state.usuarios = state.usuarios.filter(
        (usuario) => usuario.id !== action.payload
      );
    },
  },
});

export const {
  agregarUsuario,
  iniciarSesion,
  cerrarSesion,
  eliminarUsuario,
} = usuariosSlice.actions;

export default usuariosSlice.reducer;