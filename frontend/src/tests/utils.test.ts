import { expect, test } from 'vitest'
import { formatCoordinate, parseCoordinate } from '@/models/utils.js'
import type { Form, numFloat, Axis } from '@/models/types'

const DG = String.fromCharCode(176) // ASCII-safe degree symbol

const validCoordinates: [Form, Axis, string, numFloat, string[]][] = [
  // Decimal degrees - Latitude
  [`d`, `lat`, `45.5${DG} N`, 45.5, [`45.5dn`, `45.5 n`, `45.5 ${DG} N`, `045.5D N`, `045,5dN `]],
  [`d`, `lat`, `12.25${DG} S`, -12.25, [`12.25 s`, `012.25dS`, `12,25°s`, `12.25Ds `]],

  // Decimal degrees - Longitude
  [`d`, `lon`, `123.456${DG} E`, 123.456, [`123.456 e`, `123,456dE`, `123.456° E`, `123.456 D e `]],
  [`d`, `lon`, `078.9${DG} W`, -78.9, [`078.9w`, `078.9 D w`, `078,9${DG}W`, `078.900dW `]],

  // Degrees and decimal minutes - Latitude
  [`dm`, `lat`, `45${DG} 30.0' N`, 45.5, [`45D30M N`, `45d30.0mn`, `045°30,00M N`, `45D30,00MN `]],
  [`dm`, `lat`, `12${DG} 15.0' S`, -12.25, [`12D15.0mS`, `012°15.00M s`, `12d15m s `]],

  // Degrees and decimal minutes - Longitude
  [`dm`, `lon`, `123${DG} 27.36' E`, 123.456, [`123D27.36M e`, `123d27,36me`, `123°27.36mE `]],
  [`dm`, `lon`, `078${DG} 54.0' W`, -78.9, [`078d54mW`, `078°54.00M w`, `78D54.00m w `]],

  // Degrees, minutes, and decimal seconds - Latitude
  [
    `dms`,
    `lat`,
    `45${DG} 30' 00.0" N`,
    45.5,
    [`45D30M00.00Sn`, `45d30m00.00s N`, `045°30'00,00"n `],
  ],
  [
    `dms`,
    `lat`,
    `12${DG} 15' 00.0" S`,
    -12.25,
    [`012d15m00.00s  s`, `12D15M00,00Ss`, `12°15'00" S`],
  ],

  // Degrees, minutes, and decimal seconds - Longitude
  [
    `dms`,
    `lon`,
    `123${DG} 27' 21.6" E`,
    123.456,
    [`123D27M21.60Se`, `123°27m21.6se `, `123d27m21,60s E`],
  ],
  [
    `dms`,
    `lon`,
    `078${DG} 54' 00.0" W`,
    -78.9,
    [`078d54m00.00s w`, `078D54M00,00S w`, `78°54'00"W `],
  ],
]

const invalidCoordinates: [Form, Axis, string[]][] = [
  ['d', 'lat', ['45.5', '45k.5 n', `45.5${DG}D N`, '45D30.5MN']],
  ['d', 'lon', ['181.0E', '100.0Q', `120${DG}${DG} W`, '120.0M E']],

  ['dm', 'lat', ['45D60.1M N', '91D00.0M S', '45D30.60.1MN', '45D30M', '45D61M S']],
  ['dm', 'lon', ['123D60.00M E', '200D00.00M W', '123D27.36.5M E', '123D27.36M']],

  ['dms', 'lat', ['45D30M60.01S', '90D00M00.00 Q', '91D00M00.00S']],
  ['dms', 'lon', ['181D00M00.00E', '123D60M00.00E', '123D27M60.00S', '123D27M21,60,50S']],
]

test('formatCoordinate', () => {
  for (const [form, axis, displayText, flValue, _] of validCoordinates) {
    expect(formatCoordinate(flValue, axis, form)).toBe(displayText)
  }
})

test('parseCoordinateValid', () => {
  for (const [form, axis, _, flValue, possibleStrings] of validCoordinates) {
    for (const coordString of possibleStrings) {
      expect(parseCoordinate(coordString, axis, form)).toBe(flValue)
    }
  }
})

test('parseCoordinateInvalid', () => {
  for (const [form, axis, coordStrings] of invalidCoordinates) {
    for (const coordString of coordStrings) {
      expect(parseCoordinate(coordString, axis, form)).toBeNull()
    }
  }
})

function maybeMutateString(coordString: string) {
  if (Math.random() < 0.1) {
    coordString = coordString.replace(/'/g, Math.random() < 0.5 ? 'M' : 'm')
  }

  if (Math.random() < 0.1) {
    coordString = coordString.replace(/"/g, Math.random() < 0.5 ? 's' : 'S')
  }

  if (Math.random() < 0.1) {
    const possibleSpacesNr = [1, 1, 1, 1, 2, 2, 3, 4, 5, 6]
    const numSpaces = possibleSpacesNr[Math.floor(Math.random() * possibleSpacesNr.length)]
    for (let i = 0; i < numSpaces; i++) {
      const pos = Math.floor(Math.random() * (coordString.length + 1))
      coordString = coordString.slice(0, pos) + ' ' + coordString.slice(pos)
    }
  }

  return coordString
}

test('twoWaysRandomConversion', () => {
  for (let i = 0; i < 10000; i++) {
    const whichAxis: Axis = Math.random() < 0.5 ? 'lat' : 'lon'
    const whichForm: Form = (['d', 'dm', 'dms'] as Form[])[Math.floor(Math.random() * 3)]

    const range: [numFloat, numFloat] = whichAxis == 'lat' ? [-90.0, 90.0] : [-180.0, 180.0]
    let floatValueOr = Math.random() * (range[1] - range[0]) + range[0]
    floatValueOr = Math.round(floatValueOr * 1_00_00) / 1_00_00

    let coordText = formatCoordinate(floatValueOr, whichAxis, whichForm)
    coordText = maybeMutateString(coordText);
    let floatValueTr = parseCoordinate(coordText, whichAxis, whichForm)

    expect(floatValueTr).not.toBeNull()

    floatValueTr = floatValueTr as numFloat

    if (Math.abs(floatValueOr - floatValueTr) > 0.000011) {
      console.log(floatValueOr, coordText, floatValueTr)
      expect(2).toBe(4)
    }
  }
})

test('twoWaysConversionEdgeCases', () => {
  const testCases: { value: numFloat; axis: Axis }[] = [
    { value: -90.0, axis: 'lat' },
    { value: 90.0, axis: 'lat' },
    { value: -180.0, axis: 'lon' },
    { value: 180.0, axis: 'lon' },
  ]

  const forms: Form[] = ['d', 'dm', 'dms']

  for (const { value, axis } of testCases) {
    for (const form of forms) {
      let coordText = formatCoordinate(value, axis, form)
      let floatValueTr = parseCoordinate(coordText, axis, form)
      coordText = maybeMutateString(coordText);

      expect(floatValueTr).not.toBeNull()

      floatValueTr = floatValueTr as numFloat

      if (Math.abs(value - floatValueTr) > 0.000011) {
        console.log(value, coordText, floatValueTr)
        expect(2).toBe(4) // Force fail to inspect
      }
    }
  }
})

