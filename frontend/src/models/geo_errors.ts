import { type Form, type Axis, type numFloat } from '@/models/types.ts'

class InvalidAxisError extends Error {
  whichAxis: Axis

  constructor(whichAxis: Axis) {
    super(`Invalid axis value: '${whichAxis}' Expected 'lat' or 'lon'.`)
    this.whichAxis = whichAxis
  }
}

class InvalidFormError extends Error {
  whichForm: Form

  constructor(whichForm: Form) {
    super(`Invalid form value: '${whichForm}' Expected 'd', 'dm', or 'dms'.`)
    this.whichForm = whichForm
  }
}

class InvalidCoordRangeError extends Error {
  whichAxis: Axis
  constructor(value: numFloat, whichAxis: Axis) {
    super(`Invalid value. '${value}' is out of range of ${whichAxis}`)
    this.whichAxis = whichAxis
  }
}

export { InvalidAxisError, InvalidFormError, InvalidCoordRangeError }
