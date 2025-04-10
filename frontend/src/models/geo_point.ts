import { type numFloat } from '@/models/types.ts'

class GeoPoint {
  lat: numFloat
  lon: numFloat

  constructor(lat: numFloat, lon: numFloat) {
    this.lat = lat // N +, S -
    this.lon = lon // E +, W -
  }
}

export default GeoPoint
