<script setup>
  import { ref } from 'vue'
  import Coordinate from '@/models/coordinate.js'

  defineProps({
    labelText: String,
  });

  const positionSN = ref('');
  const positionEW = ref('');
  const displayErrorSN = ref(false);
  const displayErrorEW = ref(false);
  const displayEmptySN = ref(false);
  const displayEmptyEW = ref(false);

  function parseCordinate(which) {
    console.log("Entered", which);

    let posRef;
    let displayErrorRef;
    let displayEmptyRef;
    let text;
    let regEx;
    if (which.toUpperCase() == 'EW'){
      text = positionEW.value.trim();
      regEx = /^(\d{1,2})[.,](\d+)\s*([eEwW])$/;
      posRef = positionEW;
      displayErrorRef = displayErrorEW;
      displayEmptyRef = displayEmptyEW;
    }else{
      text = positionSN.value.trim();
      regEx = /^(\d{1,2})[.,](\d+)\s*([sSnN])$/;
      posRef = positionSN;
      displayErrorRef = displayErrorSN;
      displayEmptyRef = displayEmptySN;
    }

    if (text == ''){
      displayErrorRef.value = false;
      displayEmptyRef.value = false;
      return;
    }

    const match = text.match(regEx);

    if (match) { 
      displayErrorRef.value = false;
      const integerPart = match[1];
      const decimalPart = match[2];
      const direction = match[3].toUpperCase();
      posRef.value = `${integerPart}.${decimalPart} ${direction}`;
    } else {
      displayErrorRef.value = true;
    }
  }

  function getPosition() {
    let returnNull = false;
    let snMatch;
    let ewMatch;


    let textSN = positionSN.value.trim();
    if (textSN == ''){
      displayErrorSN.value = false;
      displayEmptySN.value = true;
      returnNull = true;
    }else{
      snMatch = textSN.match(/^(\d{1,2})[.,](\d+)\s*([sSnN])$/);
      if (snMatch === null){
        displayErrorSN.value = true;
        displayEmptySN.value = false;
        returnNull = true;
      }
    }


    let textEW = positionEW.value.trim();
    if (textEW == ''){
      displayErrorEW.value = false;
      displayEmptyEW.value = true;
      returnNull = true;
    }else{
      ewMatch = textEW.match(/^(\d{1,2})[.,](\d+)\s*([eEwW])$/);
      if (ewMatch === null){
        displayErrorEW.value = true;
        displayEmptyEW.value = false;
        returnNull = true;
      }
    }


    if(returnNull){return null;}


    const nsValue = parseFloat(`${snMatch[1]}.${snMatch[2]}`);
    const nsWhich = snMatch[3].toUpperCase();
    const lat = nsWhich === 'N' ? nsValue : -nsValue;

    const ewValue = parseFloat(`${ewMatch[1]}.${ewMatch[2]}`);
    const ewWhich = ewMatch[3].toUpperCase();
    const lon = ewWhich === 'E' ? ewValue : -ewValue;

    return new Coordinate(lat, lon);
}

defineExpose({getPosition});

</script>

<template>
  <div>
    <label>{{labelText}}:</label>
    <div>
      <div>
        <input
          @blur="parseCordinate('SN')"
          type="text"
          v-model="positionSN"
          placeholder="43.563 N" 
        />
      </div>
      <div>
        <span v-show="displayErrorSN">The above is not valid cordinate!</span>
        <span v-show="displayEmptySN">Cordinate is empty!</span>
      </div>
    </div>
    <div>
      <div>
        <input
          @blur="parseCordinate('EW')"
          type="text"
          v-model="positionEW"
          placeholder="43.563 N" 
        />
      </div>
      <div>
        <span v-show="displayErrorEW">The above is not valid cordinate!</span>
        <span v-show="displayEmptySN">Cordinate is empty!</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>