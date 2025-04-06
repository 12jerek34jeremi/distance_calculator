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
  <div><span>Type the two points positions:</span></div>
  <GeoInput ref="point-a" label-text="Point A" initial-form="d"></GeoInput>
  <GeoInput ref="point-b" label-text="Point B" initial-form="d"></GeoInput>
  <div  v-show="loading">
    <p>Calculating...</p>
  </div>
  <div v-show="!loading">
    <button @click="sendToCalculate">Calculate Distans</button>
  </div>
  <div v-show="showDistance">
    <div><span>Distance</span></div>
    <div><span>meters: </span>{{Math.round(distance)}}</div>
    <div><span>kilometers: </span>{{ Math.round(distance/1000)}}</div>
  </div>
</template>

<style scoped>
</style>
