document.getElementById("loginForm")
.addEventListener("submit", async function(e){

    e.preventDefault();

    const user = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    const response = await fetch(
        "http://localhost:5000/login",
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