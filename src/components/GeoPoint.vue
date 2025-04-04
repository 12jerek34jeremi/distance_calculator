<script setup>
  import { ref } from 'vue'
  import Coordinate from '@/models/coordinate.js'

  defineProps({
    labelText: String,
  })

  const positionSN = ref('')
  const positionEW = ref('')
  const displayErrorSN = ref(false)
  const displayErrorEW = ref(false)

  function parseCordinate(which) {
    console.log("Entered", which)

    let posRef;
    let displayErrorRef;
    let text;
    let regEx;
    if (which.toUpperCase() == 'EW'){
      text = positionEW.value.trim()
      regEx = /^(\d{1,2})[.,](\d+)\s*([eEwW])$/
      posRef = positionEW
      displayErrorRef = displayErrorEW
    }else{
      text = positionSN.value.trim()
      regEx = /^(\d{1,2})[.,](\d+)\s*([sSnN])$/
      posRef = positionSN
      displayErrorRef = displayErrorSN
    }

    const match = text.match(regEx);

    if (match) { 
      displayErrorRef.value = false
      const integerPart = match[1];
      const decimalPart = match[2];
      const direction = match[3].toUpperCase();
      posRef.value = `${integerPart}.${decimalPart} ${direction}`;
    } else {
      displayErrorRef.value = true
    }
  }

  function getPosition() {
    const snMatch = positionSN.value.trim().match(/^(\d{1,2})[.,](\d+)\s*([sSnN])$/);
    const ewMatch = positionEW.value.trim().match(/^(\d{1,2})[.,](\d+)\s*([eEwW])$/);

    if (!snMatch || !ewMatch) {
      return null;
    }

    const nsValue = parseFloat(`${snMatch[1]}.${snMatch[2]}`);
    const nsWhich = snMatch[3].toUpperCase();
    const lat = nsWhich === 'N' ? nsValue : -nsValue;

    const ewValue = parseFloat(`${ewMatch[1]}.${ewMatch[2]}`);
    const ewWhich = ewMatch[3].toUpperCase();
    const lon = ewWhich === 'E' ? ewValue : -ewValue;

    return new Coordinate(lat, lon);
}

defineExpose({getPosition})

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
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>