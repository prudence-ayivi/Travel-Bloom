document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Search functionality
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            console.log(`Searching for: ${query}`);
            // Add logic to handle search functionality (e.g., API call or filtering)
        } else {
            alert('Please enter a search term.');
        }
    });

    // Reset functionality
    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        console.log('Search input cleared.');
        // Add logic to clear search results if necessary
    });
});


// Function to clear search results
function clearResults() {
    const section = document.getElementById("recommendation-section");
    section.innerHTML = ""; // Clear results
    document.getElementById("search-input").value = ""; // Clear search input
  }
  
  // Event listener for the clear button
  document.getElementById("reset-btn").addEventListener("click", clearResults);
  

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
      document.getElementById("recommendation-section").innerHTML =
        "<p>Something went wrong while fetching data. Please try again later.</p>";
    }
  }

  
// Function to get the current local time for a given time zone
function getLocalTime(timeZone) {
    const options = { timeZone, hour12: true, hour: "numeric", minute: "numeric", second: "numeric" };
    return new Date().toLocaleTimeString("en-US", options);
  }
  
  // Modify renderRecommendations to include local time
  function renderRecommendations(recommendations) {
    const section = document.getElementById("recommendation-section");
    section.innerHTML = ""; // Clear previous results
  
    if (recommendations.length > 0) {
      recommendations.forEach((item) => {
        const card = document.createElement("div");
        card.className = "recommendation-card";
  
        // Determine the time zone for the recommendation (example zones are added below)
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
            <p><strong>Local Time:</strong> ${localTime}</p>
          </div>
        `;
  
        section.appendChild(card);
      });
    } else {
      section.innerHTML = "<p>No recommendations found. Try another keyword!</p>";
    }
  }
  
  // Event listener for search functionality
  document.getElementById("search-button").addEventListener("click", () => {
    const searchBar = document.getElementById("search-bar");
    const keyword = searchBar.value.trim();
    if (keyword) {
      fetchRecommendations(keyword);
    }
  });
  