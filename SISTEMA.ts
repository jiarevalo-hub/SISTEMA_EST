const promptSync = require("prompt-sync")(); // Importa la libreria de prompt-sync(sirve para leer datos)

//INTERFACE

// Define la estructura que debe tener un estudiante
interface IEstudiante {
  id: number;        // Identificador único
  nombre: string;    // Nombre del estudiante
  edad: number;      // Edad
  carrera: string;   // Carrera que estudia
  activo: boolean;   // Estado (activo / inactivo)
  promedio: number;  // Promedio de notas
}

// Interface genérica para devolver resultados de operaciones
interface IResultado<T> {
  ok: boolean;       // Indica si la operación fue exitosa
  mensaje: string;   // Mensaje informativo
  data?: T;          // Datos opcionales (si todo sale bien)
}

//CLASE ESTUDIANTE

// Clase Estudiante que implementa la interfaz IEstudiante
class Estudiante implements IEstudiante {

  // Propiedades del estudiante
  id: number;
  nombre: string;
  edad: number;
  carrera: string;
  activo: boolean;
  promedio: number;

  // Constructor: se ejecuta cuando se crea un nuevo estudiante
  constructor(
    id: number,
    nombre: string,
    edad: number,
    carrera: string,
    promedio: number,
    activo: boolean = true // Por defecto el estudiante está activo
  ) {
    // Asigna los valores recibidos a las propiedades del objeto
    this.id = id;
    this.nombre = nombre;
    this.edad = edad;
    this.carrera = carrera;
    this.promedio = promedio;
    this.activo = activo;
  }
}

//CLASE SISTEMA

// Clase que maneja todo el sistema de estudiantes
class SistemaEstudiantes {

  // Arreglo privado de estudiantes (solo accesible dentro de la clase)
  private estudiantes: Estudiante[] = [];

  //MÉTODO AGREGAR
  agregar(student: Estudiante): IResultado<Estudiante> {

    // Verifica que el ID no se repita
    for (let lista of this.estudiantes) {
      if (lista.id === student.id) {
        return { ok: false, mensaje: "El ID ya existe" };
      }
    }

    // Valida la edad
    if (student.edad < 15 || student.edad > 80) {
      return { ok: false, mensaje: "La Edad no es válida" };
    }

    // Valida el promedio
    if (student.promedio < 0 || student.promedio > 10) {
      return { ok: false, mensaje: "EL Promedio no es válido" };
    }

    // Agrega el estudiante al arreglo
    this.estudiantes.push(student);

    return { ok: true, mensaje: "Estudiante agregado", data: student };
  }

  //MÉTODO LISTAR
  listar(): Estudiante[] {
    // Devuelve todos los estudiantes
    return this.estudiantes;
  }

  //MÉTODO BUSCAR POR ID
  buscarPorId(id: number): IResultado<Estudiante> {

    // Recorre la lista buscando el ID
    for (let busqueda of this.estudiantes) {
      if (busqueda.id === id) {
        return { ok: true, mensaje: "Estudiante encontrado", data: busqueda };
      }
    }

    // Si no lo encuentra
    return { ok: false, mensaje: "Estudiante no encontrado" };
  }

  //MÉTODO ACTUALIZAR PROMEDIO
  actualizarPromedio(id: number, nuevoPromedio: number): IResultado<Estudiante> {

    // Valida el nuevo promedio
    if (nuevoPromedio < 0 || nuevoPromedio > 10) {
      return { ok: false, mensaje: "Promedio inválido" };
    }

    // Busca el estudiante y actualiza
    for (let e of this.estudiantes) {
      if (e.id === id) {
        e.promedio = nuevoPromedio;
        return { ok: true, mensaje: "Promedio actualizado", data: e };
      }
    }

    return { ok: false, mensaje: "Estudiante no encontrado" };
  }

  //MÉTODO CAMBIAR ESTADO
  cambiarEstado(id: number, activo: boolean): IResultado<Estudiante> {

    // Busca el estudiante y cambia su estado
    for (let e of this.estudiantes) {
      if (e.id === id) {
        e.activo = activo;
        return { ok: true, mensaje: "Estado actualizado", data: e };
      }
    }

    return { ok: false, mensaje: "Estudiante no encontrado" };
  }

  //MÉTODO LISTAR ACTIVOS
  listarActivos(): Estudiante[] {
    // Devuelve solo los estudiantes activos
    return this.estudiantes.filter(e => e.activo);
  }
}

//MENÚ

// Función que muestra las opciones del menú
function mostrarMenu(): void {
  console.log("SISTEMA DE ESTUDIANTES");
  console.log("1.- Agregar estudiante");
  console.log("2.- Listar estudiantes");
  console.log("3.- Buscar por ID");
  console.log("4.- Actualizar promedio");
  console.log("5.- Cambiar estado");
  console.log("6.- Lista de estudiantes activos");
}

//MENÚ INTERACTIVO

// Función principal que controla el sistema
function menuInteractivo(): void {

  // Crea una instancia del sistema
  const sistema = new SistemaEstudiantes();

  // Variable para almacenar la opción del menú
  let opcion: number;

  // Ciclo do...while: el menú se ejecuta al menos una vez
  do {

    mostrarMenu();

    // Lee la opción ingresada
    opcion = Number(promptSync("Seleccione una opción: "));

    // Ejecuta la opción seleccionada
    switch (opcion) {

      case 1:
        // Agregar estudiante
        const id = Number(promptSync("ID: "));
        const nombre = String(promptSync("Nombre: "));
        const edad = Number(promptSync("Edad: "));
        const carrera = String(promptSync("Carrera: "));
        const promedio = Number(promptSync("Promedio: "));
        console.log(
          sistema.agregar(
            new Estudiante(id, nombre, edad, carrera, promedio)
          )
        );
        break;

      case 2:
        // Listar estudiantes
        console.log("LISTADO DE ESTUDIANTES");
        console.log(sistema.listar());
        break;

      case 3:
        // Buscar por ID
        const idBuscar = Number(promptSync("ID a buscar: "));
        console.log(sistema.buscarPorId(idBuscar));
        break;

      case 4:
        // Actualizar promedio
        const idAct = Number(promptSync("ID: "));
        const nuevoProm = Number(promptSync("Nuevo promedio: "));
        console.log(sistema.actualizarPromedio(idAct, nuevoProm));
        break;

      case 5:
        // Cambiar estado
        const idEstado = Number(promptSync("ID: "));
        const estado = promptSync("CAMBIAR ESTADO (S/N): ") === "S";
        console.log(sistema.cambiarEstado(idEstado, estado));
        break;

      case 6:
        // Listar estudiantes activos
        console.log("ESTUDIANTES ACTIVOS");
        console.log(sistema.listarActivos());
        break;

      default:
        // Opción inválida
        console.log("NUMERO INCORRECTO");
    }

  } while (opcion < 6); // El menú se repite mientras la opción sea menor a 6
}

// Inicia el programa
menuInteractivo();
