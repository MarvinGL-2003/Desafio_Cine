// ============================================
// TIPOS DE DATOS PARA EL SISTEMA DE CINE
// ============================================

// --------------------------------------------------
// 1. PELÍCULA
// --------------------------------------------------
export interface Pelicula {
  id: string;
  codigo: string;
  nombre: string;
  genero: string;
  duracion: number;
  clasificacion: string;
  sala: string;
  precio: number;
  estado: 'Disponible' | 'No disponible';
}

// --------------------------------------------------
// 2. ASIENTO
// --------------------------------------------------
export interface Asiento {
  id: string;
  fila: string;
  numero: number;
  sala: string;
  estado: 'Disponible' | 'Reservado';
}

// --------------------------------------------------
// 3. RESERVA
// --------------------------------------------------
export interface Reserva {
  id: string;
  peliculaId: string;
  funcionId?: string;
  sala: string;
  asientosIds: string[];
  total: number;
  fecha: string;
  cantidadBoletos?: number;
  usuarioId: string;          
  usuarioNombre: string;      
  destinatario: string;       
}

// --------------------------------------------------
// 4. FUNCIÓN
// --------------------------------------------------
export interface Funcion {
  id: string;
  peliculaId: string;
  sala: string;
  horario: string;
  fecha: string;
}

// --------------------------------------------------
// 5. USUARIO
// --------------------------------------------------
export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  usuario: string;
  password: string;
}