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
