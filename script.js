if(localStorage.getItem("loggedIn") !== "true"){
    window.location.href = "login.html";
}
let allPlants = [];
fetch("http://localhost:5000/plants")
  .then(response => response.json())
  .then(data => {
    allPlants = data;
    displayPlants(data);
    document.getElementById("plantCount").innerText =
"🌿 Total Plants : " + data.length;
});

function displayPlants(data) {
    const container = document.getElementById("plants-container");

    container.innerHTML = "";
    if(data.length === 0){
    container.innerHTML =
    "<h2>No plants found 🔍</h2>";
    return;
}

    data.forEach(plant => {
   container.innerHTML += `
<div class="card">
    <img src="images/${plant.image}" alt="${plant.name}">
    <h2>${plant.name}</h2>
    <p>${plant.scientificName}</p>
    <p>${plant.uses}</p>

 <button onclick="showDetails(
'${plant.name}',
'${plant.scientificName}',
'${plant.uses}',
'${plant.image}'
)">
    View Details
    <button onclick="showFirstAid('${plant.name}')">
    First Aid
</button>
<button onclick="deletePlant('${plant._id}')">
    🗑 Delete
</button>
    <button onclick="addFavorite('${plant.name}')">
    ❤️ Favorite
</button>
</button>  
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
function showDetails(name, scientific, uses, image){

    document.getElementById("modalName").innerText = name;

    document.getElementById("modalScientific").innerText =
        scientific;

    document.getElementById("modalUses").innerText =
        uses;

    document.getElementById("modalImage").src =
        "images/" + image;

    document.getElementById("detailsModal").style.display =
        "block";
}
function closeModal(){
    document.getElementById("detailsModal").style.display =
        "none";
}
function topFunction(){
    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
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
    const favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    const favoritePlants = allPlants.filter(plant =>
        favorites.includes(plant.name)
    );

    displayPlants(favoritePlants);
}

function showAllPlants() {
    displayPlants(allPlants);
}
function showFirstAid(name){

    let message = "";

    if(name === "Tulsi"){
        message = "🌿 Tulsi:\nUsed for cold, cough and sore throat relief.";
    }

    else if(name === "Neem"){
        message = "🌿 Neem:\nUsed for cuts, wounds and skin infections.";
    }

    else if(name === "Aloe Vera"){
        message = "🌿 Aloe Vera:\nUsed for burns and skin irritation.";
    }

    else if(name === "Mint"){
        message = "🌿 Mint:\nUsed for stomach pain and digestion problems.";
    }

    else if(name === "Turmeric"){
        message = "🌿 Turmeric:\nUsed for wound healing and immunity support.";
    }
   else if(name === "Curry leaves"){
    message = "🌿 Curry Leaves: Used for indigestion, nausea and helps improve digestion.";
}

    alert(message);
}
document.getElementById("plantForm").addEventListener("submit", async function(e){

    e.preventDefault();

    const plant = {
        name: document.getElementById("name").value,
        scientificName: document.getElementById("scientificName").value,
        uses: document.getElementById("uses").value,
        image: document.getElementById("image").value
    };

    const response = await fetch("http://localhost:5000/plants",{
        method: "POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(plant)
    });

    const data = await response.json();

    alert("Plant added successfully!");

    location.reload();
});
async function deletePlant(id){

    const confirmDelete = confirm(
        "Are you sure you want to delete this plant?"
    );

    if(!confirmDelete){
        return;
    }

    const response = await fetch(
        `http://localhost:5000/plants/${id}`,
        {
            method: "DELETE"
        }
    );

    if(response.ok){
        alert("Plant deleted successfully");
        location.reload();
    }
}
function logout() {

    localStorage.removeItem("loggedIn");

    alert("Logged out successfully");

    window.location.href = "login.html";
}