'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import { agregarUsuario } from '@/app/store/slices/usuariosSlice';

import type {
  AppDispatch,
  RootState,
} from '@/app/store/store';

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });

    setError('');
    setMensaje('');
  };

  const crearUsuario = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

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

    const correoValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    if (
      formulario.password !== formulario.confirmar
    ) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const usuarioDuplicado = usuarios.some(
      (usuarioGuardado) =>
        usuarioGuardado.usuario.toLowerCase() ===
        usuario.toLowerCase()
    );

    if (usuarioDuplicado) {
      setError('Ese nombre de usuario ya está registrado.');
      return;
    }

    const correoDuplicado = usuarios.some(
      (usuarioGuardado) =>
        usuarioGuardado.correo.toLowerCase() === correo
    );

    if (correoDuplicado) {
      setError('Ese correo electrónico ya está registrado.');
      return;
    }

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

    setTimeout(() => {
      router.push('/loggin');
    }, 800);
  };

  return (
    <div style={styles.pagina}>
      <div style={styles.decoracionUno} />
      <div style={styles.decoracionDos} />

      <div style={styles.tarjeta}>
        <div style={styles.encabezado}>
          <div style={styles.icono}>🎬</div>

          <h1 style={styles.titulo}>
            Crear usuario
          </h1>

          <p style={styles.subtitulo}>
            Regístrate para comenzar a utilizar Cine App
          </p>
        </div>

        <form
          onSubmit={crearUsuario}
          noValidate
          style={styles.formulario}
        >
          <div style={styles.fila}>
            <div style={styles.grupo}>
              <label
                htmlFor="nombre"
                style={styles.label}
              >
                Nombre completo
              </label>

              <div style={styles.inputContenedor}>
                <span style={styles.inputIcono}>👤</span>

                <input
                  id="nombre"
                  type="text"
                  name="nombre"
                  placeholder="Ingrese su nombre"
                  value={formulario.nombre}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.grupo}>
              <label
                htmlFor="correo"
                style={styles.label}
              >
                Correo electrónico
              </label>

              <div style={styles.inputContenedor}>
                <span style={styles.inputIcono}>✉️</span>

                <input
                  id="correo"
                  type="email"
                  name="correo"
                  placeholder="ejemplo@correo.com"
                  value={formulario.correo}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          <div style={styles.grupo}>
            <label
              htmlFor="usuario"
              style={styles.label}
            >
              Usuario
            </label>

            <div style={styles.inputContenedor}>
              <span style={styles.inputIcono}>🎟️</span>

              <input
                id="usuario"
                type="text"
                name="usuario"
                placeholder="Elija un nombre de usuario"
                value={formulario.usuario}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.fila}>
            <div style={styles.grupo}>
              <label
                htmlFor="password"
                style={styles.label}
              >
                Contraseña
              </label>

              <div style={styles.inputContenedor}>
                <span style={styles.inputIcono}>🔒</span>

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Ingrese una contraseña"
                  value={formulario.password}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.grupo}>
              <label
                htmlFor="confirmar"
                style={styles.label}
              >
                Confirmar contraseña
              </label>

              <div style={styles.inputContenedor}>
                <span style={styles.inputIcono}>🔐</span>

                <input
                  id="confirmar"
                  type="password"
                  name="confirmar"
                  placeholder="Repita la contraseña"
                  value={formulario.confirmar}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {error && (
            <div style={styles.error}>
              ⚠️ {error}
            </div>
          )}

          {mensaje && (
            <div style={styles.exito}>
              ✅ {mensaje}
            </div>
          )}

          <button
            type="submit"
            style={styles.boton}
          >
            Crear usuario
          </button>

          <p style={styles.textoCuenta}>
            ¿Ya tienes una cuenta?
          </p>

          <Link
            href="/loggin"
            style={styles.volver}
          >
            ← Volver al inicio de sesión
          </Link>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pagina: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '35px 20px',
    position: 'relative',
    overflow: 'hidden',
    background:
      'linear-gradient(135deg, #111827 0%, #1e3a8a 55%, #7c3aed 100%)',
  },

  decoracionUno: {
    position: 'absolute',
    width: '360px',
    height: '360px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.07)',
    top: '-130px',
    right: '-100px',
  },

  decoracionDos: {
    position: 'absolute',
    width: '420px',
    height: '420px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
    bottom: '-190px',
    left: '-130px',
  },

  tarjeta: {
    width: '100%',
    maxWidth: '800px',
    padding: '45px 50px',
    borderRadius: '24px',
    backgroundColor: '#ffffff',
    boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
    position: 'relative',
    zIndex: 1,
  },

  encabezado: {
    textAlign: 'center',
    marginBottom: '32px',
  },

  icono: {
    width: '65px',
    height: '65px',
    margin: '0 auto 15px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '18px',
    backgroundColor: '#eff6ff',
    fontSize: '32px',
  },

  titulo: {
    margin: 0,
    color: '#111827',
    fontSize: '32px',
  },

  subtitulo: {
    marginTop: '9px',
    color: '#6b7280',
  },

  formulario: {
    width: '100%',
  },

  fila: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '18px',
  },

  grupo: {
    marginBottom: '19px',
  },

  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#374151',
    fontSize: '14px',
    fontWeight: 600,
  },

  inputContenedor: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #d1d5db',
    borderRadius: '10px',
    backgroundColor: '#f9fafb',
    overflow: 'hidden',
  },

  inputIcono: {
    paddingLeft: '13px',
  },

  input: {
    width: '100%',
    padding: '13px',
    border: 'none',
    outline: 'none',
    color: '#111827',
    backgroundColor: 'transparent',
    fontSize: '15px',
  },

  error: {
    marginBottom: '17px',
    padding: '11px',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#b91c1c',
    backgroundColor: '#fee2e2',
    fontSize: '14px',
  },

  exito: {
    marginBottom: '17px',
    padding: '11px',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#166534',
    backgroundColor: '#dcfce7',
    fontSize: '14px',
  },

  boton: {
    width: '100%',
    padding: '14px',
    border: 'none',
    borderRadius: '10px',
    color: '#ffffff',
    background:
      'linear-gradient(90deg, #2563eb, #7c3aed)',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
  },

  textoCuenta: {
    marginTop: '22px',
    marginBottom: '8px',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '14px',
  },

  volver: {
    display: 'block',
    textAlign: 'center',
    color: '#2563eb',
    fontWeight: 700,
    textDecoration: 'none',
  },
};