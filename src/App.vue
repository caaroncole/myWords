<script setup>
import { ref } from 'vue';
import SelectDifficulty from './components/SelectDifficulty.vue';
import HeaderComponent from './components/HeaderComponent.vue';
import GuessWord from './components/GuessWord.vue';
import ShowFooter from './components/ShowFooter.vue';
import ShowKeyboard from './components/ShowKeyboard.vue';


const guessCount = ref(0);
const userMessage = ref("");
const word = ref("");
const status = ref('');
const gameBegin = (selectedWord) => {
  word.value = selectedWord;
}

const showGuessCount = (count) => {
 console.log(`count: `, count);
 guessCount.value = count;
}
const showMessage = (message) => {
  userMessage.value = message;
}
const recordStatus = (state) => {
  console.log(`status: `, state);
  status.value = state;
}

</script>


<template>
  <header>
    <HeaderComponent/>
  </header>
  <main>
    <SelectDifficulty v-if="!word" @game-start="gameBegin" />
    <div v-if="word">
    <GuessWord :word="word" @user-message="showMessage" @guessCount="showGuessCount" @status="recordStatus" />
    <ShowKeyboard />
    </div>
  </main>

  <footer>
    <ShowFooter :word="word" :guessCount="guessCount" :message="userMessage" :status="status" />
  </footer>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #1dc041;
  background-color: #4f5a64;
  margin-top: 60px;
}
footer > p {
  background-color: blue;
}
</style>
