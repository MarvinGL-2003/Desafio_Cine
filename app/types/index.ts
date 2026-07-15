// ============================================
// TIPOS DE DATOS PARA EL SISTEMA DE CINE
// ============================================

// --------------------------------------------------
// 1. PELÍCULA
// --------------------------------------------------
export interface Pelicula {
  id: string;              // Identificador único (usaremos el código)
  codigo: string;          // Código de la película (ej: "P001")
  nombre: string;          // Nombre de la película
  genero: string;          // Género (Acción, Comedia, Drama, etc.)
  duracion: number;        // Duración en minutos
  clasificacion: string;   // Clasificación (PG, PG-13, R, etc.)
  sala: string;            // Sala donde se proyecta (ej: "Sala 1")
  precio: number;          // Precio de la entrada
  estado: 'Disponible' | 'No disponible';  // Estado de la película
}

// --------------------------------------------------
// 2. ASIENTO
// --------------------------------------------------
export interface Asiento {
  id: string;              // Identificador único (ej: "Sala 1-A1")
  fila: string;            // Fila (A, B, C, D, E, F)
  numero: number;          // Número del asiento (1, 2, 3, ...)
  sala: string;            // Sala a la que pertenece
  estado: 'Disponible' | 'Reservado';  // Estado del asiento
}

// --------------------------------------------------
// 3. RESERVA
// --------------------------------------------------
export interface Reserva {
  id: string;              // Identificador único de la reserva
  peliculaId: string;      // ID de la película reservada
  sala: string;            // Sala de la función
  asientosIds: string[];   // Lista de IDs de asientos reservados
  total: number;           // Total a pagar
  fecha: string;           // Fecha de la reserva (ISO string)
  cantidadBoletos?: number; // Cantidad de boletos (opcional)
}