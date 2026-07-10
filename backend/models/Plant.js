const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema({
    name: String,
    scientificName: String,
    uses: String,
    image: String
});

module.exports = mongoose.model("Plant", plantSchema);