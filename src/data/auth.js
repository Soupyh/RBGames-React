//
// EN: ../data/auth.js (REEMPLAZA TODO EL ARCHIVO)
//

// ================== AUTH STORAGE KEYS ==================
const KEY_USERS   = 'rbgames_users';
const KEY_SESSION = 'rbgames_session';

// ================== UTILIDADES INTERNAS ==================
function normEmail(e) {
  return (e || '').toString().trim().toLowerCase();
}
function readUsers() {
  return JSON.parse(localStorage.getItem(KEY_USERS) || '[]');
}
function writeUsers(arr) {
  localStorage.setItem(KEY_USERS, JSON.stringify(arr));
}

// ================== SEED / SESIÓN ==================
export function seedAuth() {
  if (!localStorage.getItem(KEY_USERS)) {
    console.log('Sembrando usuarios por defecto en rbgames_users...'); // Ayuda para debug
    const users = [
      { email: 'admin@rbgames.com', pass: 'admin123', role: 'ADMIN', name: 'Administrador RB' },
      { email: 'user@rbgames.com',  pass: 'user123',  role: 'USER',  name: 'Usuario RB' }
    ];
    writeUsers(users);
  }
}

export function login(email, pass) {
  const e = normEmail(email);
  const u = readUsers().find(x => normEmail(x.email) === e && x.pass === pass);
  if (!u) return null;
  const session = { email: u.email, role: u.role, name: u.name };
  localStorage.setItem(KEY_SESSION, JSON.stringify(session));
  return session;
}

export function logout() { localStorage.removeItem(KEY_SESSION); }
export function getSession() { return JSON.parse(localStorage.getItem(KEY_SESSION) || 'null'); }
export function isAdmin() { return getSession()?.role === 'ADMIN'; }

// **********************************************************
// CORRECCIÓN DE BUG:
// 'isUser' (para la ruta /cuenta) debe permitir a USER y ADMIN
// ver su propia cuenta.
// **********************************************************
export function isUser() {
  const ses = getSession();
  if (!ses) return false; // No hay nadie logueado
  return ses.role === 'USER' || ses.role === 'ADMIN';
}

export function hasRole(role) { return getSession()?.role === role; }

// ================== REGISTRO DE USUARIOS (SELF-SIGNUP) ==================
export function emailExists(email) {
  const e = normEmail(email);
  return readUsers().some(u => normEmail(u.email) === e);
}

export function register({ email, pass, name, role = 'USER' }) {
  const e = normEmail(email);
  if (!e || !pass) return { ok:false, error:'Email y contraseña obligatorios' };

  const users = readUsers();
  if (users.some(u => normEmail(u.email) === e)) {
    return { ok:false, error:'El email ya está registrado' };
  }

  const u = { email: e, pass, role, name: name?.toString().trim() || '' };
  users.push(u);
  writeUsers(users);

  // auto-login
  const session = { email: u.email, role: u.role, name: u.name };
  localStorage.setItem(KEY_SESSION, JSON.stringify(session));

  return { ok:true, user: session };
}

// ================== CRUD DE USUARIOS (ADMIN) ==================

// **********************************************************
// CORRECCIÓN DE BUG:
// Esta función leía de 'users' en lugar de usar tu helper 'readUsers()'.
// **********************************************************
export function listUsers() {
  // Esta es la función que llama tu Admin.jsx.
  // Ahora usa tu helper 'readUsers' que lee 'rbgames_users'.
  return readUsers();
}

// Crea usuario sin iniciar sesión (para panel Admin)
export function createUser({ email, pass, name = '', role = 'USER' }) {
  const e = normEmail(email);
  if (!e || !pass) return { ok:false, error:'Email y contraseña obligatorios' };

  const users = readUsers();
  if (users.some(u => normEmail(u.email) === e)) {
    return { ok:false, error:'El email ya existe' };
  }

  users.push({ email: e, pass, name, role });
  writeUsers(users);
  return { ok:true };
}

export function updateUser(email, patch) {
  const e = normEmail(email);
  const users = readUsers();
  const i = users.findIndex(u => normEmail(u.email) === e);
  if (i < 0) return { ok:false, error:'Usuario no existe' };

  const safePatch = { ...patch };
  if (safePatch.email) safePatch.email = normEmail(safePatch.email);
  users[i] = { ...users[i], ...safePatch };
  writeUsers(users);
  return { ok:true, user: users[i] };
}

export function removeUser(email) {
  const e = normEmail(email);
  const ses = getSession();

  if (ses && normEmail(ses.email) === e) {
    return { ok:false, error:'No puedes eliminar la cuenta con sesión activa' };
  }

  const users = readUsers().filter(u => normEmail(u.email) !== e);
  writeUsers(users);
  return { ok:true };
}

export function setRole(email, role) {
  if (!['ADMIN','USER'].includes(role)) return { ok:false, error:'Rol inválido' };

  const ses = getSession();
  if (ses && normEmail(ses.email) === normEmail(email) && role !== 'ADMIN') {
    return { ok:false, error:'No puedes degradar tu propio rol' };
  }

  return updateUser(email, { role });
}

export function resetPassword(email, newPass) {
  if (!newPass) return { ok:false, error:'Nueva contraseña requerida' };
  return updateUser(email, { pass: newPass });
}


//============================================
// Crud para menu de edicion de perfil propio 
//============================================

// **********************************************************
// CORRECCIÓN DE BUG:
// Esta función leía de 'listUsers' (que estaba rota) y escribía
// en 'users' (la clave incorrecta).
// Ahora usa 'readUsers' y 'writeUsers'.
// **********************************************************
export function updateProfile(currentEmail, { name, email }) {
  try {
    if (!name || !email) {
      return { ok: false, error: 'El nombre y el email son obligatorios.' };
    }

    const e = normEmail(email);
    const ce = normEmail(currentEmail);
    const users = readUsers(); // <-- CORREGIDO (usa tu helper)
    const userIndex = users.findIndex(u => normEmail(u.email) === ce);

    if (userIndex === -1) {
      return { ok: false, error: 'Error: El usuario actual no fue encontrado en la lista.' };
    }

    const emailInUse = users.some(u => normEmail(u.email) === e && normEmail(u.email) !== ce);
    if (emailInUse) {
      return { ok: false, error: 'El nuevo email ya está en uso por otra cuenta.' };
    }

    users[userIndex].name = name;
    users[userIndex].email = e; // Guardamos el email normalizado

    writeUsers(users); // <-- CORREGIDO (usa tu helper)

    const session = getSession(); 
    if (session && normEmail(session.email) === ce) {
      session.name = name;
      session.email = e;
      localStorage.setItem(KEY_SESSION, JSON.stringify(session)); // Esto está bien
    }

    return { ok: true };

  } catch (err) {
    console.error('Error en updateProfile:', err); 
    return { ok: false, error: 'Ocurrió un error inesperado. Revisa la consola (F12).' };
  }
}