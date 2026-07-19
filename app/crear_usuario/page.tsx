'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import { agregarUsuario } from '@/app/store/slices/usuariosSlice';
import type { AppDispatch, RootState } from '@/app/store/store';

export default function CrearUsuarioPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const usuarios = useSelector(
    (state: RootState) => state.usuarios.usuarios
  );

  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    usuario: '',
    password: '',
    confirmar: '',
  });

  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormulario((formularioAnterior) => ({
      ...formularioAnterior,
      [name]: value,
    }));

    setError('');
    setMensaje('');
  };

  const crearUsuario = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    const nombre = formulario.nombre.trim();
    const correo = formulario.correo.trim().toLowerCase();
    const usuario = formulario.usuario.trim();

    if (
      nombre === '' ||
      correo === '' ||
      usuario === '' ||
      formulario.password === '' ||
      formulario.confirmar === ''
    ) {
      setError('Complete todos los campos.');
      return;
    }

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correoValido.test(correo)) {
      setError('Ingrese un correo electrónico válido.');
      return;
    }

    if (formulario.password.length < 5) {
      setError(
        'La contraseña debe tener al menos 5 caracteres.'
      );
      return;
    }

    if (formulario.password !== formulario.confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const usuarioDuplicado = usuarios.some(
      (usuarioGuardado) =>
        usuarioGuardado.usuario.toLowerCase() ===
        usuario.toLowerCase()
    );

    if (usuarioDuplicado) {
      setError(
        'Ese nombre de usuario ya está registrado.'
      );
      return;
    }

    const correoDuplicado = usuarios.some(
      (usuarioGuardado) =>
        usuarioGuardado.correo.toLowerCase() === correo
    );

    if (correoDuplicado) {
      setError(
        'Ese correo electrónico ya está registrado.'
      );
      return;
    }

    setIsLoading(true);
    setError('');

    dispatch(
      agregarUsuario({
        id: crypto.randomUUID(),
        nombre,
        correo,
        usuario,
        password: formulario.password,
      })
    );

    setMensaje('Usuario creado correctamente.');

    setFormulario({
      nombre: '',
      correo: '',
      usuario: '',
      password: '',
      confirmar: '',
    });

    setTimeout(() => {
      router.push('/loggin');
    }, 800);
  };

  return (
    <div className="crear-usuario-page">
      <div className="crear-usuario-decoracion-uno" />
      <div className="crear-usuario-decoracion-dos" />

      <div className="crear-usuario-tarjeta">
        <div className="crear-usuario-encabezado">
          <div className="crear-usuario-icono">🎬</div>

          <h1 className="crear-usuario-titulo">
            Crear usuario
          </h1>

          <p className="crear-usuario-subtitulo">
            Regístrate para comenzar a utilizar Cine App
          </p>
        </div>

        <form
          onSubmit={crearUsuario}
          noValidate
          className="crear-usuario-form"
        >
          <div className="crear-usuario-row">
            <div className="crear-usuario-group">
              <label
                htmlFor="nombre"
                className="crear-usuario-label"
              >
                Nombre completo
              </label>

              <div className="crear-usuario-input-icono">
                <span>👤</span>

                <input
                  id="nombre"
                  type="text"
                  name="nombre"
                  placeholder="Ingrese su nombre"
                  value={formulario.nombre}
                  onChange={handleChange}
                  className="crear-usuario-input"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="crear-usuario-group">
              <label
                htmlFor="correo"
                className="crear-usuario-label"
              >
                Correo electrónico
              </label>

              <div className="crear-usuario-input-icono">
                <span>✉️</span>

                <input
                  id="correo"
                  type="email"
                  name="correo"
                  placeholder="ejemplo@correo.com"
                  value={formulario.correo}
                  onChange={handleChange}
                  className="crear-usuario-input"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="crear-usuario-group">
            <label
              htmlFor="usuario"
              className="crear-usuario-label"
            >
              Usuario
            </label>

            <div className="crear-usuario-input-icono">
              <span>🎟️</span>

              <input
                id="usuario"
                type="text"
                name="usuario"
                placeholder="Elija un nombre de usuario"
                value={formulario.usuario}
                onChange={handleChange}
                className="crear-usuario-input"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="crear-usuario-row">
            <div className="crear-usuario-group">
              <label
                htmlFor="password"
                className="crear-usuario-label"
              >
                Contraseña
              </label>

              <div className="crear-usuario-input-icono">
                <span>🔒</span>

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Ingrese una contraseña"
                  value={formulario.password}
                  onChange={handleChange}
                  className="crear-usuario-input"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="crear-usuario-group">
              <label
                htmlFor="confirmar"
                className="crear-usuario-label"
              >
                Confirmar contraseña
              </label>

              <div className="crear-usuario-input-icono">
                <span>🔐</span>

                <input
                  id="confirmar"
                  type="password"
                  name="confirmar"
                  placeholder="Repita la contraseña"
                  value={formulario.confirmar}
                  onChange={handleChange}
                  className="crear-usuario-input"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="crear-usuario-error">
              ⚠️ {error}
            </div>
          )}

          {mensaje && (
            <div className="crear-usuario-exito">
              ✅ {mensaje}
            </div>
          )}

          <button
            type="submit"
            className="crear-usuario-boton"
            disabled={isLoading}
          >
            {isLoading
              ? '⏳ Creando usuario...'
              : '🚀 Crear usuario'}
          </button>

          <p className="crear-usuario-texto-cuenta">
            ¿Ya tienes una cuenta?
          </p>

          <Link
            href="/loggin"
            className="crear-usuario-volver"
          >
            ← Volver al inicio de sesión
          </Link>
        </form>
      </div>
    </div>
  );
}