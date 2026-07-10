const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Plant = require("./models/Plant");
const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/herbalgarden")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

app.get("/plants", async (req, res) => {
    const plants = await Plant.find();
    res.json(plants);
});
app.post("/register", async (req, res) => {
    try {

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});
app.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.password !== password) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        res.json({
            message: "Login successful"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});
app.post("/plants", async (req, res) => {
    try{
        const plant = new Plant(req.body);

        await plant.save();

        res.status(201).json(plant);
    }
    catch(error){
        res.status(500).json({
            message: error.message
        });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});