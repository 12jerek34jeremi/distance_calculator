<!--
  DistanceCalculator.vue

  A user interface component for calculating the distance between two geographic points
  provided via coordinate input fields.

  Functionality:
  - Uses two `GeoInput` components to collect and validate input for Point A and Point B.
  - Sends the validated coordinates as query parameters to a backend API to compute distance.
  - Displays the result in both meters and kilometers, or appropriate error messages if inputs are
    invalid.
  - Supports coordinate entry in decimal degrees, degrees-minutes, or degrees-minutes-seconds.
-->

<script setup lang="ts">
import { useTemplateRef, ref } from 'vue'
import type { Ref } from 'vue'
import GeoInput from '@/components/GeoInput.vue'
import type { numInt } from './models/types'
import type GeoPoint from './models/geo_point'

const geoInputA = useTemplateRef('point-a')
const geoInputB = useTemplateRef('point-b')
const showDistance: Ref<boolean> = ref(false)
const loading: Ref<boolean> = ref(false)
const distance: Ref<numInt> = ref(0)

const fatalError: Ref<boolean> = ref(false)

function displayDistans(responseText: string): void {
  if (responseText == 'error') {
    fatalError.value = true
    return
  }
  let receivedDistance = parseInt(responseText)
  if (isNaN(receivedDistance)) {
    fatalError.value = true
    return
  }

  distance.value = receivedDistance
  showDistance.value = true
  loading.value = false
}

function sendToCalculate(): void {
  let pointA = geoInputA.value?.getPosition()
  if (pointA === null) {
    showDistance.value = false
  }
  let pointB = geoInputB.value?.getPosition()
  if (pointB === null) {
    showDistance.value = false
  }

  if (pointA === null || pointB === null) {
    return
  }

  loading.value = true
  showDistance.value = false
  distance.value = -1

  const params =
    `lat-a=${(pointA as GeoPoint).lat}` +
    `&lon-a=${(pointA as GeoPoint).lon}` +
    `&lat-b=${(pointB as GeoPoint).lat}` +
    `&lon-b=${(pointB as GeoPoint).lon}`

  const url = `/api/calculate.php?${params}`
  const request = new XMLHttpRequest()

  request.onerror = function () {
    this.abort()
    fatalError.value = true
  }
  request.onload = function () {
    if (this.status < 200 || this.status > 299) {
      this.abort()
      fatalError.value = true
    } else {
      displayDistans(this.responseText)
    }
  }

  request.open('GET', url, true)
  request.send()
}
</script>

<template>
  <div class="distance-calculator" v-show="!fatalError">
    <div><h2 class="title">Type the two points positions:</h2></div>

    <GeoInput ref="point-a" label-text="Point A" initial-form="d" />
    <GeoInput ref="point-b" label-text="Point B" initial-form="d" />

    <div class="button-container">
      <div v-show="loading" class="loading">
        <p>Calculating...</p>
      </div>

      <div v-show="!loading" class="action">
        <button @click="sendToCalculate">Calculate Distance</button>
      </div>
    </div>
    <div class="result-placeholder">
      <div v-show="showDistance" class="result">
        <div><strong>Distance</strong></div>
        <div><span>Meters:</span> {{ Math.round(distance) }}</div>
        <div><span>Kilometers:</span> {{ Math.round(distance / 1000) }}</div>
      </div>
    </div>
    <div class="info-note">
      <p>
        You can use <strong>d</strong>, <strong>D</strong>, or <strong>°</strong> for degrees;
        <strong>m</strong>, <strong>M</strong>, or <strong>"</strong> for minutes; and
        <strong>s</strong>, <strong>S</strong>, or <strong>'</strong> for seconds.
        <strong>Spaces are optional.</strong>
      </p>
    </div>
  </div>
  <div v-show="fatalError">
    <p>An error occurred. Please try again later.</p>
  </div>
</template>

<style scoped>
.distance-calculator {
  margin: 0 auto;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}
.button-container {
  min-height: 3rem;
}

.loading p {
  font-style: italic;
  color: #555;
  margin: 0;
}

button {
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  border: 1px solid #333;
  background-color: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

button:hover {
  background-color: #e0e0e0;
}

.result-placeholder {
  min-height: 4rem;
}

.result {
  margin-top: 1rem;
  text-align: center;
  font-size: 1rem;
}

.result span {
  font-weight: 600;
}
@media (max-width: 500px) {
  .title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    text-align: center;
  }
}
</style>
