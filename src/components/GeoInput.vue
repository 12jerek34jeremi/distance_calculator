<script setup>
import {ref, useTemplateRef, watch} from 'vue'
  import GeoPoint from '@/models/geo_point.js'
  import GeoCoordinate from '@/components/GeoCoordinate.vue'

  defineProps({
    labelText: String,
  });

  const whichForm = ref('d');

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
      <GeoCoordinate ref="lat" which-axis="lat"/>
      <GeoCoordinate ref="lon" which-axis="lon"/>
    </div>
  </div>
</template>

<style scoped>
</style>