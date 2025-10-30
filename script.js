// Include the movieDatabase array here (from movies.js)

// Initialize Fuse.js
const options = {
    keys: ['title', 'genre', 'cast', 'director', 'language', 'mood'],
    threshold: 0.3, // Adjust based on desired fuzziness
    includeScore: true
};

let fuse = new Fuse(movieDatabase, options);

let currentPage = 1;
const moviesPerPage = 10; // Adjust as needed
let currentFilteredMovies = [];

function searchMovies() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const selectedMood = document.getElementById('moodSelect').value.toLowerCase();
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
    currentPage = 1;

    let filteredMovies = movieDatabase;

    if (searchTerm) {
        const fuseResults = fuse.search(searchTerm);
        filteredMovies = fuseResults.map(result => result.item);
    }

    if (selectedMood) {
        filteredMovies = filteredMovies.filter(movie => movie.mood.toLowerCase() === selectedMood);
    }

    currentFilteredMovies = filteredMovies;

    displayMovies();
}

function displayMovies() {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (currentFilteredMovies.length === 0) {
        resultsContainer.innerHTML = '<p>No movies found matching your criteria.</p>';
        updatePagination();
        return;
    }

    const startIndex = (currentPage - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const moviesToDisplay = currentFilteredMovies.slice(startIndex, endIndex);

    moviesToDisplay.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title} Poster" class="movie-poster">
            <h3>${movie.title} (${movie.year})</h3>
            <p><strong>Genre:</strong> ${movie.genre.join(', ')}</p>
            <p><strong>Rating:</strong> ${movie.rating}/10</p>
            <p><strong>Director:</strong> ${movie.director}</p>
            <p><strong>Cast:</strong> ${movie.cast.join(', ')}</p>
            <p><strong>Mood:</strong> ${movie.mood}</p>
        `;
        resultsContainer.appendChild(movieCard);
    });

    updatePagination();
}

function nextPage() {
    if (currentPage * moviesPerPage < currentFilteredMovies.length) {
        currentPage++;
        displayMovies();
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayMovies();
    }
}

function updatePagination() {
    const pageNumber = document.getElementById('pageNumber');
    const totalPages = Math.ceil(currentFilteredMovies.length / moviesPerPage);
    pageNumber.textContent = `${currentPage} / ${totalPages}`;

    // Enable/disable buttons based on current page
    document.querySelector('.pagination button:nth-child(1)').disabled = currentPage === 1;
    document.querySelector('.pagination button:nth-child(3)').disabled = currentPage === totalPages || currentFilteredMovies.length === 0;
}

// Initialize with all movies displayed
window.onload = function() {
    currentFilteredMovies = movieDatabase;
    displayMovies();
}