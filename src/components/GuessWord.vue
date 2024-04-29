<script setup>
import { defineProps, ref, defineEmits, onMounted } from 'vue';

const props = defineProps({
  word: String
});
const emit = defineEmits(['user-message', 'guessCount', 'status']);
const guessCount = ref(0);
const guess = ref(Array(props.word.length).fill(""));
const correctGuesses = ref(Array(props.word.length).fill(""));
onMounted(() => {
  emit('guessCount', guessCount.value);
  console.log(props.word);
})

async function handleInput(event, index) {
  guess.value[index] = event.target.value;
  if (event.inputType === "insertText") {
    if (event.target.nextElementSibling) {
      event.target.nextElementSibling.focus();
    }
  }
}
async function handleKeydown(event) {
  if (event.key === "Backspace" && event.target.value === "") {
    if (event.target.previousElementSibling) {
      event.target.previousElementSibling.focus();
    }
  }
  if (event.key === "Enter") {
    console.log(event.target);
    if (await (checkIfWord())) {
      checkCorrectLetters();
      endOfRoundCheck();
    } else {
      event.target.focus();
    }
    
  }
}
async function checkIfWord() {
  emit('user-message', "");
  const guessString = guess.value.join("");
  if (guessString.length === props.word.length) {
    console.log(`Length check passed`);
    const response = await fetch(`/check-word/${guessString}`);
    const data = await response.json();
    if (response.status === 200) {
      console.log(`Check if word passed: `, data.message);
      console.log(`GuessString: `, guessString);
      return true
      

    } else if (response.status === 404) {
      emit('user-message', "Word not in list");
      console.log(`word not in list: `, data);
      console.log(`Guess: `, guessString);
      return false
    }
    } else {
      console.log("Length check failed, word not long enough");
      emit('user-message', "Word not long enough");
      return false
    }
}

function checkCorrectLetters() {
  for (const [index, letter] of guess.value.entries()) {
    if (props.word[index] === letter) {
      correctGuesses.value[index] = letter;
      

    }
}
function endOfRoundCheck() {
  guessCount.value += 1;
  if (correctGuesses.value.join("") === props.word) {
    emit('status', "won"); 
    emit('user-message', "You won!");
  } else if (guessCount.value > 5) {
    emit('status', "lost");
    emit('user-message', "You lost!");
  } else {
    emit('status', "playing");
  }
  guess.value = Array(props.word.length).fill("");
  emit('guessCount', guessCount.value);
}


</script>

<template>
  <div class="guessWord">
      <div class="inputFields" v-for="(row, rowIndex) in 6" :key="rowIndex" :class="[{currentRow: rowIndex === guessCount }]">
      <input type="text"  v-for="(letter, colIndex) in guess" :key="colIndex" maxlength="1" 
      :disabled="rowIndex !== guessCount" :id="'input' + rowIndex + colIndex"
      @keydown="handleKeydown($event)" @input="handleInput($event, colIndex)"  
       /> 
      </div>
      <div class="keyboardArea">
        <ShowKeyboard />
      </div>
      <button @click="checkIfWord()" v-if="guess.join('').length === props.word.length">Check</button>
      <div class="currentGuesses">
        <p>{{ guess.join('') }}</p>
      </div>
  </div>
</template>

<style scoped>
.guessWord {
  color: #1dc041;
  background-color: #252a5a;
}
.inputFields {
  justify-content: center;
  align-items: center;
}

.inputFields input {
  width: 50px;
  height: 50px;
  margin: 10px;
  text-align: center;
  font-size: 24px;
  border: 1px solid #262b27;
  border-radius: 5px;
  text-transform: capitalize;
  text-shadow: 0 0 3px #bfc4c0;
  font-weight: bold;
}

.correct {
  background-color: #1dc041;
  color: #252a5a;
}
.present {
  background-color: #f1c40f;
  color: #252a5a;
}
.absent {
  background-color: #79281f;
  color: #252a5a;
}
.currentGuesses {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>