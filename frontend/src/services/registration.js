const KEY = 'dvs_registrations_v1';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return {};
  }
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function isRegistered(eventId, account) {
  if (!eventId || !account) return false;
  const data = load();
  const key = String(eventId);
  const set = new Set(data[key] || []);
  return set.has(account.toLowerCase());
}

export function register(eventId, account) {
  if (!eventId || !account) throw new Error('Missing eventId or account');
  const data = load();
  const key = String(eventId);
  const list = new Set(data[key] || []);
  list.add(account.toLowerCase());
  data[key] = Array.from(list);
  save(data);
}

export function getRegistrations(eventId) {
  const data = load();
  const key = String(eventId);
  return data[key] || [];
}


