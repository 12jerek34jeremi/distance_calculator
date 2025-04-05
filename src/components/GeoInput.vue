<script setup>
import { useTemplateRef } from 'vue'
  import GeoPoint from '@/models/geo_point.js'
  import GeoCoordinate from '@/components/GeoCoordinate.vue'

  defineProps({
    labelText: String,
  });

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

  function changeForm(newForm) {
    latCom.value.changeForm(newForm);
    lonCom.value.changeForm(newForm);
  }

  defineExpose({getPosition, changeForm});

</script>

<template>
  <div>
    <div>
      <div>
      <label>{{labelText}}:</label>
      </div>
      <GeoCoordinate ref="lat" which-axis="lat"/>
      <GeoCoordinate ref="lon" which-axis="lon"/>
    </div>
  </div>
</template>

<style scoped>
</style>