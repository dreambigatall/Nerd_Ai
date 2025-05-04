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



app.post("/api/chats", clerkMiddleware(), async (req, res) => {
  const { userId } = req.auth;
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

    if (!userChats.length) {
      // Create new UserChats document and add the chat
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
      // Push the chat into the existing UserChats document
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
    }

    app.put("/api/chats/:id", clerkMiddleware(), async (req, res) => {
      const {userId} = req.auth;
    
      const { question, answer, img } = req.body;
    
      const newItems = [
        ...(question
          ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
          : []),
        { role: "model", parts: [{ text: answer }] },
      ];
    
      try {
        const updatedChat = await Chat.updateOne(
          { _id: req.params.id, userId },
          {
            $push: {
              history: {
                $each: newItems,
              },
            },
          }
        );
        res.status(200).send(updatedChat);
      } catch (err) {
        console.log(err);
        res.status(500).send("Error adding conversation!");
      }
    });


    // Send the response with the chat ID regardless of branch
    res.status(201).json({ chatId: savedChat._id });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating chat!");
  }
});



app.get("/api/userchats", clerkMiddleware(), async (req, res) => {
  const { userId } = req.auth;

  try {
      const userChats = await UserChats.find({ userId });

      if (userChats.length === 0) {
          return res.status(404).json({ error: "No chats found for this user" });
      }

      res.status(200).json({ chats: userChats[0].chats });
  } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Error fetching user chats!" });
  }
});

app.get("/api/chats/:id", clerkMiddleware(), async (req, res) => {
  const {userId} = req.auth;

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });

    res.status(200).send(chat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching chat!");
  }
});
  
app.get('/', (req, res) => {
  res.send('API is running...');
});




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connect();
});