const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const resetBtn = document.getElementById("reset-btn");
const searchResult = document.getElementById("recommendation-section");

// Clear search functionality
resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  searchResult.innerHTML = ""; // Clear the results as well
  console.log("Search input cleared.");
});

// Function to fetch and filter recommendations based on keyword
async function fetchRecommendations(keyword) {
  try {
    // Fetch the JSON data
    const response = await fetch("travel_recommendation_api.json");
    const data = await response.json();

    // Filter data based on keyword
    let filteredData = [];
    keyword = keyword.toLowerCase();

    if (keyword.includes("beach")) {
      filteredData = data.beaches; 
    } else if (keyword.includes("temple")) {
      filteredData = data.temples;
    } else {
      // Search in countries and their cities
      filteredData = data.countries.flatMap((country) =>
        country.cities.filter((city) =>
          city.name.toLowerCase().includes(keyword)
        )
      );
    }

    // Render recommendations
    renderRecommendations(filteredData);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    searchResult.innerHTML = `<p class="no-content">Something went wrong while fetching data. Please try again later.</p>`;
  }
}

// Function to get the current local time for a given time zone
function getLocalTime(timeZone) {
  const options = {
    timeZone,
    hour12: true,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  return new Date().toLocaleTimeString("en-US", options);
}

// Modify renderRecommendations to include local time
function renderRecommendations(recommendations) {
  searchResult.innerHTML = ""; // Clear previous results

  if (recommendations.length > 0) {
    // Add the result-bar at the top
    const searchContent = document.createElement("div");
    searchContent.className = "result-bar";
    searchResult.appendChild(searchContent);

    recommendations.forEach((item) => {
      const card = document.createElement("div");
      card.className = "recommendation-card";

      // Determine the time zone for the recommendation
      let timeZone = "UTC"; // Default to UTC
      if (item.name.includes("Australia")) timeZone = "Australia/Sydney";
      else if (item.name.includes("Japan")) timeZone = "Asia/Tokyo";
      else if (item.name.includes("Brazil")) timeZone = "America/Sao_Paulo";

      const localTime = getLocalTime(timeZone); // Get local time

      card.innerHTML = `
          <img src="${item.imageUrl}" alt="${item.name}">
          <div class="content">
            <h2>${item.name}</h2>
            <p>${item.description}</p>
            <p><strong>Local Time :</strong> ${localTime}</p>
            <button>Visit</button>
          </div>
        `;

      searchResult.appendChild(card);
    });
  } else {
    searchResult.innerHTML = `<p class="no-content">No recommendations found. Try another keyword!</p>`;
  }
}

// Search functionality
searchBtn.addEventListener("click", () => {
  const keyword = searchInput.value.trim();
  if (keyword) {
    console.log(`Searching for: ${keyword}`);
    fetchRecommendations(keyword);
  } else {
    alert("Please enter a search item.");
  }
});
