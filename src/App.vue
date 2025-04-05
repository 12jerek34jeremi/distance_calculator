<script setup>
import { useTemplateRef, ref, watch} from 'vue'
import GeoPoint from '@/models/geo_point.js'
import GeoInput from '@/components/GeoInput.vue'

const geoInputA = useTemplateRef('point-a')
const geoInputB = useTemplateRef('point-b')
const showDistance = ref(false)
const distance = ref(0)
const form = ref('d')

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


watch(
  form,
  (newForm) => {
    geoInputA.value.changeForm(newForm);
    geoInputB.value.changeForm(newForm);
  }
)

</script>

<template>
  <div><span>Type the two points positions:</span></div>
  <div>
    <div><p>Picked: {{ form }}</p></div>

    <label for="one">deg</label>
    <input type="radio" id="raio-d" value="d" v-model="form" />

    <label for="one">deg-min</label>
    <input type="radio" id="raio-dms" value="dm" v-model="form" />

    <label for="one">deg-min-sec</label>
    <input type="radio" id="raio-dms" value="dms" v-model="form" />
  </div>

  <GeoInput ref="point-a" label-text="Point A"></GeoInput>
  <GeoInput ref="point-b" label-text="Point B"></GeoInput>
  <div><button @click="calculateDistance">Calculate Distans</button></div>
  <div v-show="showDistance">
    <div><span>Distance</span></div>
    <div><span>meters: </span>{{Math.round(distance)}}</div>
    <div><span>kilometers: </span>{{ Math.round(distance/1000)}}</div>
  </div>
</template>

<style scoped>
</style>
