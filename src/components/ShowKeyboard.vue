<script setup>
const keys = [["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
["A", "S", "D", "F", "G", "H", "J", "K", "L"],
["Z", "X", "C", "V", "B", "N", "M"]];

</script>

<template>
  <div class="showKeyboard">
    <div v-for="row in keys" :key="row">
      <button v-for="key in row" :key="key">{{ key }}</button>
    </div>
  </div>
</template>

<style scoped>
.showKeyboard {
  color: #1dc041;
  background-color: #252a5a;
}
</style>