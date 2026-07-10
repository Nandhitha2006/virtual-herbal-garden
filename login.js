document.getElementById("loginForm")
.addEventListener("submit", async function(e){

    e.preventDefault();

    const user = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    const response = await fetch(
       "https://virtual-herbal-garden-backend-0aqg.onrender.com/login" 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        }
    );

    const data = await response.json();

    alert(data.message);

if(response.ok){

    localStorage.setItem("loggedIn", "true");

    window.location.href = "home.html";
}
});