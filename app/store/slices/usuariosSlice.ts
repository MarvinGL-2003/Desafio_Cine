import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Usuario } from "@/app/types";

interface UsuariosState {
  usuarios: Usuario[];
  usuarioActual: Usuario | null;
}

<<<<<<< HEAD
const initialState: UsuariosState = {
  usuarios: [],
=======
// Usuario administrador predefinido
const usuarioAdmin: Usuario = {
  id: "admin-001",
  nombre: "Administrador",
  correo: "admin@cineapp.com",
  usuario: "admin",
  password: "123456",
};

const initialState: UsuariosState = {
  usuarios: [usuarioAdmin],  // 👈 Usuario admin predefinido
>>>>>>> 42eaf552ff54b0b7b5a42d8265e0aa8a799c890e
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