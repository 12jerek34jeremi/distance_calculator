class InvalidAxisError extends Error {
  constructor(whichAxis) {
    super(`Invalid axis value: '${whichAxis}' Expected 'lat' or 'lon'.`);
    this.whichAxis = whichAxis;
  }
}

class InvalidFormError extends Error {
  constructor(whichForm) {
    super(`Invalid form value: '${whichForm}' Expected 'd', 'dm', or 'dms'.`);
    this.whichForm = whichForm;
  }
}

class InvalidCoordRangeError extends Error {
  constructor(value, whichAxis) {
    super(`Invalid value. '${value}' is out of range of ${whichAxis}`);
    this.whichAxis = whichAxis;
  }
}

export { InvalidAxisError, InvalidFormError, InvalidCoordRangeError };
