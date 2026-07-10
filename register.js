document.getElementById("registerForm")
.addEventListener("submit", async function(e){

    e.preventDefault();

    const user = {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    const response = await fetch(
        "http://localhost:5000/register",
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

    document.getElementById("registerForm").reset();
});