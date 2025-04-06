<script setup>
  import { ref } from 'vue'
  import {formatCoordinate,parseCoordinate} from '@/models/utils.js'

  const props = defineProps({
    whichAxis: String,
    initialForm: String
  });

  let whichForm = props.initialForm;

  const whichAxis = props.whichAxis;
  const positionText = ref('');
  const displayError = ref(false);
  const displayEmpty = ref(false);
  const placeholderText = ref('');
  const DEGREE = String.fromCharCode(176);

  function setPlaceholder(newWhichForm){
    if(whichAxis == 'lat'){
      if(newWhichForm=='d'){
        placeholderText.value = `52.207465${DEGREE} N`;
      }else if(newWhichForm=='dm'){
        placeholderText.value = `52${DEGREE} 12.4479 N`;
      }else{
        placeholderText.value = `52${DEGREE} 12' 06.87" N`;
      }
    }else{
      if(newWhichForm=='d'){
        placeholderText.value = `20.915066${DEGREE} E`;
      }else if(newWhichForm=='dm'){
        placeholderText.value = `020${DEGREE} 54.904' E`;
      }else{
        placeholderText.value = `020${DEGREE} 54' 54.24" E`;
      }
    }
  }

  function getCoordinate() {

    let text = positionText.value.trim();

    if (text == ''){
      displayError.value = false;
      displayEmpty.value = true;
      return null
    }

    const coordinate = parseCoordinate(text, whichAxis, whichForm)

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

  function changeWhichForm(newwhichForm){
    setPlaceholder(newwhichForm);

    const oldwhichForm = whichForm;
    whichForm = newwhichForm;
    displayEmpty.value = false;
    displayError.value = false;

    let text = positionText.value.trim();
    if (text == '') return;

    const coordinate = parseCoordinate(text, whichAxis, oldwhichForm)
    if(coordinate == null) return;
    positionText.value = formatCoordinate(coordinate[0], whichAxis, newwhichForm)
  }

  setPlaceholder(whichForm);

  defineExpose({getCoordinate, changeWhichForm});

</script>

<template>
  <div class="input-container">
    <input
      @blur="getCoordinate(parse=true)"
      type="text"
      v-model="positionText"
      :placeholder="placeholderText"
      class="input-field"
    />
    <div class="error-message-box">
      <p v-show="displayError" class="error-text">The above is not a valid coordinate!</p>
      <p v-show="displayEmpty" class="error-text">Insert a coordinate!</p>
    </div>
  </div>
</template>

<style scoped>
.coordinate-container {
  margin: 0.75rem auto;
}

.input-field {
  width: 90%;
  padding: 8px 10px;
  font-size: 0.95rem;
  border: 1.5px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #007BFF;
  box-shadow: 0 0 3px rgba(0, 123, 255, 0.4);
}

.error-message-box {
  min-height: 20px;
  margin-top: 2px;
  margin-bottom: 2px;
}

.error-text {
  color: #d9534f;
  font-size: 0.85rem;
  margin: 0;
  transition: opacity 0.2s ease-in-out;
}
</style>
