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

    const usuarioEncontrado = usuarios.find(
      (usuario) =>
        usuario.usuario.toLowerCase() === usuarioLimpio &&
        usuario.password === formulario.password
    );

    if (!usuarioEncontrado) {
      setError('Usuario o contraseña incorrectos.');
      return;
    }

    dispatch(guardarSesion(usuarioEncontrado));
    router.push('/dashboard');
  };

  return (
    <div style={styles.pagina}>
      <div style={styles.decoracionUno} />
      <div style={styles.decoracionDos} />

      <div style={styles.contenedor}>
        <div style={styles.panelIzquierdo}>
          <div>
            <h1 style={styles.logo}>🎬 Cine App</h1>

            <h2 style={styles.tituloIzquierdo}>
              Administra tu cine de una manera fácil
            </h2>

            <p style={styles.descripcion}>
              Gestiona películas, reservas, asientos y ventas
              desde un solo lugar.
            </p>
          </div>

          <div style={styles.lista}>
            <p>🎞️ Gestión de películas</p>
            <p>🎫 Control de reservaciones</p>
            <p>💺 Administración de asientos</p>
            <p>📊 Estadísticas de ventas</p>
          </div>
        </div>

        <div style={styles.panelFormulario}>
          <div style={styles.iconoPrincipal}>🎥</div>

          <h1 style={styles.titulo}>
            Bienvenido
          </h1>

          <p style={styles.subtitulo}>
            Inicia sesión para entrar al sistema
          </p>

          <form
            onSubmit={iniciarSesion}
            noValidate
            style={styles.formulario}
          >
            <div style={styles.grupo}>
              <label
                htmlFor="usuario"
                style={styles.label}
              >
                Usuario
              </label>

              <div style={styles.inputContenedor}>
                <span style={styles.inputIcono}>👤</span>

                <input
                  id="usuario"
                  type="text"
                  name="usuario"
                  placeholder="Ingrese su usuario"
                  value={formulario.usuario}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>

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
                  placeholder="Ingrese su contraseña"
                  value={formulario.password}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>

            {error && (
              <div style={styles.error}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              style={styles.boton}
            >
              Iniciar sesión
            </button>

            <div style={styles.separador}>
              <span style={styles.linea} />
              <span>o</span>
              <span style={styles.linea} />
            </div>

            <p style={styles.textoRegistro}>
              ¿Todavía no tienes una cuenta?
            </p>

            <Link
              href="/crear_usuario"
              style={styles.botonSecundario}
            >
              Crear una cuenta
            </Link>
          </form>
        </div>
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
    padding: '30px 20px',
    position: 'relative',
    overflow: 'hidden',
    background:
      'linear-gradient(135deg, #111827 0%, #1e3a8a 55%, #7c3aed 100%)',
  },

  decoracionUno: {
    position: 'absolute',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    top: '-120px',
    left: '-100px',
  },

  decoracionDos: {
    position: 'absolute',
    width: '450px',
    height: '450px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)',
    right: '-180px',
    bottom: '-200px',
  },

  contenedor: {
    width: '100%',
    maxWidth: '950px',
    minHeight: '600px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
    position: 'relative',
    zIndex: 1,
  },

  panelIzquierdo: {
    padding: '55px 45px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: '#ffffff',
    background:
      'linear-gradient(145deg, #172554, #1d4ed8)',
  },

  logo: {
    margin: 0,
    fontSize: '30px',
    fontWeight: 800,
  },

  tituloIzquierdo: {
    fontSize: '35px',
    lineHeight: 1.2,
    marginTop: '50px',
    marginBottom: '20px',
  },

  descripcion: {
    fontSize: '16px',
    lineHeight: 1.7,
    color: '#dbeafe',
  },

  lista: {
    lineHeight: 2,
    color: '#e0e7ff',
    fontSize: '15px',
  },

  panelFormulario: {
    padding: '45px 50px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  iconoPrincipal: {
    width: '65px',
    height: '65px',
    margin: '0 auto 18px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '18px',
    fontSize: '32px',
    backgroundColor: '#eff6ff',
  },

  titulo: {
    margin: 0,
    color: '#111827',
    textAlign: 'center',
    fontSize: '32px',
  },

  subtitulo: {
    marginTop: '10px',
    marginBottom: '30px',
    textAlign: 'center',
    color: '#6b7280',
  },

  formulario: {
    width: '100%',
  },

  grupo: {
    marginBottom: '20px',
  },

  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#374151',
    fontWeight: 600,
    fontSize: '14px',
  },

  inputContenedor: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #d1d5db',
    borderRadius: '10px',
    overflow: 'hidden',
    backgroundColor: '#f9fafb',
  },

  inputIcono: {
    paddingLeft: '14px',
    fontSize: '17px',
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
    marginBottom: '18px',
    padding: '11px',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#b91c1c',
    backgroundColor: '#fee2e2',
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

  separador: {
    margin: '24px 0 17px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#9ca3af',
    fontSize: '13px',
  },

  linea: {
    height: '1px',
    flex: 1,
    backgroundColor: '#e5e7eb',
  },

  textoRegistro: {
    marginBottom: '12px',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '14px',
  },

  botonSecundario: {
    display: 'block',
    width: '100%',
    padding: '12px',
    border: '1px solid #2563eb',
    borderRadius: '10px',
    color: '#2563eb',
    textAlign: 'center',
    textDecoration: 'none',
    fontWeight: 700,
  },
};