<!--
  CoordinateInput.vue

  A reusable input component for entering and validating geographic coordinates (latitude or
  longitude) in various formats: decimal degrees (d), degrees-minutes (dm), or
  degrees-minutes-seconds (dms). Includes <input type="text" for coordinate> and div (below) it for
  displaying errors like "invalid coordinate format" or "Insert a coordinate!"
  Possible coordinates formats:
    - 'd'   : Decimal degrees (e.g., "45.1234N" or "45,1234 n")
    - 'dm'  : Degrees and decimal minutes (e.g., "45D07.40'N")
    - 'dms' : Degrees, minutes, and decimal seconds (e.g., "45D 07M 24.4S")

  Props:
  - whichAxis (String): Specifies whether the input is for 'lat' (latitude) or 'lon' (longitude).
  - initialForm (String): The initial format of the coordinate ('d', 'dm', or 'dms').

  Public Methods (via defineExpose):
  - getCoordinate(): Parses the coordinate. It toogles displaying  error messages for invalid or
        empty input. It returns a coordinate as float, if string in input is a valid coordinate.
        Returns `null` if the input is empty or invalid.
  - changeWhichForm(newForm): Changes the coordinate format.
-->
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { InvalidAxisError, InvalidFormError } from '@/models/geo_errors.ts'
import { formatCoordinate, parseCoordinate } from '@/models/utils.ts'
import { type Form, type Axis, type numFloat, type Nullable } from '@/models/types.ts'

const props = defineProps<{
  whichAxis: Axis
  initialForm: Form
}>()

const DEGREE = String.fromCharCode(176)
const whichAxis = props.whichAxis

const coordinateText: Ref<string> = ref('')
const displayError: Ref<boolean> = ref(false)
const displayEmpty: Ref<boolean> = ref(false)
const whichForm: Ref<Form> = ref(props.initialForm)

let inputChanged: boolean = false
let floatValue: Nullable<numFloat> = null

const placeHolderText = computed<string>(() => {
  const newWhichForm: Form = whichForm.value
  if (whichAxis == 'lat') {
    if (newWhichForm == 'd') {
      return `52.207465${DEGREE} N`
    } else if (newWhichForm == 'dm') {
      return `52${DEGREE} 12.4479 N`
    } else if (newWhichForm == 'dms') {
      return `52${DEGREE} 12' 06.87" N`
    } else {
      throw new InvalidFormError(newWhichForm)
    }
  } else if (whichAxis == 'lon') {
    if (newWhichForm == 'd') {
      return `20.915066${DEGREE} E`
    } else if (newWhichForm == 'dm') {
      return `020${DEGREE} 54.904' E`
    } else if (newWhichForm == 'dms') {
      return `020${DEGREE} 54' 54.24" E`
    } else {
      throw new InvalidFormError(newWhichForm)
    }
  } else {
    throw new InvalidAxisError(whichAxis)
  }
})

function updateCoordinate(): void {
  if (!inputChanged) {
    return
  }

  const text: string = coordinateText.value.trim()

  if (text == '') {
    displayError.value = false
    displayEmpty.value = true
    floatValue = null
  } else {
    displayEmpty.value = false
    floatValue = parseCoordinate(text, whichAxis, whichForm.value)
    if (floatValue == null) {
      displayError.value = true
    } else {
      displayError.value = false
      coordinateText.value = formatCoordinate(floatValue, whichAxis, whichForm.value)
    }
  }

  inputChanged = false
}

function getCoordinate(): Nullable<numFloat> {
  if (inputChanged) updateCoordinate()
  return floatValue
}

function changeWhichForm(newWhichForm: Form): void {
  displayEmpty.value = false
  displayError.value = false

  if (inputChanged) {
    floatValue = parseCoordinate(coordinateText.value, whichAxis, whichForm.value)
  }

  if (floatValue === null)
    floatValue = parseCoordinate(coordinateText.value, whichAxis, newWhichForm)

  if (floatValue !== null)
    coordinateText.value = formatCoordinate(floatValue, whichAxis, newWhichForm)

  whichForm.value = newWhichForm
}

function onInputCallback(event: any): void {
  coordinateText.value = event.currentTarget.value
  inputChanged = true
}

defineExpose({ getCoordinate, changeWhichForm })
</script>

<template>
  <div class="input-container">
    <input
      type="text"
      @input="onInputCallback"
      @blur="updateCoordinate"
      :placeholder="placeHolderText"
      :value="coordinateText"
      class="input-field"
    />
    <div class="error-message-box">
      <p v-show="displayError" class="error-text">The above is not a valid coordinate!</p>
      <p v-show="displayEmpty" class="error-text">Insert a coordinate!</p>
    </div>
  </div>
</template>

<style scoped>
.coordinate-container {
  margin: 0.75rem auto;
}

.input-field {
  width: 90%;
  padding: 8px 10px;
  font-size: 0.95rem;
  border: 1.5px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 3px rgba(0, 123, 255, 0.4);
}

.error-message-box {
  min-height: 20px;
  margin-top: 2px;
  margin-bottom: 2px;
}

.error-text {
  color: #d9534f;
  font-size: 0.85rem;
  margin: 0;
  transition: opacity 0.2s ease-in-out;
}
</style>
