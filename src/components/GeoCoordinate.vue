<script setup>
  import { ref } from 'vue'
  import {formatCoordinate,parseCoordinate} from '@/models/utils.js'

  const props = defineProps({
    whichAxis: String,
  });

  let form = 'd';

  const whichAxis = props.whichAxis;
  const positionText = ref('');
  const displayError = ref(false);
  const displayEmpty = ref(false);


  function getCoordinate() {
    let text = positionText.value.trim();

    if (text == ''){
      displayError.value = false;
      displayEmpty.value = true;
      return null
    }

    const coordinate = parseCoordinate(text, whichAxis, form)

    console.log('coordinate', coordinate)

    if (coordinate == null){
      displayError.value = true;
      displayEmpty.value = false;
      return null;
    }

    displayError.value = false;
    displayEmpty.value = false;
    positionText.value = coordinate[1];

    return coordinate[0];
  }

  function changeForm(newForm){
    const oldForm = form;
    form = newForm;
    displayEmpty.value = false;
    displayError.value = false;

    let text = positionText.value.trim();
    if (text == '') return;

    const coordinate = parseCoordinate(text, whichAxis, oldForm)
    if(coordinate == null) return;
    positionText.value = formatCoordinate(coordinate[0], whichAxis, newForm)
  }

defineExpose({getCoordinate, changeForm});

</script>

<template>
  <div>
    <div>
      <div>
        <input
          @blur="getCoordinate(parse=true)"
          type="text"
          v-model="positionText"
          :placeholder="(whichAxis == 'lat') ? '52.207465 N' : '20.915066 E'"
        />
      </div>
      <div>
        <span v-show="displayError">The above is not valid cordinate!</span>
        <span v-show="displayEmpty">Insert a cordinate!</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>