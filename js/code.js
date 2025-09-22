const urlBase = 'https://renblas.dev/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() {
    userId = 0;
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
                            userId = jsonObject.id;
                            firstName = jsonObject.firstName;
                            lastName = jsonObject.lastName;
                            
                            saveCookie();
                            
                            document.getElementById("loginName").value = "";
                            document.getElementById("loginPassword").value = "";
                            
                            hideLoginDiv();
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
                        
                        // Your backend returns success messages as "error" field
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
                            // If no error field, assume success
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
    let contactFirstName = document.getElementById("contactFirstName").value;
    let contactLastName = document.getElementById("contactLastName").value;
    let contactPhone = document.getElementById("contactPhone").value;
    let contactEmail = document.getElementById("contactEmail").value;
    
    document.getElementById("contactAddResult").innerHTML = "";
    
    if (!contactFirstName || !contactLastName) {
        document.getElementById("contactAddResult").innerHTML = "First and Last name are required";
        document.getElementById("contactAddResult").className = "result-message error";
        return;
    }
    
    document.getElementById("contactAddResult").innerHTML = "Adding contact...";
    document.getElementById("contactAddResult").className = "result-message";
    
    let jsonPayload = '{"firstName" : "' + contactFirstName + '", "lastName" : "' + contactLastName + '", "phone" : "' + contactPhone + '", "email" : "' + contactEmail + '", "userId" : ' + userId + '}';
    let url = urlBase + '/addContact.' + extension;
    
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
                            document.getElementById("contactAddResult").innerHTML = jsonObject.error;
                            document.getElementById("contactAddResult").className = "result-message error";
                            return;
                        }
                        
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
                    } catch (parseError) {
                        document.getElementById("contactAddResult").innerHTML = "Add contact response error. Please try again.";
                        document.getElementById("contactAddResult").className = "result-message error";
                        console.error("JSON parse error:", parseError);
                    }
                } else {
                    document.getElementById("contactAddResult").innerHTML = "Server error. Please try again.";
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

function searchContacts() {
    let search = document.getElementById("searchText").value;
    
    document.getElementById("contactSearchResult").innerHTML = "";
    document.getElementById("contactList").innerHTML = "";
    
    let jsonPayload = '{"search" : "' + search + '", "userId" : ' + userId + '}';
    let url = urlBase + '/searchContacts.' + extension;
    
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
                            document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
                            document.getElementById("contactSearchResult").className = "result-message error";
                            return;
                        }
                        
                        let contactList = "";
                        if (jsonObject.results && jsonObject.results.length > 0) {
                            for (let i = 0; i < jsonObject.results.length; i++) {
                                let contact = jsonObject.results[i];
                                contactList += '<div class="contact-item">';
                                contactList += '<h3>' + contact.firstName + ' ' + contact.lastName + '</h3>';
                                if (contact.phone) contactList += '<div class="contact-info">Phone: ' + contact.phone + '</div>';
                                if (contact.email) contactList += '<div class="contact-info">Email: ' + contact.email + '</div>';
                                contactList += '</div>';
                            }
                            document.getElementById("contactList").innerHTML = contactList;
                        } else {
                            document.getElementById("contactSearchResult").innerHTML = "No contacts found";
                            document.getElementById("contactSearchResult").className = "result-message error";
                        }
                    } catch (parseError) {
                        document.getElementById("contactSearchResult").innerHTML = "Search response error. Please try again.";
                        document.getElementById("contactSearchResult").className = "result-message error";
                        console.error("JSON parse error:", parseError);
                    }
                } else {
                    document.getElementById("contactSearchResult").innerHTML = "Server error. Please try again.";
                    document.getElementById("contactSearchResult").className = "result-message error";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactSearchResult").innerHTML = "Network error: " + err.message;
        document.getElementById("contactSearchResult").className = "result-message error";
    }
}

function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        } else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        } else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }
    
    if (userId < 0) {
        document.getElementById("loggedInDiv").style.display = "none";
        document.getElementById("auth-card").style.display = "block";
    } else {
        hideLoginDiv();
    }
}

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    
    document.getElementById("loggedInDiv").style.display = "none";
    document.getElementById("auth-card").style.display = "block";
    
    // Switch back to login tab
    switchTab('login');
}

function hideLoginDiv() {
    document.getElementById("auth-card").style.display = "none";
    document.getElementById("loggedInDiv").style.display = "block";
    document.getElementById("loggedInDiv").innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <h2>Welcome, ${firstName} ${lastName}!</h2>
            <p>You are successfully logged in.</p>
            <button onclick="doLogout()" style="margin: 10px; padding: 10px 20px;">Logout</button>
            <br><br>
            <a href="contacts.html" style="color: #007bff; text-decoration: none; font-size: 18px;">Go to Contact Manager →</a>
        </div>
    `;
}

// Add enter key support and initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, checking for existing login...');
    
    // Check for existing login
    readCookie();
    
    // Login form enter key support
    const loginPassword = document.getElementById("loginPassword");
    if (loginPassword) {
        loginPassword.addEventListener("keyup", function(event) {
            if (event.keyCode === 13) {
                doLogin();
            }
        });
    }
    
    // Signup form enter key support  
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