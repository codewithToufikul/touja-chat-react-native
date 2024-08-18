const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const multer = require("multer"); // Add this line to require multer
const port = 5000;

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

mongoose
  .connect(
    "mongodb+srv://touja-chat:WI9jTyZ5dAu0vpjr@cluster0.ivo4yuq.mongodb.net/"
  )
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.log("Error connecting to the database!", err);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("hello");
});

const User = require("./models/user");
const Message = require("./models/message");

// endpoint for registration of the user

app.post("/users", (req, res) => {
  console.log("Request received at /register"); // Log for debugging
  const { name, email, password, image } = req.body;
  const newUser = new User({ name, email, password, image });
  newUser
    .save()
    .then(() => {
      res.status(200).json({ message: "User registered successfully" });
    })
    .catch((err) => {
      console.error("Error registering user:", err);
      res.status(500).json({ message: "Error registering the user!" });
    });
});

// jwt

const createToken = (userId) => {
  const payload = {
    userId: userId,
  };
  const token = jwt.sign(payload, "Q$r2K6W8n!jCW%Zk", { expiresIn: "10h" });
  return token;
};

// login verify endpoint

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(404)
      .json({ message: "Email and the password are required" });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.password !== password) {
        return res.status(404).json({ message: "Invalid Password!" });
      }
      const objectId = user.id;
      const idString = objectId.toString();
      const token = createToken(idString);
      res.status(200).json({ token });
    })
    .catch((error) => {
      console.log("error in finding the user", error);
      res.status(500).json({ message: "Internal server Error!" });
    });
});

// get current logged user

app.get("/userss/:userId", (req, res) => {
  const loggedInUserId = req.params.userId;
  User.find({ _id: { $ne: loggedInUserId } })
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.log("Error retrieving users", err);
      res.status(500).json({ message: "Error retrieving users" });
    });
});

// friend request endpoint

app.post("/friend-request", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
    // Check if a friend request already exists
    const selectedUser = await User.findById(selectedUserId);

    if (selectedUser.friendRequest.includes(currentUserId)) {
      return res.status(400).json({ message: "Friend request already sent." });
    }

    // Update the friendRequestsArray of the selected user
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { friendRequest: currentUserId },
    });

    // Update the sentFriendsRequest array of the current user
    await User.findByIdAndUpdate(currentUserId, {
      $push: { sentFriendsRequest: selectedUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/friend-request/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    //fetch the user document based on the User id
    const user = await User.findById(userId)
      .populate("friendRequest", "name email image")
      .lean();

    const friendRequest = user.friendRequest;

    res.json(friendRequest);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/friend-request/accept", async (req, res) => {
  try {
    const { senderId, recepientId } = req.body;
    const sender = await User.findById(senderId);
    const recepient = await User.findById(recepientId);
    sender.friends.push(recepientId);
    recepient.friends.push(senderId);
    recepient.friendRequest = recepient.friendRequest.filter(
      (request) => request.toString() !== senderId.toString()
    );
    sender.sentFriendsRequest = sender.sentFriendsRequest.filter(
      (request) => request.toString() !== recepientId.toString
    );
    await sender.save();
    await recepient.save();
    res.status(200).json({ message: "Friend Request accepted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// endpoint to access all the friends of the logged in user!
app.get("/accepted-friends/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "friends",
      "name email image"
    );
    const acceptedFriends = user.friends;
    res.json(acceptedFriends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/friend-requests/sent/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate("sentFriendsRequest", "name email image")
      .lean();

    const sentFriendsRequest = user.sentFriendsRequest;

    res.json(sentFriendsRequest);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Internal Server" });
  }
});

// multer storage configuration (make sure to configure this part correctly)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/"); // Specify the desired destination folder
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }); // Now multer is defined and ready to use


// endpoint to post Messages and store it in the backend
app.post("/messages", upload.single("imageFile"), async (req, res) => {
  try {
    console.log(req.file); // Add this line to debug
    const { senderId, recepientId, messageType, messageText } = req.body;

    if (!req.file && messageType === "image") {
      return res.status(400).json({ error: "Image file is required" });
    }

    const newMessage = new Message({
      senderId,
      recepientId,
      messageType,
      message: messageText,
      timestamp: new Date(),
      imageUrl: messageType === "image" ? req.file.path : null,
    });

    await newMessage.save();
    res.status(200).json({ message: "Message sent Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// endpoint to get the userDetails to design the chat Room header
app.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    //fetch the user data from the user ID
    const recepientId = await User.findById(userId);

    res.json(recepientId);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// endpoint to fetch the messages between two users in the chatRoom
app.get("/messages/:senderId/:recepientId", async (req, res) => {
  try {
    const { senderId, recepientId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, recepientId: recepientId },
        { senderId: recepientId, recepientId: senderId },
      ],
    }).populate("senderId", "_id name");

    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//endpoint to delete the messages!
app.post("/deleteMessages", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "invalid req body!" });
    }

    await Message.deleteMany({ _id: { $in: messages } });

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server" });
  }
});



app.get("/friend-requests/sent/:userId",async(req,res) => {
  try{
    const {userId} = req.params;
    const user = await User.findById(userId).populate("sentFriendsRequest","name email image").lean();

    const sentFriendsRequest = user.sentFriendsRequest;

    res.json(sentFriendsRequest);
  } catch(error){
    console.log("error",error);
    res.status(500).json({ error: "Internal Server" });
  }
})

app.get('/users/current-user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Await the result of the database query
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the found user data as a response
    res.status(200).json(currentUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get("/friends/:userId",(req,res) => {
  try{
    const {userId} = req.params;

    User.findById(userId).populate("friends").then((user) => {
      if(!user){
        return res.status(404).json({message: "User not found"})
      }

      const friendIds = user.friends.map((friend) => friend._id);

      res.status(200).json(friendIds);
    })
  } catch(error){
    console.log("error",error);
    res.status(500).json({message:"internal server error"})
  }
})
