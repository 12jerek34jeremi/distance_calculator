<script setup>
import { useTemplateRef } from 'vue'
  import GeoPoint from '@/models/geo_point.js'
  import GeoCoordinate from '@/components/GeoInput.vue'

  defineProps({
    labelText: String,
  });

  const latCom = useTemplateRef('lat');
  const lonCom = useTemplateRef('lon');

  function getPosition() {
    const lat = latCom.value.checkCoordinate();
    const lon = lonCom.value.checkCoordinate();

    if (isNaN(lat) || isNaN(lon)) {
      return null;
    }

    return new GeoPoint(lat, lon);
}

defineExpose({getPosition});

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