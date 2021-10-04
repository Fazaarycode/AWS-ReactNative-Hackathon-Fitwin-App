// Helper methods to allow us to send the data in the way AWS expects it.


const getAWSDate = () => {
  let date = new Date()
  return date.toISOString().substring(0, date.indexOf('T'))
}

const getAWSTime = () => {
  let time = new Date().toISOString()
  time.substring(time.indexOf('T') + 1, time.indexOf('Z'))
}

const getEncodedJSON = myJSON => {
  var myJSONString = JSON.stringify(myJSON);
  return myJSONString.replace(/\\n/g, "\\n")
                      .replace(/\\'/g, "\\'")
                      .replace(/\\"/g, '\\"')
                      .replace(/\\&/g, "\\&")
                      .replace(/\\r/g, "\\r")
                      .replace(/\\t/g, "\\t")
                      .replace(/\\b/g, "\\b")
                      .replace(/\\f/g, "\\f");
}

/**
 * @param dateRef: Date - object of the reference
 * @param numDaysAgo: number - number of days ago
 */
const getISODaysAgoString = (dateRef, numDaysAgo) => {
  const iDateObj = new Date(dateRef.valueOf() - (numDaysAgo * 24 * 60 * 60 * 1000));
  const iDateStr = iDateObj.toISOString().split('T')[0];  
  return iDateStr;
}

const toRadians = (deg) => {
  return deg * Math.PI / 180;
}


/**
 * Taken from https://www.movable-type.co.uk/scripts/latlong.html
 * Returns the distance along the surface of the earth from ‘this’ point to destination point.
 *
 * Uses haversine formula: a = sin²(Δφ/2) + cosφ1·cosφ2 · sin²(Δλ/2); d = 2 · atan2(√a, √(a-1)).
 *
 * @param   {LatLon} point - Latitude/longitude of destination point.
 * @param   {number} [radius=6371e3] - Radius of earth (defaults to mean radius in metres).
 * @returns {number} Distance between this point and destination point, in same units as radius.
 * @throws  {TypeError} Invalid radius.
 *
 * @example
 *   const p1 = new LatLon(52.205, 0.119);
 *   const p2 = new LatLon(48.857, 2.351);
 *   const d = p1.distanceTo(p2);       // 404.3×10³ m
 *   const m = p1.distanceTo(p2, 3959); // 251.2 miles
 */
 const distanceBetweenTwoPoints = (src, dest, radius=6371e3) => {
  // if (!(point instanceof LatLonSpherical)) point = LatLonSpherical.parse(point); // allow literal forms
  // if (isNaN(radius)) throw new TypeError(`invalid radius ‘${radius}’`);

  // a = sin²(Δφ/2) + cos(φ1)⋅cos(φ2)⋅sin²(Δλ/2)
  // δ = 2·atan2(√(a), √(1−a))
  // see mathforum.org/library/drmath/view/51879.html for derivation

  const R = radius;
  const φ1 = toRadians(src.lat),  λ1 = toRadians(src.lng);
  const φ2 = toRadians(dest.lat), λ2 = toRadians(dest.lng);
  const Δφ = φ2 - φ1;
  const Δλ = λ2 - λ1;

  const a = Math.sin(Δφ/2)*Math.sin(Δφ/2) + Math.cos(φ1)*Math.cos(φ2) * Math.sin(Δλ/2)*Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;

  return d;
}

export { getAWSDate , getAWSTime, getEncodedJSON, getISODaysAgoString, distanceBetweenTwoPoints } ; 
