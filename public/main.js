function addArrayItem(arrayContainer, itemValue = "") {
  const arrayItem = document.createElement("div");
  arrayItem.classList.add("array-item");
  const input = document.createElement("input");
  input.type = "text";
  input.value = itemValue;
  arrayItem.appendChild(input);
  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.classList.add("remove-button");
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", () => {
    arrayContainer.removeChild(arrayItem);
  });
  arrayItem.appendChild(removeButton);
  arrayContainer.appendChild(arrayItem);
}

const appliances = [];
const utilities = [];
const features = [];

const appliancesContainer = document.getElementById("appliances");
const utilitiesContainer = document.getElementById("utilities");
const featuresContainer = document.getElementById("features");

appliances.forEach((appliance) => addArrayItem(appliancesContainer, appliance));
utilities.forEach((utility) => addArrayItem(utilitiesContainer, utility));
features.forEach((feature) => addArrayItem(featuresContainer, feature));

document.getElementById("add-appliance").addEventListener("click", () => {
  addArrayItem(appliancesContainer);
});

document.getElementById("add-utility").addEventListener("click", () => {
  addArrayItem(utilitiesContainer);
});

document.getElementById("add-feature").addEventListener("click", () => {
  addArrayItem(featuresContainer);
});

// Add the existing code in main.js here

function getArrayValues(arrayContainer) {
  const inputs = arrayContainer.querySelectorAll(".array-item input");
  return Array.from(inputs).map((input) => input.value);
}

function handleSubmit() {
  const sqft = document.getElementById("sqft").value;
  const bedrooms = document.getElementById("bedrooms").value;
  const fullBathrooms = document.getElementById("full-bathrooms").value;
  const halfBathrooms = document.getElementById("half-bathrooms").value;
  const garageSpaces = document.getElementById("garage-spaces").value;
  const levels = document.getElementById("levels").value;
  const type = document.getElementById("type").value;
  const year = document.getElementById("year").value;

  const appliances = getArrayValues(appliancesContainer);
  const utilities = getArrayValues(utilitiesContainer);
  const features = getArrayValues(featuresContainer);

  const result = {
    interior: {
      sqft,
      bedrooms,
      bathrooms: {
        full: fullBathrooms,
        half: halfBathrooms,
      },
      applicances: appliances,
    },
    "property-details": {
      garage: {
        spaces: garageSpaces,
      },
      levels,
      type,
      utilities,
      year,
    },
    "notable-features": features,
  };

  fetchData(result);
}

// Add event listener for the submit button
document
  .getElementById("submit-button")
  .addEventListener("click", handleSubmit);

function fetchData(requestData) {
  console.log(JSON.stringify(requestData));
  // Perform the Web API request (replace '/api-endpoint' with the actual endpoint)
  fetch("/api/descriptions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData), // Replace this with the actual data to send to the server
  })
    .then((response) => response.json())
    .then((data) => {
      // Display the response below the form
      const responseContainer = document.getElementById("response-container");
      responseContainer.innerHTML = `<p>${data.message}</p>`;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
