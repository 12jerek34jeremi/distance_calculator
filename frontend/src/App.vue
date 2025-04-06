<script setup>
import { useTemplateRef, ref} from 'vue'
import GeoPoint from '@/models/geo_point.js'
import GeoInput from '@/components/GeoInput.vue'

const geoInputA = useTemplateRef('point-a');
const geoInputB = useTemplateRef('point-b');
const showDistance = ref(false);
const loading = ref(false);
const distance = ref(0);


function displayDistans(responseText) {
  if(responseText == 'error'){console.log('error 1'); return;}
  let receivedDistance = parseInt(responseText);
  if(receivedDistance == NaN){console.log('error 2'); return;}
  
  distance.value = receivedDistance;
  showDistance.value = true;
  loading.value = false;
}

function sendToCalculate(){
  let pointA = geoInputA.value.getPosition()
  if(pointA === null){
    showDistance.value  = false;
  }
  let pointB = geoInputB.value.getPosition()
  if(pointB === null){
    showDistance.value  = false;
  }

  if(pointA === null || pointB === null){
    return;
  }

  loading.value = true;
  showDistance.value = false;
  distance.value = -1;

  const params = `lat-a=${pointA.lat}&lon-a=${pointA.lon}&lat-b=${pointB.lat}&lon-b=${pointB.lon}`
  const url = `/api/calculate.php?${params}`
  const request = new XMLHttpRequest();
  request.onload = function(){
    displayDistans(this.responseText);
  }
  request.open('GET', url, true);
  request.send();
}

</script>

<template>
  <div class="distance-calculator">
    <div><h2 class="title">Type the two points positions:</h2></div>

    <GeoInput ref="point-a" label-text="Point A" initial-form="d" />
    <GeoInput ref="point-b" label-text="Point B" initial-form="d" />

    <div class="buttonContainer">
      <div v-show="loading" class="loading">
        <p>Calculating...</p>
      </div>

      <div v-show="!loading" class="action">
        <button @click="sendToCalculate">Calculate Distance</button>
      </div>
    </div>

    <div v-show="showDistance" class="result">
      <div><strong>Distance</strong></div>
      <div><span>Meters:</span> {{ Math.round(distance) }}</div>
      <div><span>Kilometers:</span> {{ Math.round(distance / 1000) }}</div>
    </div>
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
.newDiv {
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
  font-size: 1.0rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}
}
</style>

