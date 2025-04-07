<!--
  GeoInput.vue

  A composite Vue component for capturing a full geographic point (latitude and longitude) using two
  `GeoCoordinate` inputs. Provides format selection radio buttons to switch between coordinate
  formats. Possible coordinates formats:
    - 'd'   : Decimal degrees (e.g., "45.1234N" or "45,1234 n")
    - 'dm'  : Degrees and decimal minutes (e.g., "45D07.40'N")
    - 'dms' : Degrees, minutes, and decimal seconds (e.g., "45D 07M 24.4S")

  Props:
  - labelText (String): Label displayed alongside the coordinate input group. (like PointA or
    PointB)
  - initialForm (String): Initial format to be used for both latitude and longitude inputs.

  Public Methods (via defineExpose):
  - getPosition(): Returns a `GeoPoint` object containing parsed latitude and longitude values, or
                   `null` if either input is empty or invalid.
-->


<script setup>
import { ref, useTemplateRef, watch } from 'vue'
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

  if (lat === null || lon===null) {
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

defineExpose({ getPosition });

</script>

<template>
  <div class="coordinate-group">
    <div class="form-selector">
      <label>
        <input type="radio" value="d" v-model="whichForm" />
        d
      </label>
      <label>
        <input type="radio" value="dm" v-model="whichForm" />
        dm
      </label>
      <label>
        <input type="radio" value="dms" v-model="whichForm" />
        dms
      </label>
    </div>

    <div class="coordinate-row">
      <div class="coordinate-label">
        <label>{{ labelText }}:</label>
      </div>
      <GeoCoordinate ref="lat" which-axis="lat" :initial-form="props.initialForm" />
      <GeoCoordinate ref="lon" which-axis="lon" :initial-form="props.initialForm" />
    </div>
  </div>
</template>

<style scoped>
.coordinate-group {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.5rem;
  display: inline-block;
  margin: 0.2rem auto;
  background-color: #fafafa;
}

.form-selector {
  display: flex;
  justify-content: center;
  flex-direction: row;
  margin-bottom: 1rem;
}

.form-selector label {
  display: inline-flex;
  font-size: 0.9rem;
  cursor: pointer;
  color: #333;
  margin: 0;
  gap: 0;
  padding: 0 0.2rem 0.2rem;
  border-right: 1px solid black;
}

.form-selector label:last-child {
  border-right: none;
}

.coordinate-row {
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.coordinate-label {
  font-weight: 600;
  color: #444;
}

@media (min-width: 768px) {
  .coordinate-row {
    flex-direction: row;
    gap: 0.25rem;
    align-items: baseline;
  }

  .coordinate-label {
    margin-right: 0.25rem;
    text-align: right;
    white-space: nowrap;
  }
}
</style>
