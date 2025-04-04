<script setup>
import { useTemplateRef, ref } from 'vue'
import Coordinate from '@/models/coordinate.js'
import GeoPoint from './components/GeoPoint.vue'

const pointA = useTemplateRef('point-a')
const pointB = useTemplateRef('point-b')
const showDistance = ref(false)
const distance = ref(0)

function calculateDistance(){
  let coordinateA = pointA.value.getPosition()
  if(coordinateA == null){
    showDistance.value  = false;
    console.log('A is null')
    return;
  }
  let coordinateB = pointB.value.getPosition()
  if(coordinateB == null){
    showDistance.value  = false;
    console.log('B is null')
    return;
  }
  distance.value = Coordinate.calculateDistance(coordinateA, coordinateB);
  console.log(distance.value)
  console.log('dziala')
  showDistance.value  = true;
}

</script>

<template>
  <div><span>Type the two points positions:</span></div>
  <GeoPoint ref="point-a" label-text="Point A"></GeoPoint>
  <GeoPoint ref="point-b" label-text="Point B"></GeoPoint>
  <div><button @click="calculateDistance">Calculate Distans</button></div>
  <div v-show="showDistance">
    <div><span>Distance</span></div>
    <div><span>meters: </span>{{Math.round(distance)}}</div>
    <div><span>kilometers: </span>{{ Math.round(distance/1000)}}</div>
  </div>
</template>

<style scoped>
</style>
