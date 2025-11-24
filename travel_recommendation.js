
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

    // Popup function
    function showPopup(message) {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '9999';

        const popup = document.createElement('div');
        popup.style.backgroundColor = '#fff';
        popup.style.padding = '20px 30px';
        popup.style.borderRadius = '10px';
        popup.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        popup.style.textAlign = 'center';
               popup.style.fontFamily = 'Arial, sans-serif';

        popup.innerHTML = `
            <h3 style="color:#0077b6; margin-bottom:10px;">Notice</h3>
            <p style="color:#333; font-size:16px;">${message}</p>
            <button style="margin-top:15px; padding:10px 20px; background:#0077b6; color:#fff; border:none; border-radius:5px; cursor:pointer;">OK</button>
        `;

        popup.querySelector('button').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        overlay.appendChild(popup);
        document.body.appendChild(overlay);
    }

    searchButton.addEventListener('click', () => {
        const keyword = searchInput.value.trim().toLowerCase();
        resultsContainer.innerHTML = ''; // Clear previous results

        if (!keyword) {
            showPopup('Please enter a keyword.');
            return;
        }

        let itemsToShow = null;

        //Category-based search
        if (['beach', 'beaches'].includes(keyword)) {
            itemsToShow = data.beaches;
        } else if (['temple', 'temples'].includes(keyword)) {
            itemsToShow = data.temples;
        } else if (['country', 'countries', 'city', 'cities'].includes(keyword)) {
            itemsToShow = [];
            data.countries.forEach(country => {
                itemsToShow.push(...country.cities);
            });
        } else {
            // Country or city name search
            let matches = [];
            data.countries.forEach(country => {
                if (country.name.toLowerCase().includes(keyword)) {
                    matches.push(...country.cities);
                } else {
                    country.cities.forEach(city => {
                        if (city.name.toLowerCase().includes(keyword)) {
                            matches.push(city);
                        }
                    });
                }
            });

            data.temples.forEach(temple => {
                if (temple.name.toLowerCase().includes(keyword)) {
                    matches.push(temple);
                }
            });
            data.beaches.forEach(beach => {
                if (beach.name.toLowerCase().includes(keyword)) {
                    matches.push(beach);
                }
            });

            if (matches.length > 0) {
                itemsToShow = matches;
            }
        }

        // Show popup if nothing found
        if (!itemsToShow || itemsToShow.length === 0) {
            showPopup('No results found. Try "beach", "temple", "country", or a city/country name.');
            return;
        }

        // Display up to 6 results
        itemsToShow.slice(0, 6).forEach(place => {
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
