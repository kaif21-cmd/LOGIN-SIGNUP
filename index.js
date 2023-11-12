const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = process.env.PORT || 8003;

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect("mongodb://127.0.0.1:27017/form", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connection to MongoDB successful"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const db = mongoose.connection;
db.on('error', () => console.error("Error connecting to the database"));
db.once('open', () => console.log("Connected to the database"));

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

app.post("/form", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  const newUser = new User({
    username: username,
    email: email,
    password: password,
  });

  newUser.save()
    .then(() => {
      console.log("User saved successfully");
      return res.redirect('login.html');
    })
    .catch((err) => {
      console.error("Error saving user:", err);
      return res.status(500).send("Error saving user");
    });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password }).exec();

    if (user) {
      // Successful login
      return res.redirect('frontend/index.html'); // frontfoldername inside the public folder and main fike of that folder 
    } else {
      // Invalid credentials
      return res.status(401).send("Invalid email or password");
    }
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).send("Error during login");
  }
});

app.get("/", (req, res) => {
  res.send("Hello from Kaif");
  return res.redirect('hsk.html');
});


 
app.listen(8003, () => {
  console.log("Server is running on port 8003");
});
