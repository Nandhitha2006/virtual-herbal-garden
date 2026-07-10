if(localStorage.getItem("loggedIn") !== "true"){
    window.location.href = "register.html";
}
let allPlants = [];
const BACKEND_URL = "https://virtual-herbal-garden-backend-0aqg.onrender.com/plants";

fetch(BACKEND_URL)
  .then(response => response.json())
  .then(data => {
    allPlants = data;
    displayPlants(data);
    document.getElementById("plantCount").innerText = "🌿 Total Plants : " + data.length;
});

function displayPlants(data) {
    const container = document.getElementById("plants-container");
    container.innerHTML = "";
    
    if(data.length === 0){
        container.innerHTML = "<h2>No plants found 🔍</h2>";
        return;
    }

    data.forEach(plant => {
        container.innerHTML += `
        <div class="card">
            <img src="images/${plant.image}" alt="${plant.name}">
            <h2>${plant.name}</h2>
            <p><b>Scientific:</b> ${plant.scientificName}</p>
            <p>${plant.uses}</p>

            <!-- பட்டன்கள் இப்போ தனித்தனியா பிரிச்சு அழகா வைக்கப்பட்டிருக்கு -->
            <div class="button-group">
                <button onclick="showDetails('${plant.name}', '${plant.scientificName}', '${plant.uses}', '${plant.image}')">View Details</button>
                <button onclick="showFirstAid('${plant.name}')">First Aid</button>
                <button onclick="deletePlant('${plant._id}')">🗑 Delete</button>
                <button onclick="addFavorite('${plant.name}')">❤️ Favorite</button>
            </div>
        </div>
        `;     
    });
}

document.getElementById("searchInput").addEventListener("keyup", function() {
    const text = this.value.toLowerCase();
    const result = allPlants.filter(plant =>
        plant.name.toLowerCase().includes(text)
    );
    displayPlants(result);
});

// View Details ஓபன் பண்ணும் பங்க்ஷன்
function showDetails(name, scientific, uses, image){
    document.getElementById("modalName").innerText = name;
    document.getElementById("modalScientific").innerText = scientific;
    document.getElementById("modalUses").innerText = uses;
    document.getElementById("modalImage").src = "images/" + image;
    
    // HTML-ல detailsModal அல்லது plantModal எது இருந்தாலும் ஓபன் ஆகும்
    const modal = document.getElementById("detailsModal") || document.getElementById("plantModal");
    if(modal) {
        modal.style.display = "block";
    }
}

function closeModal(){
    const modal = document.getElementById("detailsModal") || document.getElementById("plantModal");
    if(modal) {
        modal.style.display = "none";
    }
}

function topFunction(){
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function addFavorite(name) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.includes(name)) {
        favorites = favorites.filter(item => item !== name);
        alert(name + " removed from favorites 💔");
    } else {
        favorites.push(name);
        alert(name + " added to favorites ❤️");
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

function showFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const favoritePlants = allPlants.filter(plant => favorites.includes(plant.name));
    displayPlants(favoritePlants);
}

function showAllPlants() {
    displayPlants(allPlants);
}

function showFirstAid(name){
    let message = "";
    const lowerName = name.toLowerCase();

    if(lowerName.includes("tulsi")){
        message = "🌿 Tulsi:\nUsed for cold, cough and sore throat relief.";
    } else if(lowerName.includes("neem")){
        message = "🌿 Neem:\nUsed for cuts, wounds and skin infections.";
    } else if(lowerName.includes("aloe vera")){
        message = "🌿 Aloe Vera:\nUsed for burns and skin irritation.";
    } else if(lowerName.includes("mint")){
        message = "🌿 Mint:\nUsed for stomach pain and digestion problems.";
    } else if(lowerName.includes("turmeric")){
        message = "🌿 Turmeric:\nUsed for wound healing and immunity support.";
    } else if(lowerName.includes("curry")){
        message = "🌿 Curry Leaves:\nUsed for indigestion, nausea and helps improve digestion.";
    } else {
        message = "🌿 " + name + ":\nKeep regular care and use as per guidance.";
    }
    alert(message);
}

// ஆட் பிளான்ட் லைவ் லிங்க்காக மாற்றப்பட்டது
document.getElementById("plantForm").addEventListener("submit", async function(e){
    e.preventDefault();
    const plant = {
        name: document.getElementById("name").value,
        scientificName: document.getElementById("scientificName").value,
        uses: document.getElementById("uses").value,
        image: document.getElementById("image").value
    };

    const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plant)
    });

    if(response.ok) {
        alert("Plant added successfully!");
        location.reload();
    }
});

// டெலிட் பிளான்ட் லைவ் லிங்க்காக மாற்றப்பட்டது
async function deletePlant(id){
    const confirmDelete = confirm("Are you sure you want to delete this plant?");
    if(!confirmDelete){ return; }

    const response = await fetch(`${BACKEND_URL}/${id}`, {
        method: "DELETE"
    });

    if(response.ok){
        alert("Plant deleted successfully");
        location.reload();
    }
}

function logout() {
    localStorage.removeItem("loggedIn");
    alert("Logged out successfully");
    window.location.href = "register.html";
}