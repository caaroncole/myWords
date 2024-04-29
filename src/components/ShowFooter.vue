<script setup>
import { defineProps, ref } from 'vue';
const props = defineProps({
  message: String,
  guessCount: String,
  word: String,
  status: String
});
const requestDefinition = ref(false);
const definition = ref("");

function resetGame() {
  window.location.reload();
}
async function fetchDefinition(word) {
  try{
  
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (response.status === 200) {
    const data = await response.json();
    requestDefinition.value = true;
    console.log(data);
    definition.value = data[0].meanings[0].definitions[0].definition;
    } else if (response.status === 404) {
      definition.value = "No definition found";
    }

  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div class="showFooter">
    <div class="userMessage" v-if="props.status === 'playing'">
      <h4>Tries: {{ props.guessCount }} </h4>
      <h5>{{ props.message }}</h5>
    </div>
    <div class="gameOver" v-if="props.status === 'lost' || props.status === 'won'">
      <h5 > {{ props.message }}  The word was: {{ props.word }}. </h5>
      <div class="endGameButtons">
        <button @click="resetGame">Play Again</button>
        <button @click="fetchDefinition(props.word)">Show definition</button>
      </div>
      <p v-if="requestDefinition">Definition: {{ definition }}</p>
    </div>
  </div>
</template>

<style scoped>
.showMessage {
  color: #1dc041;
  background-color: #252a5a;

}



</style>