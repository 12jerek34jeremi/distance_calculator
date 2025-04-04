function deg2rad(deg) {
  return deg * (Math.PI/180)
}

class Coordinate {
  constructor(lat, lon) {
    this.lat = lat; // N +, S -
    this.lon = lon; // N +, S -
  }

  static calculateDistance(coorA, coorB) {
    var R = 6371000; // Radius of the earth in meters
    var dLat = deg2rad(coorB.lat-coorA.lat);  // deg2rad below
    var dLon = deg2rad(coorB.lon-coorA.lon); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(coorA.lat)) * Math.cos(deg2rad(coorB.lat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in meters
    return d;
  }
}

export default Coordinate;
