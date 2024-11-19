let selectedRating = 0;

// Handle form submission
document.getElementById("reviewForm").addEventListener("submit", async function(e) {
    e.preventDefault(); // Prevent page reload

    const name = document.getElementById("name").value;
    const rating = selectedRating;
    const text = document.getElementById("review").value;

    // Send the review data to the server
    try {
        const response = await fetch("http://localhost:3000/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, rating, text }),
        });

        if (response.ok) {
            alert("Review added successfully!");
            renderReviews(); // Re-render reviews
            document.getElementById("reviewForm").reset(); // Reset form after submission
            clearStars(); // Reset star rating UI
        } else {
            alert("Failed to submit review.");
        }
    } catch (error) {
        console.error("Error submitting review:", error);
    }
});

// Render reviews (from the GET endpoint)
async function renderReviews() {
    const reviewsContainer = document.getElementById("reviewsContainer");
    reviewsContainer.innerHTML = ""; // Clear previous reviews

    try {
        const response = await fetch("http://localhost:3000/reviews");
        const reviews = await response.json();

        reviews.forEach((review) => {
            const reviewDiv = document.createElement("div");
            reviewDiv.classList.add("review");
            reviewDiv.innerHTML = `
                <div class="review-name">${review.name}</div>
                <div class="stars">${'⭐'.repeat(review.rating)}</div>
                <p>${review.text}</p>
            `;
            reviewsContainer.appendChild(reviewDiv);
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
    }
}

// Create star rating elements (5 stars)
function createStarRating() {
    const starRatingContainer = document.getElementById("starRating");

    // Create 5 stars dynamically
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement("span");
        star.dataset.value = i; // Store the rating value in a data attribute
        
        // Add click event listener to each star
        star.addEventListener("click", function() {
            selectedRating = i;
            updateStarDisplay(i);
        });

        // Append the star to the container
        starRatingContainer.appendChild(star);
    }
}

// Update the color of the stars based on selection
function updateStarDisplay(rating) {
    const stars = document.querySelectorAll(".star-rating span");
    stars.forEach(star => {
        if (parseInt(star.dataset.value) <= rating) {
            star.classList.add("selected");  // Turn gold for selected stars
        } else {
            star.classList.remove("selected");  // Keep no fill for unselected stars
        }
    });
}

// Clear the selected stars
function clearStars() {
    const stars = document.querySelectorAll(".star-rating span");
    stars.forEach(star => {
        star.classList.remove("selected");
    });
    selectedRating = 0;
}

// Initial render of reviews and stars
createStarRating();
renderReviews();
