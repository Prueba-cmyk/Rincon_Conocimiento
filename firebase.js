// ---------------------------------------------
// IMPORTS DE FIREBASE
// ---------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getDatabase, ref, push, set, update, get, child, remove, onValue
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// ---------------------------------------------
// CONFIGURACIÓN DEL PROYECTO
// ---------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyC8WY-oVhfJ-Xk9n5Mm7rjSscvzClJn90w",
  authDomain: "biblioteca-a4f22.firebaseapp.com",
  databaseURL: "https://biblioteca-a4f22-default-rtdb.firebaseio.com",
  projectId: "biblioteca-a4f22",
  storageBucket: "biblioteca-a4f22.firebasestorage.app",
  messagingSenderId: "715029802754",
  appId: "1:715029802754:web:a72f27ada0ecce3ae6dc1b",
  measurementId: "G-KYVTXE168C"
};

// ---------------------------------------------
// INICIALIZACIÓN
// ---------------------------------------------
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// Exportar funciones básicas de Firebase
export { ref, push, set, update, get, child, remove, onValue };

// ---------------------------------------------
// FUNCIONES PERSONALIZADAS (si decides usar)
// ---------------------------------------------
export async function agregarUsuario(nombre, correo) {
  const refUsuarios = ref(db, "usuarios");
  const nuevo = push(refUsuarios);
  await set(nuevo, { nombre, correo, librosPrestados: {} });
  return nuevo.key;
}

export async function agregarLibro(titulo, autor) {
  const refLibros = ref(db, "libros");
  const nuevo = push(refLibros);
  await set(nuevo, { titulo, autor, disponible: true, prestadoA: null });
  return nuevo.key;
}

export async function obtenerUsuarios() {
  const snapshot = await get(ref(db, "usuarios"));
  return snapshot.exists() ? snapshot.val() : {};
}

export async function obtenerLibros() {
  const snapshot = await get(ref(db, "libros"));
  return snapshot.exists() ? snapshot.val() : {};
}

export async function prestarLibro(uid, libroId) {
  const libroSnap = await get(ref(db, `libros/${libroId}`));
  const usuarioSnap = await get(ref(db, `usuarios/${uid}`));
  if (!libroSnap.exists() || !usuarioSnap.exists()) return false;
  const libro = libroSnap.val();
  if (!libro.disponible) return false;
  await update(ref(db, `libros/${libroId}`), { disponible: false, prestadoA: uid });
  await update(ref(db, `usuarios/${uid}/librosPrestados`), { [libroId]: true });
  return true;
}

export async function devolverLibro(uid, libroId) {
  const libroSnap = await get(ref(db, `libros/${libroId}`));
  if (!libroSnap.exists()) return false;
  const libro = libroSnap.val();
  if (libro.prestadoA !== uid) return false;
  await update(ref(db, `libros/${libroId}`), { disponible: true, prestadoA: null });
  await update(ref(db, `usuarios/${uid}/librosPrestados`), { [libroId]: null });
  return true;
}

console.log("Firebase cargado correctamente 🎉");