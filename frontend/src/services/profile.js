const KEY = 'dvs_profile_v1';

function loadAll() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return {};
  }
}

function saveAll(obj) {
  localStorage.setItem(KEY, JSON.stringify(obj));
}

export function getProfile(address) {
  if (!address) return null;
  const all = loadAll();
  return all[address.toLowerCase()] || null;
}

export function setProfile(address, profile) {
  if (!address) throw new Error('Missing address');
  const all = loadAll();
  all[address.toLowerCase()] = { ...profile, address: address.toLowerCase() };
  saveAll(all);
}

export function exportProfiles() {
  return JSON.stringify(loadAll(), null, 2);
}

export function importProfiles(json) {
  const data = JSON.parse(json);
  if (typeof data !== 'object' || data === null) throw new Error('Invalid profile data');
  saveAll(data);
}


