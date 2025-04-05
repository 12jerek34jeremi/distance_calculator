<script setup>
  import { ref } from 'vue'

  const props = defineProps({
    whichAxis: String,
  });


  const whichAxis = props.whichAxis;
  const regEx = (whichAxis == 'lat') ? 
      /^(\d{1,2})(?:[.,](\d+))?\s*([sSnN])$/ : 
      /^(\d{1,3})(?:[.,](\d+))?\s*([eEwW])$/;
  const positionText = ref('');
  const displayError = ref(false);
  const displayEmpty = ref(false);

  function checkCoordinate(parse=true) {
    let text = positionText.value.trim();
    if (text == ''){
      displayError.value = false;
      displayEmpty.value = true;
      return null
    }
    displayEmpty.value = false;

    const match = text.match(regEx);
    if (match === null){
      displayError.value = true;
      return null
    }
    displayError.value = false;

    const degrees = match[1];
    const fraction = match[2] ?? '0';
    const sense = match[3].toUpperCase();

    positionText.value = `${degrees}.${fraction} ${sense}`;

    if (parse) {
      const absValue = parseFloat(`${degrees}.${fraction}`);
      return (sense == 'N' || sense == 'E') ? absValue : -absValue;
    } else {
      return null;
    }
  }

defineExpose({checkCoordinate});

</script>

<template>
  <div>
    <div>
      <div>
        <input
          @blur="checkCoordinate(parse=true)"
          type="text"
          v-model="positionText"
          :placeholder="(whichAxis == 'lat') ? '52.2074648 N' : '20.915066 E'"
        />
      </div>
      <div>
        <span v-show="displayError">The above is not valid cordinate!</span>
        <span v-show="displayEmpty">Cordinate is empty!</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>