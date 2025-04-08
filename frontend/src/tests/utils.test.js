import { expect, test } from 'vitest'
import { formatCoordinate, parseCoordinate } from '@/models/utils.js'

const DG = String.fromCharCode(176); // ASCII-safe degree symbol


const validCoordinates = [
  // Decimal degrees - Latitude
   [`d`, `lat`, `45.5${DG} N`, 45.5,  [`45.5dn`, `45.5 n`, `45.5 ${DG} N`, `045.5D N`, `045,5dN `]],
   [`d`, `lat`, `12.25${DG} S`, -12.25,  [`12.25 s`, `012.25dS`, `12,25°s`, `12.25Ds `]],

  // Decimal degrees - Longitude
   [`d`, `lon`, `123.456${DG} E`, 123.456,  [`123.456 e`, `123,456dE`, `123.456° E`, `123.456 D e `]],
   [`d`, `lon`, `078.9${DG} W`, -78.9,  [`078.9w`, `078.9 D w`, `078,9${DG}W`, `078.900dW `]],

  // Degrees and decimal minutes - Latitude
   [`dm`, `lat`, `45${DG} 30.0' N`, 45.5,  [`45D30M N`, `45d30.0mn`, `045°30,00M N`, `45D30,00MN `]],
   [`dm`, `lat`, `12${DG} 15.0' S`, -12.25,  [`12D15.0mS`, `012°15.00M s`, `12d15m s `]],

  // Degrees and decimal minutes - Longitude
   [`dm`, `lon`, `123${DG} 27.36' E`, 123.456,  [`123D27.36M e`, `123d27,36me`, `123°27.36mE `]],
   [`dm`, `lon`, `078${DG} 54.0' W`, -78.9,  [`078d54mW`, `078°54.00M w`, `78D54.00m w `]],

  // Degrees, minutes, and decimal seconds - Latitude
   [`dms`, `lat`, `45${DG} 30' 00.0" N`, 45.5,  [`45D30M00.00Sn`, `45d30m00.00s N`, `045°30'00,00"n `]],
   [`dms`, `lat`, `12${DG} 15' 00.0" S`, -12.25,  [`012d15m00.00s  s`, `12D15M00,00Ss`, `12°15'00" S`]],

  // Degrees, minutes, and decimal seconds - Longitude
   [`dms`, `lon`, `123${DG} 27' 21.6" E`, 123.456,  [`123D27M21.60Se`, `123°27m21.6se `, `123d27m21,60s E`]],
   [`dms`, `lon`, `078${DG} 54' 00.0" W`, -78.9,  [`078d54m00.00s w`, `078D54M00,00S w`, `78°54'00"W `]]
];

const invalidCoordinates = [
  ['d', 'lat', ['45.5', '45k.5 n', `45.5${DG}D N`, '45D30.5MN']],
  ['d', 'lon', ['181.0E', '100.0Q', `120${DG}${DG} W`, '120.0M E']],

  ['dm', 'lat', ['45D60.1M N', '91D00.0M S', '45D30.60.1MN', '45D30M', '45D61M S',]],
  ['dm', 'lon', ['123D60.00M E', '200D00.00M W', '123D27.36.5M E', '123D27.36M']], 

  ['dms', 'lat', ['45D30M60.01S', '90D00M00.00 Q', '91D00M00.00S']],
  ['dms', 'lon', ['181D00M00.00E', '123D60M00.00E', '123D27M60.00S', '123D27M21,60,50S']],
];



test('formatCoordinate', () => {
  for(const [form, axis, displayText, flValue, _] of validCoordinates){
    expect(formatCoordinate(flValue, axis, form)).toBe(displayText);
  }
})

test('parseCoordinateValid', () => {
  for(const [form, axis, _, flValue, possibleStrings] of validCoordinates){
    for(const coordString of possibleStrings){
      expect(parseCoordinate(coordString, axis, form)).toBe(flValue);
    }
  }
})

test('parseCoordinateInvalid', () => {
  for(const [form, axis, coordStrings] of invalidCoordinates){
    for(const coordString of coordStrings){
      expect(parseCoordinate(coordString, axis, form)).toBeNull();
    }
  }
})
