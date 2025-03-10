document.addEventListener("DOMContentLoaded", function () {
  const today = new Date();
  const maxBirthDate = new Date(today);
  maxBirthDate.setFullYear(today.getFullYear() - 120);
  document.getElementById("dob").max = today.toISOString().split("T")[0];
  document.getElementById("dob").min = maxBirthDate.toISOString().split("T")[0];
  document.getElementById("time").innerHTML = today.toLocaleDateString();

  const states = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
    "DC",
    "PR",
  ];
  const stateSelect = document.getElementById("state");
  states.forEach((state) => {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = state;
    stateSelect.appendChild(option);
  });

  // Cookie Management Functions
  function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function deleteCookie(cname) {
    document.cookie =
      cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  // Create a user banner if not already present
  if (!document.querySelector(".user-banner")) {
    const bannerDiv = document.createElement("div");
    bannerDiv.className = "user-banner";
    document.querySelector(".banner").appendChild(bannerDiv);
  }

  // Welcome Banner and Prefilled Data
  const banner = document.querySelector(".user-banner");
  const fnameInput = document.getElementById("fname");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const firstName = getCookie("fname");
  const email = getCookie("email");
  const phone = getCookie("phone");

  if (firstName) {
    banner.textContent = `Welcome back, ${firstName}!`;
    fnameInput.value = firstName;
    if (email) emailInput.value = email;
    if (phone) phoneInput.value = phone;

    // Add "Not Me" Checkbox
    const notUserCheckbox = document.createElement("input");
    notUserCheckbox.type = "checkbox";
    notUserCheckbox.id = "notUserCheckbox";
    const notUserLabel = document.createElement("label");
    notUserLabel.htmlFor = "notUserCheckbox";
    notUserLabel.textContent = `Not ${firstName}? Click here to start as a NEW USER.`;

    banner.appendChild(notUserCheckbox);
    banner.appendChild(notUserLabel);

    notUserCheckbox.addEventListener("change", function () {
      if (this.checked) {
        deleteCookie("fname");
        deleteCookie("email");
        deleteCookie("phone");
        fnameInput.value = "";
        emailInput.value = "";
        phoneInput.value = "";
        banner.textContent = "Hello, New User!";
        this.remove();
        notUserLabel.remove();
      }
    });
  } else {
    banner.textContent = "Hello, New User!";
  }

  // "Remember Me" Checkbox
  const rememberMeCheckbox = document.createElement("input");
  rememberMeCheckbox.type = "checkbox";
  rememberMeCheckbox.id = "rememberMe";
  rememberMeCheckbox.checked = true;
  const rememberMeLabel = document.createElement("label");
  rememberMeLabel.htmlFor = "rememberMe";
  rememberMeLabel.textContent = "Remember Me";

  const submitRow = document
    .getElementById("registrationForm")
    .querySelector("tr:last-child td");
  submitRow.appendChild(rememberMeCheckbox);
  submitRow.appendChild(rememberMeLabel);

  // User ID validation
  document.getElementById("userid").addEventListener("input", function (e) {
    const value = e.target.value;
    if (value.length === 1 && !/^[A-Za-z]$/.test(value)) {
      e.target.value = "";
      document.getElementById("useridError").innerText =
        "User ID must start with a letter.";
    } else if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(value)) {
      e.target.value = value.slice(0, -1);
      document.getElementById("useridError").innerText =
        "User ID can contain letters, numbers, underscores, or hyphens.";
    } else {
      document.getElementById("useridError").innerText = "";
    }
  });

  // DOB validation
  if (!document.getElementById("dobError")) {
    const dobErrorSpan = document.createElement("span");
    dobErrorSpan.id = "dobError";
    dobErrorSpan.className = "error-message";
    document.getElementById("dob").parentNode.appendChild(dobErrorSpan);
  }

  document.getElementById("dob").addEventListener("change", function (e) {
    const dobValue = e.target.value;
    const selectedDate = new Date(dobValue);
    const dobError = document.getElementById("dobError");

    if (selectedDate > today || selectedDate < maxBirthDate) {
      dobError.innerText =
        "Birth date must be within the last 120 years and not in the future.";
      e.target.value = "";
    } else {
      dobError.innerText = "";
    }
  });

  // Phone validation
  if (!document.getElementById("phoneError")) {
    const phoneErrorSpan = document.createElement("span");
    phoneErrorSpan.id = "phoneError";
    phoneErrorSpan.className = "error-message";
    document.getElementById("phone").parentNode.appendChild(phoneErrorSpan);
  }

  document.getElementById("phone").addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");
    const phoneError = document.getElementById("phoneError");

    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    if (value.length > 6) {
      e.target.value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(
        6,
        10
      )}`;
    } else if (value.length > 3) {
      e.target.value = `${value.slice(0, 3)}-${value.slice(3, 6)}`;
    } else {
      e.target.value = value;
    }

    if (value.length === 10) {
      phoneError.innerText = "";
    } else {
      phoneError.innerText = "Phone number must be in the format 123-456-7890.";
    }
  });

  // Email validation
  if (!document.getElementById("emailError")) {
    const emailErrorSpan = document.createElement("span");
    emailErrorSpan.id = "emailError";
    emailErrorSpan.className = "error-message";
    document.getElementById("email").parentNode.appendChild(emailErrorSpan);
  }

  document.getElementById("email").addEventListener("input", function (e) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValue = e.target.value;
    const emailError = document.getElementById("emailError");

    if (!emailPattern.test(emailValue)) {
      emailError.innerText = "Please enter a valid email address.";
      emailError.style.display = "block";
    } else {
      emailError.innerText = "";
      emailError.style.display = "none";
    }
  });

  // Password validation
  document.getElementById("password").addEventListener("input", function (e) {
    const password = e.target.value;
    const passwordPattern =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
    if (!passwordPattern.test(password)) {
      document.getElementById("passwordError").innerText =
        "Password must be 8-30 chars, include an uppercase letter, number, and special character.";
    } else {
      document.getElementById("passwordError").innerText = "";
    }
  });

  // Add event listener for health scale
  const healthScale = document.getElementById("healthScale");
  if (healthScale) {
    // Initialize the health value display
    updateHealthValue();

    // Add event listener for changes
    healthScale.addEventListener("input", function () {
      updateHealthValue();
    });
  }

  // Form submission
  document
    .getElementById("registrationForm")
    .addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent traditional form submission

      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm_password").value;

      if (password !== confirmPassword) {
        alert("Passwords do not match. Please re-enter your passwords.");
        return;
      }

      const firstNameValue = fnameInput.value;
      const emailValue = emailInput.value;
      const phoneValue = phoneInput.value;

      if (rememberMeCheckbox.checked) {
        setCookie("fname", firstNameValue, 2);
        setCookie("email", emailValue, 2);
        setCookie("phone", phoneValue, 2);
      } else {
        deleteCookie("fname");
        deleteCookie("email");
        deleteCookie("phone");
      }

      alert("Form submitted successfully!");
      window.location.href = "thankyou.html";
    });

  // ZIP Code Validation
  if (!document.getElementById("zipError")) {
    const zipErrorSpan = document.createElement("span");
    zipErrorSpan.id = "zipError";
    zipErrorSpan.className = "error-message";
    document.getElementById("zip").parentNode.appendChild(zipErrorSpan);
  }

  document.getElementById("zip").addEventListener("input", function (e) {
    let value = e.target.value;
    const zipError = document.getElementById("zipError");

    value = value.replace(/[^0-9-]/g, "");

    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    if (value.includes("-")) {
      const parts = value.split("-");
      parts[0] = parts[0].slice(0, 5);
      if (parts[1]) {
        parts[1] = parts[1].slice(0, 4);
      }
      e.target.value = parts[1] ? `${parts[0]}-${parts[1]}` : parts[0];
    } else {
      e.target.value = value.slice(0, 5);
    }

    const zipPattern = /^\d{5}(-\d{4})?$/;
    if (!zipPattern.test(e.target.value)) {
      zipError.innerText =
        "Zip code must be 5 digits or in the format 12345-6789.";
      zipError.style.display = "block";
    } else {
      zipError.innerText = "";
      zipError.style.display = "none";
    }
  });

  // Name validation
  document.getElementById("fname").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^A-Za-z'-]/g, "");
  });

  document.getElementById("mname").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^A-Za-z]/g, "");
  });

  document.getElementById("lname").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^A-Za-z'-\d]/g, "");
    e.target.value = e.target.value.replace(/(\d)/g, (match) => {
      return ["2", "3", "4", "5"].includes(match) ? match : "";
    });
  });
});

// Toggle Password Visibility
function togglePassword(fieldId) {
  const field = document.getElementById(fieldId);
  field.type = field.type === "password" ? "text" : "password";
}
window.togglePassword = togglePassword;

// Update Health Value Display
function updateHealthValue() {
  document.getElementById("healthValue").textContent =
    document.getElementById("healthScale").value;
}
window.updateHealthValue = updateHealthValue;

// Improved Review Section Functions
function displayReview() {
  const form = document.getElementById("registrationForm");
  let content = "<ul class='review-list'>";

  // Personal information
  content += `<li><strong>First Name:</strong> ${
    form.fname.value || "Not provided"
  }</li>`;
  content += `<li><strong>Middle Initial:</strong> ${
    form.mname.value || "Not provided"
  }</li>`;
  content += `<li><strong>Last Name:</strong> ${
    form.lname.value || "Not provided"
  }</li>`;
  content += `<li><strong>Date of Birth:</strong> ${
    form.dob.value || "Not provided"
  }</li>`;
  content += `<li><strong>Social Security Number:</strong> ${
    "*".repeat(form.ssn.value.length) || "Not provided"
  }</li>`;

  // Contact information
  content += `<li><strong>User ID:</strong> ${
    form.userid.value || "Not provided"
  }</li>`;
  content += `<li><strong>Password:</strong> ${
    "*".repeat(form.password.value.length) || "Not provided"
  }</li>`;
  content += `<li><strong>Email Address:</strong> ${
    form.email.value || "Not provided"
  }</li>`;
  content += `<li><strong>Phone Number:</strong> ${
    form.phone.value || "Not provided"
  }</li>`;

  // Address
  content += `<li><strong>Address Line 1:</strong> ${
    form.address1.value || "Not provided"
  }</li>`;
  content += `<li><strong>Address Line 2:</strong> ${
    form.address2.value || "Not provided"
  }</li>`;
  content += `<li><strong>City:</strong> ${
    form.city.value || "Not provided"
  }</li>`;
  content += `<li><strong>State:</strong> ${
    form.state.value || "Not provided"
  }</li>`;
  content += `<li><strong>Zip Code:</strong> ${
    form.zip.value || "Not provided"
  }</li>`;

  // Medical history
  const conditions = Array.from(
    form.querySelectorAll('input[name="condition"]:checked')
  )
    .map((input) => input.value)
    .join(", ");
  content += `<li><strong>Medical History:</strong> ${
    conditions || "None selected"
  }</li>`;

  // Gender
  const gender = form.querySelector('input[name="gender"]:checked');
  content += `<li><strong>Gender:</strong> ${
    gender ? gender.value : "Not specified"
  }</li>`;

  // Vaccination status
  const vaccinated = form.querySelector('input[name="vaccinated"]:checked');
  content += `<li><strong>Vaccination Status:</strong> ${
    vaccinated ? vaccinated.value : "Not specified"
  }</li>`;

  // Insurance
  const insurance = form.querySelector('input[name="insurance"]:checked');
  content += `<li><strong>Insurance:</strong> ${
    insurance ? insurance.value : "Not specified"
  }</li>`;

  // Healthcare needs
  const healthcareNeeds = Array.from(
    form.querySelectorAll('input[name="healthcare_needs"]:checked')
  )
    .map((input) => input.value.replace(/_/g, " "))
    .join(", ");
  content += `<li><strong>Healthcare Needs:</strong> ${
    healthcareNeeds || "None selected"
  }</li>`;

  // Allergies
  const allergies = Array.from(
    form.querySelectorAll('input[name="allergies"]:checked')
  )
    .map((input) => input.value)
    .join(", ");
  content += `<li><strong>Known Allergies:</strong> ${
    allergies || "None selected"
  }</li>`;

  // Health scale
  content += `<li><strong>Overall Health Scale:</strong> ${form.health.value}/10</li>`;

  content += "</ul>";

  document.getElementById("reviewContent").innerHTML = content;
  document.getElementById("reviewSection").style.display = "block";

  // Scroll to the review section
  document
    .getElementById("reviewSection")
    .scrollIntoView({ behavior: "smooth" });
}
window.displayReview = displayReview;

function hideReview() {
  document.getElementById("reviewSection").style.display = "none";
  // Scroll back to the form
  document
    .getElementById("registrationForm")
    .scrollIntoView({ behavior: "smooth" });
}
window.hideReview = hideReview;

// Form Validation Function
function validateForm() {
  let formValid = true;

  // Get form fields and validate each
  const fields = {
    firstName: document.getElementById("fname").value,
    middleInitial: document.getElementById("mname").value,
    lastName: document.getElementById("lname").value,
    dob: document.getElementById("dob").value,
    email: document.getElementById("email").value.toLowerCase(),
    phone: document.getElementById("phone").value,
    zip: document.getElementById("zip").value,
  };

  // Validation Patterns
  const patterns = {
    name: /^[A-Za-z'-]+$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\d{3}-\d{3}-\d{4}$/,
    zip: /^\d{5}(-\d{4})?$/,
  };

  // Validate each field, setting formValid to false if any validation fails
  if (!patterns.name.test(fields.firstName)) {
    formValid = false;
    alert("Invalid first name.");
  }
  if (fields.middleInitial && !/^[A-Za-z]$/.test(fields.middleInitial)) {
    formValid = false;
    alert("Invalid middle initial.");
  }
  if (!patterns.name.test(fields.lastName)) {
    formValid = false;
    alert("Invalid last name.");
  }
  if (!patterns.email.test(fields.email)) {
    formValid = false;
    alert("Invalid email address.");
  }
  if (!patterns.phone.test(fields.phone)) {
    formValid = false;
    alert("Phone number must follow 000-000-0000 format.");
  }
  if (!patterns.zip.test(fields.zip)) {
    formValid = false;
    alert("Invalid zip code.");
  }

  // Conditionally show the submit button if all validations pass
  document.getElementById("submitButton").style.display = formValid
    ? "block"
    : "none";

  if (formValid) {
    alert("Form validated successfully! You can now submit.");
  } else {
    alert("Please correct the highlighted fields.");
  }
}
window.validateForm = validateForm;
