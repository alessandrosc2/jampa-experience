const STORAGE_FAVORITES_KEY = 'jampa_user_favorites';

class FavoritesService {
  private getFavoritesMap(): Record<string, string[]> {
    const data = localStorage.getItem(STORAGE_FAVORITES_KEY);
    if (!data) return {};
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }

  private saveFavoritesMap(map: Record<string, string[]>): void {
    localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(map));
  }

  public getFavoriteIds(userId: string = 'guest'): string[] {
    const map = this.getFavoritesMap();
    return map[userId] || [];
  }

  public isFavorite(placeId: string, userId: string = 'guest'): boolean {
    const list = this.getFavoriteIds(userId);
    return list.includes(placeId);
  }

  public toggleFavorite(placeId: string, userId: string = 'guest'): boolean {
    const map = this.getFavoritesMap();
    const list = map[userId] || [];
    const exists = list.includes(placeId);

    let updated: string[];
    if (exists) {
      updated = list.filter((id) => id !== placeId);
    } else {
      updated = [...list, placeId];
    }

    map[userId] = updated;
    this.saveFavoritesMap(map);
    return !exists;
  }
}

export const favoritesService = new FavoritesService();
