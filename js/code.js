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
    
    // Use parameter names that match your database schema
    let jsonPayload = JSON.stringify({
        userID: userID,
        firstName: contactFirstName,
        lastName: contactLastName,
        phoneNumber: contactPhone,  // Match database column name
        email: contactEmail
    });
    
    let url = urlBase + '/addContact.' + extension;
    
    console.log("Add contact URL:", url);
    console.log("Add contact payload:", jsonPayload);
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                console.log("Add contact response status:", this.status);
                console.log("Add contact response text:", xhr.responseText);
                
                if (this.status == 200) {
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
                            
                            // Refresh contact list
                            setTimeout(loadAllContacts, 1000);
                        } else {
                            document.getElementById("contactAddResult").innerHTML = jsonObject.error;
                            document.getElementById("contactAddResult").className = "result-message error";
                        }
                    } catch (parseError) {
                        document.getElementById("contactAddResult").innerHTML = "Contact added successfully!";
                        document.getElementById("contactAddResult").className = "result-message success";
                        
                        // Clear form
                        document.getElementById("contactFirstName").value = "";
                        document.getElementById("contactLastName").value = "";
                        document.getElementById("contactPhone").value = "";
                        document.getElementById("contactEmail").value = "";
                        
                        // Refresh contact list
                        setTimeout(loadAllContacts, 1000);
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

function deleteContact(contactId) {
    console.log("=== ATTEMPTING DELETE ===");
    console.log("Contact ID to delete:", contactId);
    console.log("Current userID:", userID);

    if (!confirm("Are you sure you want to delete this contact? This action cannot be undone.")) {
        return;
    }

    // Use the exact parameter names your backend expects
    let jsonPayload = JSON.stringify({
        userID: userID,
        contactID: parseInt(contactId)
    });

    let url = urlBase + '/deleteContact.' + extension;

    console.log("Delete URL:", url);
    console.log("Delete payload:", jsonPayload);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            console.log("Delete response status:", this.status);
            console.log("Delete response text:", xhr.responseText);

            if (this.status == 200) {
                try {
                    let jsonObject = JSON.parse(xhr.responseText);
                    
                    if (jsonObject.error === "") {
                        // SUCCESS - remove from currentContacts and update display
                        currentContacts = currentContacts.filter(contact => {
                            return (contact.id != contactId && 
                                   contact.ID != contactId && 
                                   contact.contactID != contactId);
                        });

                        // Update the display
                        if (currentContacts.length > 0) {
                            displayContacts(currentContacts);
                            document.getElementById("contactSearchResult").innerHTML = "Contact permanently deleted from database!";
                            document.getElementById("contactSearchResult").className = "result-message success";
                        } else {
                            document.getElementById("contactResults").style.display = "none";
                            document.getElementById("contactSearchResult").innerHTML = "Contact permanently deleted! No contacts remaining.";
                            document.getElementById("contactSearchResult").className = "result-message success";
                        }
                        
                        alert("Contact permanently deleted from database!");
                    } else {
                        alert("Delete failed: " + jsonObject.error);
                    }
                } catch (parseError) {
                    console.error("JSON parse error:", parseError);
                    // If JSON parsing fails but status is 200, assume success
                    currentContacts = currentContacts.filter(contact => {
                        return (contact.id != contactId && 
                               contact.ID != contactId && 
                               contact.contactID != contactId);
                    });

                    displayContacts(currentContacts);
                    alert("Contact deleted successfully!");
                }
            } else {
                alert("Delete failed with HTTP error: " + this.status + ". Please try again.");
                console.error("Full error response:", xhr.responseText);
            }
        }
    };

    xhr.send(jsonPayload);
}

function loadAllContacts() {
    console.log("Loading all contacts...");
    
    let searchInput = document.getElementById("searchText");
    if (searchInput) searchInput.value = "";
    
    let jsonPayload = JSON.stringify({
        search: "",
        userID: userID
    });
    
    let url = urlBase + '/searchContacts.' + extension;
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                try {
                    let jsonObject = JSON.parse(xhr.responseText);
                    
                    if (jsonObject.error && jsonObject.error !== "" && jsonObject.error !== "No Records Found") {
                        document.getElementById("contactSearchResult").innerHTML = "Error loading contacts";
                        document.getElementById("contactSearchResult").className = "result-message error";
                        return;
                    }
                    
                    if (jsonObject.results && jsonObject.results.length > 0) {
                        document.getElementById("contactSearchResult").innerHTML = "Showing all " + jsonObject.results.length + " contact(s)";
                        document.getElementById("contactSearchResult").className = "result-message success";
                        displayContacts(jsonObject.results);
                    } else {
                        document.getElementById("contactSearchResult").innerHTML = "You don't have any contacts yet";
                        document.getElementById("contactSearchResult").className = "result-message error";
                        document.getElementById("contactList").innerHTML = "";
                    }
                } catch (e) {
                    document.getElementById("contactSearchResult").innerHTML = "Error loading contacts";
                    document.getElementById("contactSearchResult").className = "result-message error";
                }
            } else {
                document.getElementById("contactSearchResult").innerHTML = "Failed to load contacts";
                document.getElementById("contactSearchResult").className = "result-message error";
            }
        }
    };
    
    xhr.send(jsonPayload);
}

function searchContacts() {
    let search = document.getElementById("searchText").value.trim();
    
    if (!search) {
        document.getElementById("contactSearchResult").innerHTML = "Please enter a search term.";
        document.getElementById("contactSearchResult").className = "result-message error";
        return;
    }
    
    document.getElementById("contactSearchResult").innerHTML = "Searching...";
    document.getElementById("contactSearchResult").className = "result-message";
    document.getElementById("contactList").innerHTML = "";
    
    // First, get ALL contacts by doing an empty search
    let jsonPayload = JSON.stringify({
        search: "",  // Empty search to get all contacts
        userID: userID
    });
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
                        
                        if (jsonObject.error && jsonObject.error !== "" && jsonObject.error !== "No Records Found") {
                            document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
                            document.getElementById("contactSearchResult").className = "result-message error";
                            document.getElementById("contactResults").style.display = "none";
                            return;
                        }
                        
                        if (jsonObject.results && jsonObject.results.length > 0) {
                            // Do frontend filtering on ALL contacts
                            let searchTerm = search.toLowerCase();
                            let filteredResults = jsonObject.results.filter(contact => {
                                let firstName = (contact.firstName || '').toLowerCase();
                                let lastName = (contact.lastName || '').toLowerCase();
                                let fullName = firstName + ' ' + lastName;
                                let phone = (contact.phone || '').toLowerCase();
                                let email = (contact.email || '').toLowerCase();
                                
                                // Check if search matches any field
                                return firstName.includes(searchTerm) ||
                                       lastName.includes(searchTerm) ||
                                       fullName.includes(searchTerm) ||
                                       phone.includes(searchTerm) ||
                                       email.includes(searchTerm);
                            });
                            
                            if (filteredResults.length > 0) {
                                document.getElementById("contactSearchResult").innerHTML = "Found " + filteredResults.length + " contact(s) matching '" + search + "'";
                                document.getElementById("contactSearchResult").className = "result-message success";
                                displayContacts(filteredResults);
                            } else {
                                document.getElementById("contactSearchResult").innerHTML = "No contacts found matching '" + search + "'";
                                document.getElementById("contactSearchResult").className = "result-message error";
                                document.getElementById("contactResults").style.display = "none";
                            }
                        } else {
                            document.getElementById("contactSearchResult").innerHTML = "You don't have any contacts yet";
                            document.getElementById("contactSearchResult").className = "result-message error";
                            document.getElementById("contactResults").style.display = "none";
                        }
                    } catch (parseError) {
                        document.getElementById("contactSearchResult").innerHTML = "Search response error. Please try again.";
                        document.getElementById("contactSearchResult").className = "result-message error";
                        console.error("JSON parse error:", parseError);
                        console.log("Raw response:", xhr.responseText);
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
                <a href="contacts.html" style="color: #007bff; text-decoration: none; font-size: 18px;">Go to Contact Manager</a>
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
function displayContacts(contacts) {
    currentContacts = contacts;
    
    let contactList = "";
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        contactList += '<div class="contact-item">';
        contactList += '<div class="contact-actions">';
        contactList += '<button class="buttons btn-edit" onclick="openEditModal(' + i + ')">Edit</button>';
        contactList += '<button class="buttons btn-delete" onclick="deleteContact(' + (contact.contactID || contact.id || i) + ')">Delete</button>';
        contactList += '</div>';
        contactList += '<h4>' + (contact.firstName || '') + ' ' + (contact.lastName || '') + '</h4>';
        if (contact.phone) {
            contactList += '<div class="contact-info"><span style="color:#007bff;">📞</span> ' + contact.phone + '</div>';
        }
        if (contact.email) {
            contactList += '<div class="contact-info"><span style="color:#007bff;">✉</span> ' + contact.email + '</div>';
        }
        contactList += '</div>';
    }
    document.getElementById("contactList").innerHTML = contactList;
    document.getElementById("contactResults").style.display = "block";
}

function openEditModal(index) {
    let contact = currentContacts[index];

    document.getElementById("editContactId").value = contact.contactID || contact.id || index;
    document.getElementById("editContactFirstName").value = contact.firstName || '';
    document.getElementById("editContactLastName").value = contact.lastName || '';
    document.getElementById("editContactPhone").value = contact.phone || '';
    document.getElementById("editContactEmail").value = contact.email || '';
    document.getElementById("editContactResult").innerHTML = '';

    document.getElementById("editModal").style.display = "block";
}

function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
}
function updateContact() {
    let contactId = document.getElementById("editContactId").value;
    let firstName = document.getElementById("editContactFirstName").value.trim();
    let lastName = document.getElementById("editContactLastName").value.trim();
    let phone = document.getElementById("editContactPhone").value.trim();
    let email = document.getElementById("editContactEmail").value.trim();

    // Validate required fields
    if (!firstName || !lastName) {
        document.getElementById("editContactResult").innerHTML = "First and Last name are required";
        document.getElementById("editContactResult").className = "result-message error";
        return;
    }

    if (!contactId || contactId === "0") {
        document.getElementById("editContactResult").innerHTML = "Invalid contact ID";
        document.getElementById("editContactResult").className = "result-message error";
        return;
    }

    document.getElementById("editContactResult").innerHTML = "Updating contact...";
    document.getElementById("editContactResult").className = "result-message";

    let jsonPayload = JSON.stringify({
        contactID: parseInt(contactId),
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        userID: parseInt(userID)
    });

    // Use the fixed editContact.php
    let url = urlBase + '/editContact.php';

    console.log("Edit contact URL:", url);
    console.log("Edit payload:", jsonPayload);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            console.log("Edit response status:", this.status);
            console.log("Edit response:", xhr.responseText);

            if (this.status == 200) {
                // Handle successful response or empty response
                if (!xhr.responseText || xhr.responseText.trim() === '') {
                    document.getElementById("editContactResult").innerHTML = "Contact updated successfully!";
                    document.getElementById("editContactResult").className = "result-message success";
                    
                    setTimeout(() => {
                        closeEditModal();
                        loadAllContacts();
                    }, 1000);
                    return;
                }
                
                try {
                    let jsonObject = JSON.parse(xhr.responseText);

                    if (jsonObject.error === "") {
                        document.getElementById("editContactResult").innerHTML = "Contact updated successfully!";
                        document.getElementById("editContactResult").className = "result-message success";

                        setTimeout(() => {
                            closeEditModal();
                            loadAllContacts();
                        }, 1000);
                    } else {
                        document.getElementById("editContactResult").innerHTML = "Error: " + jsonObject.error;
                        document.getElementById("editContactResult").className = "result-message error";
                    }
                } catch (parseError) {
                    // If JSON parsing fails but status is 200, assume success
                    document.getElementById("editContactResult").innerHTML = "Contact updated successfully!";
                    document.getElementById("editContactResult").className = "result-message success";

                    setTimeout(() => {
                        closeEditModal();
                        loadAllContacts();
                    }, 1000);
                }
            } else {
                document.getElementById("editContactResult").innerHTML = "Update failed (Status: " + this.status + ")";
                document.getElementById("editContactResult").className = "result-message error";
            }
        }
    };

    xhr.send(jsonPayload);
}
// Add global variable for current contacts
let currentContacts = [];

// Update displayContacts to set currentContacts
function displayContacts(contacts) {
    currentContacts = contacts; // Store contacts for editing

    let contactList = "";
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        contactList += '<div class="contact-item">';
        contactList += '<div class="contact-actions">';
        contactList += '<button class="buttons btn-edit" onclick="openEditModal(' + i + ')">Edit</button>';
        contactList += '<button class="buttons btn-delete" onclick="deleteContact(' + (contact.contactID || contact.id || i) + ')">Delete</button>';
        contactList += '</div>';
        contactList += '<h4>' + (contact.firstName || '') + ' ' + (contact.lastName || '') + '</h4>';
        if (contact.phone) {
            contactList += '<div class="contact-info"> ' + contact.phone + '</div>';
        }
        if (contact.email) {
            contactList += '<div class="contact-info"> ' + contact.email + '</div>';
        }
        contactList += '</div>';
    }
    document.getElementById("contactList").innerHTML = contactList;
    document.getElementById("contactResults").style.display = "block";
}

// Close modal when clicking outside
window.onclick = function(event) {
    let modal = document.getElementById("editModal");
    if (event.target == modal) {
        closeEditModal();
    }
}