type Axis = 'lat' | 'lon';
type Form = 'd' | 'dm' | 'dms';
type Nullable<T> = T | null;

type numInt = number;
type numFloat = number;
// above are useless for statis type checking, but it helps to read the code


export {type Axis, type Form, type numInt, type numFloat, type Nullable}