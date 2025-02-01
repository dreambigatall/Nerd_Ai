const mongoose = require('mongoose');
const express = require('express');
const ImageKit = require('imagekit');
const dotenv = require('dotenv');
const cors= require('cors');
const Chat = require('./models/chat');
const UserChats = require('./models/userChat');
const {clerkMiddleware}= require('@clerk/express');
// Load environment variables from .env file
dotenv.config();
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
app.use(cors({
    origin:process.env.CLIENT_URL,
    methods:["GET","POST", "PUT", "DELETE"],
    credentials:true
}));

const connect = async () =>{
    try{
        await mongoose.connect(process.env.DATABASE,{
            useUnifiedTopology:true,
        });
        console.log("Connected to MongoDB");
    }catch(err){
        console.error("Error connecting to MongoDB:", err);
    }
}

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});



app.post("/api/chats",clerkMiddleware(), async (req, res) => {
  const {userId} = req.auth;
  const { text } = req.body;

  try {
    // CREATE A NEW CHAT
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });

    const savedChat = await newChat.save();

    // CHECK IF THE USERCHATS EXISTS
    const userChats = await UserChats.find({ userId: userId });

    // IF DOESN'T EXIST CREATE A NEW ONE AND ADD THE CHAT IN THE CHATS ARRAY
    if (!userChats.length) {
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
          },
        ],
      });

      await newUserChats.save();
    } else {
      // IF EXISTS, PUSH THE CHAT TO THE EXISTING ARRAY
      await UserChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );

      res.status(201).send(newChat._id);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating chat!");
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connect();
});