function togglePopup() {
    var popup1 = document.getElementById("popup-1");
    var popup2 = document.getElementById("popup-2");

    popup1.classList.toggle("active");
    if (popup2.classList.contains("active")) {
        popup2.classList.remove("active");
    }
}

function togglePopup1() {
    var popup1 = document.getElementById("popup-1");
    var popup2 = document.getElementById("popup-2");

    popup2.classList.toggle("active");
    if (popup1.classList.contains("active")) {
        popup1.classList.remove("active");
    }
}

// Register Functionality
function register() {
    var name = document.getElementById("registerName").value;
    var email = document.getElementById("registerEmail").value;
    var password = document.getElementById("registerPassword").value;

    if (name === "" || email === "" || password === "") {
        alert("Please fill in all fields");
        return;
    }

    var mailformat = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
    if(!email.match(mailformat)) {
        alert('Invalid email');
        return false;
    }

    var userData = {
        name: name,
        email: email,
        password: password
    };

    localStorage.setItem(email, JSON.stringify(userData));

    alert("Registration successful");
    togglePopup();
}

// Login Functionality
function login() {
    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;

    var userData = JSON.parse(localStorage.getItem(email));

    if (userData && userData.password === password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('playAsGuest', 'false');

        // document.getElementById("logoutButton").style.display = "inline";
        // document.getElementById("loginDiv").style.display = "none";
        window.location.href = 'index.html';  
    } else {
        alert("Invalid email or password");
        togglePopup();
    }
}

// Logout Functionality
function logout() {
    document.getElementById("logoutButton").style.display = "none";
    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPassword").value = "";
    document.getElementById("loginBtn").style.display = "inline";
    localStorage.setItem('isLoggedIn', 'false');
    alert("You are now logged out!");
    togglePopup();
}

function initializePage() {
    var isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        document.getElementById("logoutButton").style.display = "inline";
        document.getElementById("loginBtn").style.display = "none";
    } else {
        document.getElementById("logoutButton").style.display = "none";
        document.getElementById("loginBtn").style.display = "inline";
    }
}

function playAsGuest() {
    localStorage.setItem('playAsGuest', 'true');
    localStorage.setItem('isLoggedIn', 'false');

    window.location.href = 'index.html';  
}