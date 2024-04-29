import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

const PORT = 3000;
const app = express();
  dotenv.config();
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  const db = client.db('words');
  const wordlist = db.collection("wordlist");


app.use((req, res, next) => {
  console.log(req);
  console.log(`Method: ${req.method} URL: ${req.url}`);
  if (req.body) {
  console.log(`Body: ${req.body}`);
  }
  next();
});

app.use(express.json());
// serve static files for Vue.js frontend
app.use(express.static('../dist'));

app.get("/word/random", async (req, res) => {
  try {
  if (req.method === "GET") {
    const word = await wordlist.aggregate([
       { $sample: { size: 1 } }
     ]).toArray();
     res.json(word);
     console.log(`Random Word: `, word);
   } else {
     res.status(405).json({ message: "Method Not Allowed" });
   }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get("/check-word/:word", async(req, res) => {
  try {
    if (req.method === "GET") {
    const word = req.params.word;
    console.log(`Word: `, word);
    const wordCheck = await wordlist.findOne({word: word});
    if (wordCheck) {
      res.status(200).json({ message: "Word Found" });
    } else if (!wordCheck) {
      res.status(404).json({ message: "Word Not Found" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get("/word/:difficulty", async(req, res) => {
  try {
  if (req.method === "GET") {
  const difficulty = req.params.difficulty;
  console.log(`Difficulty: `, difficulty);
  if (difficulty === "Easy") {
  const easyWord =  await wordlist.aggregate([
    { $match: { $expr: { $lt: [{ $strLenCP: "$word" }, 5 ]} } },
    { $sample: { size: 1 } }
  ]).toArray();
  res.json(easyWord);
  console.log(`Easy Word: `, easyWord);
  } else if (difficulty === "Normal") {
  const normalWord = await wordlist.aggregate([
    { $match: { $expr: { $eq: [{ $strLenCP: "$word" }, 5] } } }, { $sample: { size: 1 } }] ).toArray();
  res.json(normalWord);
  console.log(`Normal Word: `, normalWord);
  } else if (difficulty === "Hard") {
    const hardWord = await wordlist.aggregate([
    { $match: { $expr: { $and: [{ $gt: [{ $strLenCP: "$word" }, 5] }, { $lt: [{ $strLenCP: "$word" }, 8] }] } } },
    { $sample: { size: 1 } }
  ]).toArray();
    res.json(hardWord);
    console.log(`Hard Word: `, hardWord);
  } else if (difficulty === "Insane") {
    const insaneWord = await wordlist.aggregate([
      { $match: { $expr: { $gt: [{ $strLenCP: "$word" }, 7] } } },
      { $sample: { size: 1 } }
    ]).toArray();
    res.json(insaneWord);
    console.log(`Insane Word: `, insaneWord);
  }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });  
  }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  });
  app.put("/keep-word/:word", async(req, res) => {
    try {
      if (req.method === "PUT") {
      const word = req.params.word;
      console.log(`Word: `, word);
      const wordUpdate = await wordlist.updateOne({word: word}, {$set: {keep: true}});
      if (wordUpdate) {
        res.status(200).json({ message: "Word Updated" });
      } else if (!wordUpdate) {
        res.status(404).json({ message: "Word Not Found" });
      }
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    });

  app.delete("/delete-word/:word", async(req, res) => {
    try {
      if (req.method === "DELETE") {
      const word = req.params.word;
      console.log(`Word: `, word);
      const wordDelete = await wordlist.deleteOne({word: word});
      if (wordDelete) {
        res.status(200).json({ message: "Word Deleted" });
      } else if (!wordDelete) {
        res.status(404).json({ message: "Word Not Found" });
      }
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});