const Students = require("./view/models/Students");
const express = require("express");
const cors = require("cors");
const app = express();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const connectDB = require("./view/db/connect");
require("dotenv").config();

app.use(cors());

const PORT = 8080; // Choose a port for your backend server

// Middleware
app.use(bodyParser.json());

app.post("/login", async (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  console.log(username);

  const reqdStudent = await Students.findOne({ username: `${username}` });
  console.log(reqdStudent);
  if (!reqdStudent) {
    console.log("not found");
    return res.status(401).json({ error: "User Not Found" });
  } else {
    console.log(reqdStudent.password);
    console.log(password);
    const hashedpassword = await bcrypt.hash(password, 10);
    const passcheck = await bcrypt.compare(
      reqdStudent.password,
      hashedpassword
    );
    if (!passcheck) {
      console.log("invalid");
      return res.status(401).json({ error: "Invalid credentials" });
    } else {
      console.log("success");
      return res
        .status(200)
        .json({ message: "Login successful", username: `${username}` });
    }
  }

  // Students.exec(async (s) => {
  //   if (s.username === username) {
  //     const passcheck = await bcrypt.compare(s.password, password);
  //     if (!passcheck) {
  //       return res.status(401).json({ error: "Invalid credentials" });
  //     } else {
  //       return res
  //         .status(200)
  //         .json({ message: "Login successful", username: `${username}` });
  //     }
  //   } else {
  //     return res.status(401).json({ error: "User Not Found" });
  //   }
  // });
});

// Start the server

const Start = async () => {
  try {
    await connectDB();
    console.log("connected to db");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

Start();
