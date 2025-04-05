<script setup>
import { useTemplateRef, ref } from 'vue'
import GeoPoint from '@/models/geo_point.js'
import TemporaryCom from '@/components/TemporaryCom.vue'

const geoInputA = useTemplateRef('point-a')
const geoInputB = useTemplateRef('point-b')
const showDistance = ref(false)
const distance = ref(0)

function calculateDistance(){
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

  distance.value = GeoPoint.calculateDistance(pointB, pointA);
  showDistance.value  = true;
}

</script>

<template>
  <div><span>Type the two points positions:</span></div>
  <TemporaryCom ref="point-a" label-text="Point A"></TemporaryCom>
  <TemporaryCom ref="point-b" label-text="Point B"></TemporaryCom>
  <div><button @click="calculateDistance">Calculate Distans</button></div>
  <div v-show="showDistance">
    <div><span>Distance</span></div>
    <div><span>meters: </span>{{Math.round(distance)}}</div>
    <div><span>kilometers: </span>{{ Math.round(distance/1000)}}</div>
  </div>
</template>

<style scoped>
</style>
