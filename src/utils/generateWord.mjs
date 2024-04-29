export async function generateWord(selectedDifficulty) {
  try {
    const response = await fetch(`/word/${selectedDifficulty}`);
      if (response.ok) {
        const data = await response.json();
        const word = data[0].word;
        return word;
      } else {
        console.log("Failed to fetch word");
      } 
    } catch (error) {
      console.error(error);
    }
    }