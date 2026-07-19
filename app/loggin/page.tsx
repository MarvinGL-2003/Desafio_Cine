'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import {
  iniciarSesion as guardarSesion,
} from '@/app/store/slices/usuariosSlice';

import type {
  AppDispatch,
  RootState,
} from '@/app/store/store';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const usuarios = useSelector(
    (state: RootState) => state.usuarios.usuarios
  );

  const [formulario, setFormulario] = useState({
    usuario: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });

    setError('');
  };

  const iniciarSesion = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const usuarioLimpio =
      formulario.usuario.trim().toLowerCase();

    if (
      usuarioLimpio === '' ||
      formulario.password === ''
    ) {
      setError('Complete todos los campos.');
      return;
    }

    setIsLoading(true);

    const usuarioEncontrado = usuarios.find(
      (usuario) =>
        usuario.usuario.toLowerCase() === usuarioLimpio &&
        usuario.password === formulario.password
    );

    if (!usuarioEncontrado) {
      setError('Usuario o contraseña incorrectos.');
      setIsLoading(false);
      return;
    }

    dispatch(guardarSesion(usuarioEncontrado));
    router.push('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-decoracion-uno" />
      <div className="auth-decoracion-dos" />

      <div className="auth-container">
        <div className="auth-panel-izquierdo">
          <div>
            <h1 className="auth-logo">🎬 Cine App</h1>

            <h2 className="auth-titulo-izquierdo">
              Administra tu cine de una manera fácil
            </h2>

            <p className="auth-descripcion">
              Gestiona películas, reservas, asientos y ventas
              desde un solo lugar.
            </p>
          </div>

          <div className="auth-lista">
            <p>🎞️ Gestión de películas</p>
            <p>🎫 Control de reservaciones</p>
            <p>💺 Administración de asientos</p>
            <p>📊 Estadísticas de ventas</p>
          </div>
        </div>

        <div className="auth-panel-formulario">
          <div className="auth-icono-principal">🎥</div>

          <h1 className="auth-titulo">Bienvenido</h1>

          <p className="auth-subtitulo">
            Inicia sesión para entrar al sistema
          </p>

          <form
            onSubmit={iniciarSesion}
            noValidate
            className="auth-form"
          >
            <div className="auth-form-group">
              <label
                htmlFor="usuario"
                className="auth-form-label"
              >
                Usuario
              </label>

              <div className="auth-input-icono">
                <span>👤</span>

                <input
                  id="usuario"
                  type="text"
                  name="usuario"
                  placeholder="Ingrese su usuario"
                  value={formulario.usuario}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label
                htmlFor="password"
                className="auth-form-label"
              >
                Contraseña
              </label>

              <div className="auth-input-icono">
                <span>🔒</span>

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Ingrese su contraseña"
                  value={formulario.password}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>
            </div>

            {error && (
              <div className="auth-error">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="auth-boton"
              disabled={isLoading}
            >
              {isLoading ? '⏳ Cargando...' : '🚀 Iniciar sesión'}
            </button>

            <div className="auth-separador">
              <span className="auth-separador-linea" />
              <span>o</span>
              <span className="auth-separador-linea" />
            </div>

            <p className="auth-texto-registro">
              ¿Todavía no tienes una cuenta?
            </p>

            <Link
              href="/crear_usuario"
              className="auth-boton-secundario"
            >
              Crear una cuenta
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}