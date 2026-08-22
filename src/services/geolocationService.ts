export interface UserCoordinates {
  lat: number;
  lng: number;
  accuracy?: number;
}

// Centro de referência de João Pessoa (Tambaú)
export const DEFAULT_JAMPA_COORDS: UserCoordinates = {
  lat: -7.1147,
  lng: -34.8236
};

class GeolocationService {
  /**
   * Calcula a distância em quilômetros entre duas coordenadas (Fórmula de Haversine)
   */
  public calculateDistanceKm(
    coord1: { lat: number; lng: number },
    coord2: { lat: number; lng: number }
  ): number {
    const R = 6371; // Raio da Terra em KM
    const dLat = this.deg2rad(coord2.lat - coord1.lat);
    const dLng = this.deg2rad(coord2.lng - coord1.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(coord1.lat)) *
        Math.cos(this.deg2rad(coord2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Formata a distância para exibição amigável (Ex: "450 m" ou "3,2 km")
   */
  public formatDistance(km: number): string {
    if (km < 1) {
      return `${Math.round(km * 1000)} m`;
    }
    return `${km.toFixed(1).replace('.', ',')} km`;
  }

  /**
   * Obtém a localização atual do usuário via navegador
   */
  public getCurrentPosition(): Promise<UserCoordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não suportada neste navegador.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy
          });
        },
        (err) => {
          reject(err);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }
}

export const geolocationService = new GeolocationService();
