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
    super()
    super(`Invalid value. '${whichForm}' is out of range of ${whichAxis}`);
    this.whichForm = whichForm;
  }
}

export {InvalidAxisError, InvalidFormError, InvalidCoordRangeError};
