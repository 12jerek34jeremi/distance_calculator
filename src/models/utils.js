
function padWithZeros(toPad, n){
  return '0'.repeat(Math.max(0, n-toPad.length)) + toPad;
}

function splitFloat(number, intPartDigits, fractionPartMaxDigids){
  let [intPart, fracPart] = number.toFixed(fractionPartMaxDigids).split('.');
  intPart = padWithZeros(intPart, intPartDigits);
  fracPart = fracPart.replace(/0+$/, '');
  if(fracPart == '') fracPart = '0';
  return [intPart, fracPart]
}


function formatCoordinate(value, whichAxis, whichForm) {
  const DEGREE = String.fromCharCode(176); // ASCII-safe degree symbol

  const degFloat = Math.abs(value);

  let direction = '';
  let maxDigids = 0;
  if (whichAxis == 'lat'){
    maxDigids = 2;
    if(value >= 0) direction = 'N';
    else direction = 'S';
  }else{
    maxDigids = 3;
    if(value >= 0) direction = 'E';
    else direction = 'W';
  }

  if (whichForm == 'd') {
    // DD.F° N/S or DDD.F° E/W
    let [intPart, fracPart] = splitFloat(degFloat, maxDigids, 6);
    return `${intPart}.${fracPart}${DEGREE} ${direction}`;

  } else if (whichForm == 'dm') {
    // DD° MM.F N/S or DDD° MM.F E/W
    const degInt = Math.floor(degFloat);
    const minutesFloat = (degFloat - degInt) * 60;

    const degStr = padWithZeros(degInt.toString(), maxDigids);
    let [intPart, fracPart] = splitFloat(minutesFloat, 2, 4);
    return `${degStr}${DEGREE} ${intPart}.${fracPart}' ${direction}`;

  } else{
    // DD° MM' SS.F" N/S or DDD° MM' SS.F" E/W
    const degInt = Math.floor(degFloat);
    const minutesFloat = (degFloat - degInt) * 60;
    const minutesInt = Math.floor(minutesFloat);
    const secondsFloat = (minutesFloat - minutesInt) * 60;

    const degStr = padWithZeros(degInt.toString(), maxDigids);
    const minutesStr = padWithZeros(minutesInt.toString(), 2);
    let [intPart, fracPart] = splitFloat(secondsFloat, 2, 2);
    return `${degStr}${DEGREE} ${minutesStr}' ${intPart}.${fracPart}" ${direction}`;
  }
}


function parseCoordinate(coord, whichAxis, whichForm) {
  const DEGREE = String.fromCharCode(176); // degree sign
  const isLat = (whichAxis == 'lat');
  const maxDigids = isLat ? 2 : 3;


  coord = coord
  .toUpperCase() // change d to D, e to E, n to N, s to S, etc...
  .replace(/[\u00B0]/g, 'D')  // Replace degree sign (° = \u00B0) and d/D with "D"
  .replace(/['’]/g, 'M')      // Normalize minutes
  .replace(/["”]/g, 'S')      // Normalize seconds
  .replace(/\s+/g, '');     // Remove all whitespace
  
  let displayText;
  let absValue;
  let sense;

  if (whichForm == 'd') {
    let regex = /^(\d+)(?:[.,](\d+))?D?([sSnNeEwW])$/
    let match = coord.match(regex);
    if (match === null) return null;

    const deg = match[1];
    const fraction = (match[2] == null) ? '0' : match[2];
    sense = match[3];

    absValue = parseFloat(`${deg}.${fraction}`);
    displayText=`${padWithZeros(deg, maxDigids)}.${fraction}${DEGREE}`

  } else if (whichForm == 'dm') {
    let regex = /^(\d+)D(?:(\d+)(?:[,.](\d+))?M)?([sSnNeEwW])$/
    let match = coord.match(regex);
    if (match === null) return null;

    const deg = match[1];
    const minutes = (match[2] == null) ? '0' : match[2];
    const fraction = (match[3] == null) ? '0' : match[3];
    sense = match[4];

    if(parseInt(minutes) > 59) return null;

    absValue = parseInt(deg) + (parseFloat(`${minutes}.${fraction}`) / 60);
    displayText=`${padWithZeros(deg, maxDigids)}${DEGREE} ${padWithZeros(minutes, 2)}.${fraction}'`

  } else if (whichForm == 'dms') {
    let regex = /^(\d+)D(?:(\d+)M(?:(\d)+(?:[,.](\d+))?S)?)?([sSnNeEwW])$/
    let match = coord.match(regex);
    if (match === null) return null;

    const deg = match[1];
    const minutes = (match[2] == null) ? '0' : match[2];
    const seconds = (match[3] == null) ? '0' : match[3];
    const fraction = (match[4] == null) ? '0' : match[4];
    sense = match[5];

    if(parseInt(minutes) > 59 || parseInt(seconds) > 59) return null;

    absValue = parseInt(deg) + (parseInt(minutes) / 60)+(parseFloat(`${seconds}.${fraction}`)/3600);
    displayText=`${padWithZeros(deg, maxDigids)}${DEGREE} ${padWithZeros(minutes, 2)}' ${padWithZeros(seconds, 2)}.${fraction}"`
  }


  let floatValue;
  if(isLat){
    if(absValue > 90) return null;
    if(sense != 'N' && sense != 'S') return null;
    floatValue = (sense == 'N') ? absValue : -absValue;
  }else{
    if(absValue > 180) return null;
    if(sense != 'E' && sense != 'W') return null;
    floatValue = (sense == 'E') ? absValue : -absValue;
  }

  displayText = `${displayText} ${sense}`;
  return [floatValue, displayText ];
}


export {formatCoordinate, parseCoordinate};