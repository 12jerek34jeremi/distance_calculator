/**
 * Provides functions for formatting and parsing geographic coordinates.
 * - `formatCoordinate` converts decimal degree values into formatted coordinate strings (D, DM,
 *   DMS).
 * - `parseCoordinate` parses coordinate strings back into decimal degrees and normalizes provided
 *   coordinate strings.
 */

import { InvalidAxisError, InvalidFormError, InvalidCoordRangeError } from '@/models/geo_errors.ts'

import { type Form, type Axis, type numInt, type numFloat, type Nullable } from '@/models/types.ts'

/**
 * Pads or trims a string to ensure it has exactly `n` characters.
 *
 * - If the string is shorter than `n`, it is left-padded with zeros.
 * - If the string is longer than `n`, it must only have leading zeros in the left excess part;
 *   otherwise, an error is thrown. The right part is returned.
 * - If the string is already of length `n`, it is returned as-is.
 *
 * @param {string} toPad - The input string to be padded or trimmed.
 * @param {numInt} n - The desired final length of the string.
 *
 * @returns {string} A string of exactly `n` characters.
 *
 * @throws {Error} If the string must be trimmed but the excess characters are not zeros.
 *
 * @example
 * padOrCut("7", 3);        // "007"
 * padOrCut("000123", 3);   // "123"
 * padOrCut("1234", 2);     // Error: invalid trim
 */
function padOrCut(toPad: string, n: numInt): string {
  if (toPad.length == n) {
    return toPad
  } else if (toPad.length < n) {
    return '0'.repeat(Math.max(0, n - toPad.length)) + toPad
  } else {
    const toCut: numInt = toPad.length - n
    if (toPad.slice(0, toCut) != '0'.repeat(toCut)) {
      throw new Error(`Invalud padOrCut arguments: '${toPad}' and '${n}'.`)
    }
    return toPad.slice(toCut, toPad.length)
  }
}

function removeTralingZeros(fracPart: string): string {
  fracPart = fracPart.replace(/0+$/, '')
  if (fracPart == '') fracPart = '0'
  return fracPart
}

/**
 * Splits a floating-point number into its integer and fractional parts as strings. Intiger part has
 * specified number of digits, fractional part has specified maximum number of digits.
 *
 * @param {numFloat} number - The number to split.
 * @param {numInt} intPartDigits - Minimum number of digits for the integer part (zero-padded if
 * necessary).
 * @param {numInt} fractionPartMaxDigids - Maximum number of digits for the fractional part.
 *
 * @returns {[string, string]} - intiger and fractional parts
 *
 * @example
 * splitFloat(5.2, 3, 4);  // ["005", "2"]
 * splitFloat(12.3456, 2, 3);  // ["12", "346"]
 */
function splitFloat(
  number: numFloat,
  intPartDigits: numInt,
  fractionPartMaxDigids: numInt,
): [string, string] {
  const splitResult: string[] = number.toFixed(fractionPartMaxDigids).split('.')

  if (splitResult.length != 2) {
    throw Error(`Invalid float to split: ${number}`)
  }
  let [intPart, fracPart]: [string, string] = splitResult as [string, string]

  intPart = padOrCut(intPart, intPartDigits)
  fracPart = removeTralingZeros(fracPart)
  return [intPart, fracPart]
}

/**
 * Formats a geographic coordinate (latitude or longitude) into a human-readable string.
 *
 * @param {numFloat} value - The coordinate value in decimal degrees.
 *                         Positive for N/E, negative for S/W.
 * @param {string} whichAxis - Indicates the axis: 'lat' for latitude or 'lon' for longitude.
 * @param {string} whichForm - Desired format of the output:
 *   - 'd'   : Decimal degrees (e.g., "45.123456° N")
 *   - 'dm'  : Degrees and decimal minutes (e.g., "045° 07.4073' N")
 *   - 'dms': Degrees, minutes, and decimal seconds (e.g., "045° 07' 24.44\" N")
 *
 * @returns {string} A formatted coordinate string with direction and appropriate symbols.
 *
 * @example
 * formatCoordinate(45.123456, 'lat', 'd');    // "45.123456° N"
 * formatCoordinate(-123.456, 'lon', 'dm');    // "123° 27.3600' W"
 * formatCoordinate(78.9, 'lat', 'dms');       // "78° 54' 00.00\" N"
 */
function formatCoordinate(value: numFloat, whichAxis: Axis, whichForm: Form): string {
  const DEGREE = String.fromCharCode(176) // ASCII-safe degree symbol

  const degFloat: numFloat = Math.abs(value)

  let direction: string = ''
  let maxDigids: numInt = 0
  if (whichAxis == 'lat') {
    if (value < -90.0 || value > 90.0) throw new InvalidCoordRangeError(value, whichAxis)
    maxDigids = 2
    if (value >= 0) direction = 'N'
    else direction = 'S'
  } else if (whichAxis == 'lon') {
    if (value < -180.0 || value > 180.0) throw new InvalidCoordRangeError(value, whichAxis)
    maxDigids = 3
    if (value >= 0) direction = 'E'
    else direction = 'W'
  } else {
    throw new InvalidAxisError(whichAxis)
  }

  if (whichForm == 'd') {
    // DD.Fdeg N/S or DDD.Fdeg E/W
    const [intPart, fracPart]: [string, string] = splitFloat(degFloat, maxDigids, 5)
    return `${intPart}.${fracPart}${DEGREE} ${direction}`
  } else if (whichForm == 'dm') {
    // DDdeg MM.F N/S or DDDdeg MM.F E/W
    let degInt: numInt = Math.floor(degFloat)
    let minutesFloat: numFloat = (degFloat - degInt) * 60

    if (Math.round(minutesFloat * 10_000) == 600_000) {
      minutesFloat = 0.0
      degInt += 1
    }

    const degStr: string = padOrCut(degInt.toString(), maxDigids)
    const [intPart, fracPart]: [string, string] = splitFloat(minutesFloat, 2, 4)
    return `${degStr}${DEGREE} ${intPart}.${fracPart}' ${direction}`
  } else if (whichForm == 'dms') {
    // DDdeg MM' SS.F" N/S or DDDdeg MM' SS.F" E/W
    let degInt: numInt = Math.floor(degFloat)
    const minutesFloat: numFloat = (degFloat - degInt) * 60
    let minutesInt: numInt = Math.floor(minutesFloat)
    let secondsFloat: numFloat = (minutesFloat - minutesInt) * 60

    if (Math.round(secondsFloat * 10) == 600) {
      secondsFloat = 0.0
      minutesInt += 1
    }
    if (minutesInt == 60) {
      minutesInt = 0
      degInt += 1
    }

    const degStr: string = padOrCut(degInt.toString(), maxDigids)
    const minutesStr: string = padOrCut(minutesInt.toString(), 2)
    const [intPart, fracPart]: [string, string] = splitFloat(secondsFloat, 2, 1)
    return `${degStr}${DEGREE} ${minutesStr}' ${intPart}.${fracPart}" ${direction}`
  } else {
    throw new InvalidFormError(whichForm)
  }
}

/**
 * Parses a coordinate string. If string is not a valid coordinate, function returns null. If string
 * is a valid coordinate, function returns float, a numeric representation of the coordinate in
 * decimal degrees. Positive for E/N, negative for S/W.
 *
 * @param {string} coord - The input coordinate string.
 * @param {string} whichAxis - Axis identifier: 'lat' for latitude or 'lon' for longitude.
 * @param {string} whichForm - Input format:
 *   - 'd'   : Decimal degrees (e.g., "45.1234N" or "45,1234 n")
 *   - 'dm'  : Degrees and decimal minutes (e.g., "45D07.40'N")
 *   - 'dms' : Degrees, minutes, and decimal seconds (e.g., "45D 07M 24.4S")
 *
 * @returns {[number, string] | null}
 *
 * @example
 * parseCoordinate("45.1234N", "lat", "d");        // 45.1234
 * parseCoordinate("123D27.36M W", "lon", "dm");   // -123.456
 * parseCoordinate("78D54M00.00S", "lat", "dms");  // -78.9
 */
function parseCoordinate(coord: string, whichAxis: Axis, whichForm: Form): Nullable<numFloat> {
  if (whichAxis != 'lat' && whichAxis != 'lon') throw new InvalidAxisError(whichAxis)
  const isLat = whichAxis == 'lat'
  const maxValue = isLat ? 90 : 180

  coord = coord
    .toUpperCase() // change d to D, e to E, n to N, s to S, etc...
    .replace(/[\u00B0]/g, 'D') // Replace degree sign (° = \u00B0) and d/D with "D"
    .replace(/['’]/g, 'M') // Normalize minutes
    .replace(/["”]/g, 'S') // Normalize seconds
    .replace(/\s+/g, '') // Remove all whitespace

  let absValue: numFloat
  let sense: string

  if (whichForm == 'd') {
    const regex = /^(\d+)(?:[.,](\d+))?D?([sSnNeEwW])$/
    const match = coord.match(regex)
    if (match === null) return null

    const deg: string = match[1]
    const fraction: string = match[2] == null ? '0' : match[2]
    sense = match[3]

    if (parseInt(deg) > maxValue) return null
    absValue = parseFloat(`${deg}.${fraction}`)
  } else if (whichForm == 'dm') {
    const regex = /^(\d+)D(?:(\d+)(?:[,.](\d+))?M)?([sSnNeEwW])$/
    const match = coord.match(regex)
    if (match === null) return null

    const deg: string = match[1]
    const minutes: string = match[2] == null ? '0' : match[2]
    const fraction: string = match[3] == null ? '0' : match[3]
    sense = match[4]

    if (parseInt(deg) > maxValue || parseInt(minutes) > 59) return null
    absValue = parseInt(deg) + parseFloat(`${minutes}.${fraction}`) / 60
  } else if (whichForm == 'dms') {
    const regex = /^(\d+)D(?:(\d+)M(?:(\d+)(?:[,.](\d+))?S)?)?([sSnNeEwW])$/
    const match = coord.match(regex)

    if (match === null) return null

    const deg: string = match[1]
    const minutes: string = match[2] == null ? '0' : match[2]
    const seconds: string = match[3] == null ? '0' : match[3]
    const fraction = match[4] == null ? '0' : match[4]
    sense = match[5]

    if (parseInt(deg) > maxValue || parseInt(minutes) > 59 || parseInt(seconds) > 59) return null
    absValue = parseInt(deg) + parseInt(minutes) / 60 + parseFloat(`${seconds}.${fraction}`) / 3600
  } else {
    throw new InvalidFormError(whichForm)
  }

  let floatValue: numFloat
  if (whichAxis == 'lat') {
    if (absValue > 90.0) return null
    if (sense != 'N' && sense != 'S') return null
    floatValue = sense == 'N' ? absValue : -absValue
  } else {
    if (absValue > 180.0) return null
    if (sense != 'E' && sense != 'W') return null
    floatValue = sense == 'E' ? absValue : -absValue
  }

  return Math.round(floatValue * 100_000) / 100_000 //round to 5 decimal places
}

export { formatCoordinate, parseCoordinate }
