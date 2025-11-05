// ================== AUTH STORAGE KEYS ==================
const KEY_USERS   = 'rbgames_users';
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
    const users = [
      { email: 'admin@rbgames.com', pass: 'admin123', role: 'ADMIN', name: 'Administrador RB' },
      { email: 'user@rbgames.com',  pass: 'user123',  role: 'USER',  name: 'Usuario RB' }
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
export function isUser()  { return getSession()?.role === 'USER'; }
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
export function listUsers() {
  // Asegúrate de que tu función se vea exactamente así:
  // Lee 'users' desde localStorage CADA VEZ que es llamada.
  // No uses variables "let cachedUsers = ..." fuera de la función.
  try {
    const data = localStorage.getItem('users');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error al leer lista de usuarios:", e);
    return [];
  }
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
  if (safePatch.email) safePatch.email = normEmail(safePatch.email); // si algún día permites cambiar email
  users[i] = { ...users[i], ...safePatch };
  writeUsers(users);
  return { ok:true, user: users[i] };
}

export function removeUser(email) {
  const e = normEmail(email);
  const ses = getSession();

  // Evita que el admin se borre a sí mismo por accidente
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
  // Evita que un admin se baje su propio rol por accidente
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

export function updateProfile(currentEmail, { name, email }) {
  try {
    // 1. Validar datos
    if (!name || !email) {
      return { ok: false, error: 'El nombre y el email son obligatorios.' };
    }

    // 2. Cargar la lista FRESCA (usando la función que acabamos de arreglar)
    const users = listUsers(); 
    const userIndex = users.findIndex(u => u.email === currentEmail);

    if (userIndex === -1) {
      return { ok: false, error: 'Error: El usuario actual no fue encontrado en la lista de usuarios.' };
    }

    // 3. Revisar si el nuevo email ya está en uso por OTRO usuario
    const emailInUse = users.some(u => u.email === email && u.email !== currentEmail);
    if (emailInUse) {
      return { ok: false, error: 'El nuevo email ya está en uso por otra cuenta.' };
    }

    // 4. Actualizar al usuario EN LA LISTA (para el Admin Panel)
    users[userIndex].name = name;
    users[userIndex].email = email;

    // 5. Guardar la lista actualizada (para el Admin Panel)
    localStorage.setItem('users', JSON.stringify(users));

    // 6. Actualizar la SESIÓN ACTIVA (para "Mi cuenta")
    const session = getSession(); 
    if (session && session.email === currentEmail) {
      session.name = name;
      session.email = email;
      localStorage.setItem('session', JSON.stringify(session));
    }

    return { ok: true };

  } catch (err) {
    console.error('Error en updateProfile:', err); 
    return { ok: false, error: 'Ocurrió un error inesperado. Revisa la consola (F12).' };
  }
}