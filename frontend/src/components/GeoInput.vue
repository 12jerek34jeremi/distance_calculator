<script setup>
import {ref, useTemplateRef, watch} from 'vue'
  import GeoPoint from '@/models/geo_point.js'
  import GeoCoordinate from '@/components/GeoCoordinate.vue'

  const props = defineProps({
    labelText: String,
    initialForm: String
  });

  const whichForm = ref(props.initialForm);

  const latCom = useTemplateRef('lat');
  const lonCom = useTemplateRef('lon');

  function getPosition() {
    const lat = latCom.value.getCoordinate();
    const lon = lonCom.value.getCoordinate();

    if (isNaN(lat) || isNaN(lon)) {
      return null;
    }

    return new GeoPoint(lat, lon);
  }

  watch(
    whichForm,
    (newWhichForm) => {
      latCom.value.changeWhichForm(newWhichForm);
      lonCom.value.changeWhichForm(newWhichForm);
    }
  )

  defineExpose({getPosition});

</script>

<template>
  <div>
    <div>
      <div>
        <label>{{labelText}}:</label>
      </div>
      <div>
        <label for="one">deg</label>
        <input type="radio" id="raio-d" value="d" v-model="whichForm" />

        <label for="one">deg-min</label>
        <input type="radio" id="raio-dms" value="dm" v-model="whichForm" />

        <label for="one">deg-min-sec</label>
        <input type="radio" id="raio-dms" value="dms" v-model="whichForm" />
      </div>
      <GeoCoordinate ref="lat" which-axis="lat" :initial-form="props.initialForm"/>
      <GeoCoordinate ref="lon" which-axis="lon" :initial-form="props.initialForm"/>
    </div>
  </div>
</template>

<style scoped>
</style>