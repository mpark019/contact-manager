const urlBase = 'https://renblas.dev/LAMPAPI';
const extension = 'php';

let userID = 0;
let firstName = "";
let lastName = "";

function doLogin() {
    userID = 0;
    firstName = "";
    lastName = "";
    
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;
    
    document.getElementById("loginResult").innerHTML = "Logging in...";
    
    let jsonPayload = '{"username" : "' + login + '", "password" : "' + password + '"}';
    let url = urlBase + '/Login.' + extension;
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    try {
                        let jsonObject = JSON.parse(xhr.responseText);
                        
                        if (jsonObject.error && jsonObject.error !== "") {
                            document.getElementById("loginResult").innerHTML = jsonObject.error;
                            document.getElementById("loginResult").style.color = "red";
                        } else {
                            userID = jsonObject.id;
                            firstName = jsonObject.firstName;
                            lastName = jsonObject.lastName;
                            
                            saveCookie();
                            
                            document.getElementById("loginName").value = "";
                            document.getElementById("loginPassword").value = "";
                            
			    window.location.replace("contacts.html");	
                            //hideLoginDiv();
                        }
                    } catch (parseError) {
                        document.getElementById("loginResult").innerHTML = "Login response error. Please try again.";
                        document.getElementById("loginResult").style.color = "red";
                        console.error("JSON parse error:", parseError);
                        console.log("Response text:", xhr.responseText);
                    }
                } else {
                    document.getElementById("loginResult").innerHTML = "Server error. Please try again.";
                    document.getElementById("loginResult").style.color = "red";
                    console.error("HTTP Status:", this.status);
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("loginResult").innerHTML = "Network error: " + err.message;
        document.getElementById("loginResult").style.color = "red";
    }
}

function doSignup() {
    let firstName = document.getElementById("signupFirstName").value;
    let lastName = document.getElementById("signupLastName").value;
    let login = document.getElementById("signupUsername").value;
    let password = document.getElementById("signupPassword").value;

    document.getElementById("signupResult").innerHTML = "";
    
    if (!firstName || !lastName || !login || !password) {
        document.getElementById("signupResult").innerHTML = "Please fill in all fields";
        document.getElementById("signupResult").style.color = "red";
        return;
    }
    
    document.getElementById("signupResult").innerHTML = "Creating account...";
    
    let jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "username" : "' + login + '", "password" : "' + password + '"}';
    let url = urlBase + '/Signup.' + extension;
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    try {
                        let jsonObject = JSON.parse(xhr.responseText);
                        
                        if (jsonObject.error) {
                            if (jsonObject.error.includes("Signup successful") || jsonObject.error.includes("successful")) {
                                document.getElementById("signupResult").innerHTML = "Account created successfully! You can now log in.";
                                document.getElementById("signupResult").style.color = "green";
                                
                                // Clear form
                                document.getElementById("signupFirstName").value = "";
                                document.getElementById("signupLastName").value = "";
                                document.getElementById("signupUsername").value = "";
                                document.getElementById("signupPassword").value = "";
                                
                                // Switch to login after 2 seconds
                                setTimeout(() => {
                                    switchTab('login');
                                    document.getElementById("signupResult").innerHTML = "";
                                }, 2000);
                                
                            } else {
                                document.getElementById("signupResult").innerHTML = jsonObject.error;
                                document.getElementById("signupResult").style.color = "red";
                            }
                        } else {
                            document.getElementById("signupResult").innerHTML = "Account created successfully! You can now log in.";
                            document.getElementById("signupResult").style.color = "green";
                            
                            // Clear form
                            document.getElementById("signupFirstName").value = "";
                            document.getElementById("signupLastName").value = "";
                            document.getElementById("signupUsername").value = "";
                            document.getElementById("signupPassword").value = "";
                            
                            // Switch to login after 2 seconds
                            setTimeout(() => {
                                switchTab('login');
                                document.getElementById("signupResult").innerHTML = "";
                            }, 2000);
                        }
                    } catch (parseError) {
                        document.getElementById("signupResult").innerHTML = "Signup response error. Please try again.";
                        document.getElementById("signupResult").style.color = "red";
                        console.error("JSON parse error:", parseError);
                        console.log("Response text:", xhr.responseText);
                    }
                } else {
                    document.getElementById("signupResult").innerHTML = "Server error. Please try again.";
                    document.getElementById("signupResult").style.color = "red";
                    console.error("HTTP Status:", this.status);
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("signupResult").innerHTML = "Network error: " + err.message;
        document.getElementById("signupResult").style.color = "red";
    }
}

function addContact() {
    let contactFirstName = document.getElementById("contactFirstName").value.trim();
    let contactLastName = document.getElementById("contactLastName").value.trim();
    let contactPhone = document.getElementById("contactPhone").value.trim();
    let contactEmail = document.getElementById("contactEmail").value.trim();
    
    document.getElementById("contactAddResult").innerHTML = "";
    
    if (!contactFirstName || !contactLastName) {
        document.getElementById("contactAddResult").innerHTML = "First and Last name are required";
        document.getElementById("contactAddResult").className = "result-message error";
        return;
    }
    
    document.getElementById("contactAddResult").innerHTML = "Adding contact...";
    document.getElementById("contactAddResult").className = "result-message";
    
    let jsonPayload = '{"firstName" : "' + contactFirstName + '", "lastName" : "' + contactLastName + '", "phone" : "' + contactPhone + '", "email" : "' + contactEmail + '", "userID" : ' + userID + '}';
    let url = urlBase + '/addContact.' + extension;
    
    console.log("Adding contact with payload:", jsonPayload);
    console.log("URL:", url);
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                console.log("Add contact response status:", this.status);
                console.log("Add contact response text:", xhr.responseText);
                
                if (this.status == 200) {
                    // Handle successful response or empty response
                    if (!xhr.responseText || xhr.responseText.trim() === '') {
                        document.getElementById("contactAddResult").innerHTML = "Contact added successfully!";
                        document.getElementById("contactAddResult").className = "result-message success";
                        
                        // Clear form
                        document.getElementById("contactFirstName").value = "";
                        document.getElementById("contactLastName").value = "";
                        document.getElementById("contactPhone").value = "";
                        document.getElementById("contactEmail").value = "";
                        
                        // Refresh contact list if visible
                        if (typeof loadAllContacts === 'function') {
                            setTimeout(loadAllContacts, 1000);
                        }
                        return;
                    }
                    
                    try {
                        let jsonObject = JSON.parse(xhr.responseText);
                        
                        if (jsonObject.error === "") {
                            document.getElementById("contactAddResult").innerHTML = "Contact added successfully!";
                            document.getElementById("contactAddResult").className = "result-message success";
                            
                            // Clear form
                            document.getElementById("contactFirstName").value = "";
                            document.getElementById("contactLastName").value = "";
                            document.getElementById("contactPhone").value = "";
                            document.getElementById("contactEmail").value = "";
                            
                            // Refresh contact list if visible
                            if (typeof loadAllContacts === 'function') {
                                setTimeout(loadAllContacts, 1000);
                            }
                        } else {
                            document.getElementById("contactAddResult").innerHTML = jsonObject.error;
                            document.getElementById("contactAddResult").className = "result-message error";
                        }
                    } catch (parseError) {
                        // If JSON parsing fails, but we got a 200 response, assume success
                        document.getElementById("contactAddResult").innerHTML = "Contact added successfully!";
                        document.getElementById("contactAddResult").className = "result-message success";
                        
                        // Clear form
                        document.getElementById("contactFirstName").value = "";
                        document.getElementById("contactLastName").value = "";
                        document.getElementById("contactPhone").value = "";
                        document.getElementById("contactEmail").value = "";
                        
                        console.log("JSON parse failed, but assuming success due to 200 status");
                        console.log("Raw response:", xhr.responseText);
                    }
                } else {
                    document.getElementById("contactAddResult").innerHTML = "Server error (Status " + this.status + "). Please try again.";
                    document.getElementById("contactAddResult").className = "result-message error";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactAddResult").innerHTML = "Network error: " + err.message;
        document.getElementById("contactAddResult").className = "result-message error";
    }
}

function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userID=" + userID + ";expires=" + date.toGMTString();
}

function readCookie() {
    userID = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        } else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        } else if (tokens[0] == "userID") {
            userID = parseInt(tokens[1].trim());
        }
    }
    
    if (userID < 0) {
        // Only try to hide login div if elements exist (on login page)
        let loggedInDiv = document.getElementById("loggedInDiv");
        let authCard = document.getElementById("auth-card");
        
        if (loggedInDiv) loggedInDiv.style.display = "none";
        if (authCard) authCard.style.display = "block";
    } else {
        hideLoginDiv();
    }
}

function doLogout() {
    userID = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    
    // Redirect to login page regardless of current page
    window.location.href = 'index.html';
}

function hideLoginDiv() {
    // Check which page we're on and handle accordingly
    let authCard = document.getElementById("auth-card");
    let loggedInDiv = document.getElementById("loggedInDiv");
    
    if (authCard && loggedInDiv) {
        // We're on the login page (index.html)
        authCard.style.display = "none";
        loggedInDiv.style.display = "block";
        loggedInDiv.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h2>Welcome, ${firstName} ${lastName}!</h2>
                <p>You are successfully logged in.</p>
                <button onclick="doLogout()" style="margin: 10px; padding: 10px 20px;">Logout</button>
                <br><br>
                <a href="contacts.html" style="color: #007bff; text-decoration: none; font-size: 18px;">Go to Contact Manager →</a>
            </div>
        `;
    } else {
        // We're on contacts page or another page - just update user display if it exists
        let userDisplay = document.getElementById('userDisplayName');
        if (userDisplay) {
            userDisplay.textContent = firstName + ' ' + lastName;
        }
    }
}

// Add enter key support and initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, checking for existing login...');
    
    // Check for existing login
    readCookie();
    
    // Login form enter key support (only if login page)
    const loginPassword = document.getElementById("loginPassword");
    if (loginPassword) {
        loginPassword.addEventListener("keyup", function(event) {
            if (event.keyCode === 13) {
                doLogin();
            }
        });
    }
    
    // Signup form enter key support (only if login page)
    const signupPassword = document.getElementById("signupPassword");
    if (signupPassword) {
        signupPassword.addEventListener("keyup", function(event) {
            if (event.keyCode === 13) {
                doSignup();
            }
        });
    }
    
    console.log('Event listeners added successfully');
});
