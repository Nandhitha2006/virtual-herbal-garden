// 1. Session and Authentication Check
if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "register.html";
}

let allPlants = [];
const BACKEND_URL = "https://virtual-herbal-garden-backend-0aqg.onrender.com/plants";

// 2. Fetch Plants from Live Backend API
fetch(BACKEND_URL)
  .then(response => response.json())
  .then(data => {
    allPlants = data;
    displayPlants(data);
  })
  .catch(err => console.error("Error fetching plants:", err));

// 3. Render Plant Cards Dynamically
function displayPlants(data) {
    const container = document.getElementById("plants-container");
    if (!container) return;
    container.innerHTML = "";
    
    if (data.length === 0) {
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

            <div class="button-group">
                <button onclick="showDetails('${plant.name.replace(/'/g, "\\'")}', '${plant.scientificName.replace(/'/g, "\\'")}', '${plant.uses.replace(/'/g, "\\'")}', '${plant.image.replace(/'/g, "\\'")}')">View Details</button>
                <button onclick="showFirstAid('${plant.name.replace(/'/g, "\\'")}')">First Aid</button>
                <button onclick="deletePlant('${plant._id}')">🗑 Delete</button>
                <button onclick="addFavorite('${plant.name.replace(/'/g, "\\'")}')">❤️ Favorite</button>
            </div>
        </div>
        `;     
    });
}

// 4. Live Search Filtering Functionality
const searchInput = document.getElementById("searchInput");
if (searchInput) {
    searchInput.addEventListener("keyup", function() {
        const text = this.value.toLowerCase();
        const result = allPlants.filter(plant =>
            plant.name.toLowerCase().includes(text)
        );
        displayPlants(result);
    });
}

// 5. Open Popup Modal (Matches Your exact HTML IDs perfectly)
function showDetails(name, scientific, uses, image) {
    const mName = document.getElementById("detailName");
    const mScientific = document.getElementById("detailScientific");
    const mUses = document.getElementById("detailUses");

    if (mName) mName.innerText = name;
    if (mScientific) mScientific.innerText = "Scientific Name: " + scientific;
    if (mUses) mUses.innerText = "Uses: " + uses;

    const modal = document.getElementById("detailsModal");
    if (modal) { 
        modal.style.display = "block"; 
    }
}

// 6. Close Modal/Popup Function
function closeModal() {
    const modal = document.getElementById("detailsModal");
    if (modal) { 
        modal.style.display = "none"; 
    }
}

// 7. Add or Remove Plant from Favorites
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

// 8. Display Only Favorited Plants
function showFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const favoritePlants = allPlants.filter(plant => favorites.includes(plant.name));
    displayPlants(favoritePlants);
}

// 9. Reset Filter and Show All Plants
function showAllPlants() {
    displayPlants(allPlants);
}

// 10. Trigger Alert for First Aid Application Information
function showFirstAid(name) {
    let message = "";
    const lowerName = name.toLowerCase();

    if (lowerName.includes("tulsi")) {
        message = "🌿 Tulsi:\nUsed for cold, cough and sore throat relief.";
    } else if (lowerName.includes("neem")) {
        message = "🌿 Neem:\nUsed for cuts, wounds and skin infections.";
    } else if (lowerName.includes("aloe vera")) {
        message = "🌿 Aloe Vera:\nUsed for burns and skin irritation.";
    } else if (lowerName.includes("mint")) {
        message = "🌿 Mint:\nUsed for stomach pain and digestion problems.";
    } else if (lowerName.includes("turmeric")) {
        message = "🌿 Turmeric:\nUsed for wound healing and immunity support.";
    } else if (lowerName.includes("curry")) {
        message = "🌿 Curry Leaves:\nUsed for indigestion, nausea and helps improve digestion.";
    } else {
        message = "🌿 " + name + ":\nKeep regular care and use as per guidance.";
    }
    alert(message);
}

// 11. Submit New Plant Form to Live Render Server
const plantForm = document.getElementById("plantForm");
if (plantForm) {
    plantForm.addEventListener("submit", async function(e) {
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

        if (response.ok) {
            alert("Plant added successfully!");
            location.reload();
        }
    });
}

// 12. Delete Plant Record from Live Server Database
async function deletePlant(id) {
    const confirmDelete = confirm("Are you sure you want to delete this plant?");
    if (!confirmDelete) { return; }

    const response = await fetch(`${BACKEND_URL}/${id}`, {
        method: "DELETE"
    });

    if (response.ok) {
        alert("Plant deleted successfully");
        location.reload();
    }
}

// 13. Terminate User Session and Logout
function logout() {
    localStorage.removeItem("loggedIn");
    alert("Logged out successfully");
    window.location.href = "register.html";
}