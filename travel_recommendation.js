
// Fetch data from travel_recommendation_api.json
fetch('travel_recommendation_api.json')
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
        return response.json();
    })
    .then(data => {
        console.log('Travel Data Loaded:', data);
        setupSearch(data);
    })
    .catch(error => console.error('Error fetching data:', error));

function setupSearch(data) {
    const searchInput = document.querySelector('.search-bar input[type="text"]');
    const searchButton = document.querySelector('.search-bar button[type="button"]'); // Search
    const clearButton = document.querySelector('.search-bar button[type="reset"]');   // Clear

    // Create results container
    let resultsContainer = document.getElementById('results');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'results';
        resultsContainer.style.margin = '30px';
        resultsContainer.style.display = 'grid';
        resultsContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
        resultsContainer.style.gap = '20px';
        document.body.appendChild(resultsContainer);
    }

   
    searchButton.addEventListener('click', () => {
        const keyword = searchInput.value.trim().toLowerCase();
        resultsContainer.innerHTML = ''; // Clear previous results

        if (!keyword) {
            resultsContainer.innerHTML = '<p>Please enter a keyword.</p>';
            return;
        }

        // Match keyword groups
        let category = '';
        if (['beach', 'beaches'].includes(keyword)) {
            category = 'beaches';
        } else if (['temple', 'temples'].includes(keyword)) {
            category = 'temples';
        } else if (['country', 'countries'].includes(keyword)) {
            category = 'countries';
        }

        if (!category) {
            resultsContainer.innerHTML = '<p>No results found. Try "beach", "temple", or "country".</p>';
            return;
        }

        // Get recommendations for the matched category
        const recommendations = data[category] || [];

        if (recommendations.length === 0) {
            resultsContainer.innerHTML = '<p>No recommendations available for this category.</p>';
            return;
        }

        // Display at least two recommendations
        recommendations.slice(0, 2).forEach(place => {
            const card = document.createElement('div');
            card.style.backgroundColor = 'rgba(255,255,255,0.9)';
            card.style.padding = '15px';
            card.style.borderRadius = '10px';
            card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            card.style.textAlign = 'center';
            card.innerHTML = `
                <img src="${place.imageUrl}" alt="${place.name}" style="width:100%; height:180px; object-fit:cover; border-radius:8px;">
                <h3 style="color:#0077b6; margin-top:10px;">${place.name}</h3>
                <p style="color:#555;">${place.description}</p>
            `;
            resultsContainer.appendChild(card);
        });
    });

  
    clearButton.addEventListener('click', () => {
        searchInput.value = '';           // Clear input field
        resultsContainer.innerHTML = '';  // Clear results
    });
}
