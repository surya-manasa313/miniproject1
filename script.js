const countriesContainer = document.getElementById("countriesContainer");
const searchInput = document.getElementById("searchInput");
const regionFilter = document.getElementById("regionFilter");
const themeBtn = document.getElementById("themeBtn");

const modal = document.getElementById("countryModal");
const modalBody = document.getElementById("modalBody");
const closeBtn = document.querySelector(".close-btn");

let countriesData = [];

// Fetch country data
async function fetchCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();

    countriesData = data.sort((a, b) =>
      a.name.common.localeCompare(b.name.common)
    );

    displayCountries(countriesData);
  } catch (error) {
    countriesContainer.innerHTML = "<p>Failed to load country data.</p>";
    console.error(error);
  }
}

// Display countries
function displayCountries(countries) {
  countriesContainer.innerHTML = "";

  countries.forEach(country => {
    const card = document.createElement("div");
    card.classList.add("country-card");

    card.innerHTML = `
      <img src="${country.flags.svg}" alt="${country.name.common}" loading="lazy">
      <div class="country-info">
        <h2>${country.name.common}</h2>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      </div>
    `;

    card.addEventListener("click", () => showCountryDetails(country));

    countriesContainer.appendChild(card);
  });
}

// Search functionality
searchInput.addEventListener("input", () => {
  filterCountries();
});

// Region filter
regionFilter.addEventListener("change", () => {
  filterCountries();
});

function filterCountries() {
  const searchValue = searchInput.value.toLowerCase();
  const regionValue = regionFilter.value;

  const filtered = countriesData.filter(country => {
    const matchesSearch = country.name.common
      .toLowerCase()
      .includes(searchValue);

    const matchesRegion =
      regionValue === "all" || country.region === regionValue;

    return matchesSearch && matchesRegion;
  });

  displayCountries(filtered);
}

// Modal details
function showCountryDetails(country) {
  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map(c => c.name)
        .join(", ")
    : "N/A";

  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "N/A";

  modalBody.innerHTML = `
    <h2>${country.name.common}</h2>
    <img src="${country.flags.svg}" width="100%" style="margin:15px 0; border-radius:10px;" />
    <p><strong>Official Name:</strong> ${country.name.official}</p>
    <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
    <p><strong>Region:</strong> ${country.region}</p>
    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    <p><strong>Languages:</strong> ${languages}</p>
    <p><strong>Currencies:</strong> ${currencies}</p>
    <p><strong>Timezones:</strong> ${country.timezones.join(", ")}</p>
  `;

  modal.classList.remove("hidden");
}

// Close modal
closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

// Dark mode
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    themeBtn.textContent = "☀️ Light Mode";
  } else {
    themeBtn.textContent = "🌙 Dark Mode";
  }
});

// Initialize
fetchCountries();
