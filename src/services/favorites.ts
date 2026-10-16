const STORAGE_KEY = 'saviora_ia_favoris';

export function getStoredFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function saveFavorite(id: string): string[] {
  const current = getStoredFavorites();
  if (!current.includes(id)) {
    const updated = [...current, id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
  return current;
}

export function removeFavorite(id: string): string[] {
  const current = getStoredFavorites();
  const updated = current.filter(item => item !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function toggleFavorite(id: string): { isFav: boolean; list: string[] } {
  const current = getStoredFavorites();
  if (current.includes(id)) {
    const updated = current.filter(item => item !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return { isFav: false, list: updated };
  } else {
    const updated = [...current, id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return { isFav: true, list: updated };
  }
}

export function setAllFavorites(ids: string[]): string[] {
  const cleanList = Array.from(new Set(ids.filter(Boolean)));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanList));
  return cleanList;
}

export function mergeFavorites(newIds: string[]): string[] {
  const current = getStoredFavorites();
  const merged = Array.from(new Set([...current, ...newIds.filter(Boolean)]));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  return merged;
}

export function clearAllUserData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
