<script setup>
import { ref, defineEmits  } from 'vue';
import { generateWord } from "../utils/generateWord.mjs";
const difficulties = ["Random", "Easy", "Normal", "Hard", "Insane"];
const selectedDifficulty = ref(null);
const emit = defineEmits('game-start');


const word = ref("");

async function startGame() {
  try {
    word.value = await generateWord(selectedDifficulty.value);
    emit('game-start', word.value);
  } catch (error) {
    console.error(error);
  }
}

</script>

<template>
  <div class="selectDifficulty">
    <h2>Select a difficulty: </h2>
    <button @click="selectedDifficulty = difficulty" :class="{selected: selectedDifficulty === difficulty }" v-for="difficulty in difficulties" :key="difficulty" >{{difficulty}}</button>
    <div>
    <button @click="startGame">Start Game</button>
    </div>
  </div>
</template>


<style scoped>
  .selectDifficulty {
    color: #1dc041;
    background-color: #252a5a;
  }
  button {
    background-color: #252a5a;
    color: #1dc041;
    border: 1px solid #1dc041;
    border-radius: 5px;
    padding: 10px;
    margin: 10px;
    cursor: pointer;
    
  }
  button:hover {
    transition: all 0.3s ease;
    background-color: #1dc041;
    color: #252a5a;

  }
  .selected {
    background-color: #1dc041;
    color: #252a5a;
  }

  @media only screen and (max-width: 600px) {
    .selectDifficulty {
      display: flex;
      flex-direction: column;
    }

  }
</style>