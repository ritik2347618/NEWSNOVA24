// ======================================================
// NEWSNOVA24 - MAIN WEBSITE JAVASCRIPT
// MongoDB API Version
// ======================================================


// ======================================================
// 1. CURRENT DATE
// ======================================================

const dateElement = document.getElementById("date");

if (dateElement) {

    const today = new Date();

    dateElement.innerText = today.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

}


// ======================================================
// 2. BREAKING NEWS
// ======================================================

const breakingNews = [

    "India launches new satellite",
    "Breaking News from Bihar",
    "Stock Market reaches new high",
    "AI Revolution starts",
    "Cricket World Cup Updates"

];

let breakingIndex = 0;

const marqueeElement =
    document.querySelector("marquee");


if (marqueeElement) {

    setInterval(function () {

        marqueeElement.innerHTML =
            "🔴 BREAKING : " +
            breakingNews[breakingIndex];

        breakingIndex++;

        if (breakingIndex >= breakingNews.length) {
            breakingIndex = 0;
        }

    }, 3000);

}


// ======================================================
// 3. ABHISHEK PROFILE
// ======================================================

function showAbhishek() {

    const abhishekProfile =
        document.getElementById("abhishek");

    const ritikProfile =
        document.getElementById("ritik");


    if (abhishekProfile) {
        abhishekProfile.style.display = "block";
    }

    if (ritikProfile) {
        ritikProfile.style.display = "none";
    }

    if (abhishekProfile) {

        abhishekProfile.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


// ======================================================
// 4. RITIK PROFILE
// ======================================================

function showRitik() {

    const ritikProfile =
        document.getElementById("ritik");

    const abhishekProfile =
        document.getElementById("abhishek");


    if (ritikProfile) {
        ritikProfile.style.display = "block";
    }

    if (abhishekProfile) {
        abhishekProfile.style.display = "none";
    }

    if (ritikProfile) {

        ritikProfile.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


// ======================================================
// 5. CONTACT SECTION
// ======================================================

const contactLink =
    document.querySelector('a[href="#contact"]');


if (contactLink) {

    contactLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            const contactSection =
                document.getElementById("contact");

            if (contactSection) {

                contactSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }
    );

}


// ======================================================
// 6. NEWS CONTAINER
// ======================================================

const newsContainer =
    document.getElementById("news-container");


// ======================================================
// 7. GET NEWS FROM MONGODB
// ======================================================

async function loadPublishedNews() {

    if (!newsContainer) {
        return;
    }


    try {

        const response =
            await fetch("/api/news");


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Unable to load news"
            );

        }


        const publishedNews =
            result.news || [];


        displayNews(publishedNews);


    } catch (error) {

        console.error(
            "Unable to load news:",
            error
        );


        newsContainer.innerHTML = `

            <p id="no-news-message">
                Unable to load news.
            </p>

        `;

    }

}


// ======================================================
// 8. DISPLAY NEWS ON HOMEPAGE
// ======================================================

function displayNews(publishedNews) {

    newsContainer.innerHTML = "";


    // NO NEWS

    if (publishedNews.length === 0) {

        newsContainer.innerHTML = `

            <p id="no-news-message">
                No news published yet.
            </p>

        `;

        return;

    }


    // DISPLAY ARTICLES

    publishedNews.forEach(function (article) {


        const newsCard =
            document.createElement("article");


        newsCard.classList.add(
            "news-card"
        );


        newsCard.style.cursor =
            "pointer";


        // MongoDB uses _id

        newsCard.id =
            "news-" + article._id;


        // Open Full Article

        newsCard.addEventListener(
            "click",
            function () {

                window.location.href =
                    "article.html?id=" +
                    article._id;

            }
        );


        // Format MongoDB Date

        const articleDate =
            new Date(
                article.createdAt
            ).toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                }
            );


        newsCard.innerHTML = `

            <img
                src="${article.image}"
                alt="${article.title}"
                class="news-image"
            >


            <div class="news-content">


                <span class="news-category">
                    ${article.category}
                </span>


                <h3 class="news-headline">
                    ${article.title}
                </h3>


                <p class="news-description">
                    ${article.description}
                </p>


                <div class="news-info">


                    <span class="news-author">
                        By ${article.author}
                    </span>


                    <span class="news-date">
                        ${articleDate}
                    </span>


                </div>


            </div>

        `;


        newsContainer.appendChild(
            newsCard
        );

    });

}


// ======================================================
// 9. SEARCH NEWS
// ======================================================

const searchInput =
    document.querySelector(
        ".search-box input"
    );


const searchButton =
    document.querySelector(
        ".search-box button"
    );


if (searchButton && searchInput) {

    searchButton.addEventListener(
        "click",
        function () {

            searchNews();

        }
    );


    searchInput.addEventListener(
        "keypress",
        function (event) {

            if (event.key === "Enter") {

                searchNews();

            }

        }
    );

}


// ======================================================
// 10. SEARCH FUNCTION
// ======================================================

function searchNews() {

    if (!searchInput) {
        return;
    }


    const searchValue =
        searchInput.value
            .toLowerCase()
            .trim();


    const newsCards =
        document.querySelectorAll(
            ".news-card"
        );


    newsCards.forEach(
        function (card) {


            const headline =
                card
                    .querySelector(
                        ".news-headline"
                    )
                    .innerText
                    .toLowerCase();


            const category =
                card
                    .querySelector(
                        ".news-category"
                    )
                    .innerText
                    .toLowerCase();


            const description =
                card
                    .querySelector(
                        ".news-description"
                    )
                    .innerText
                    .toLowerCase();


            if (
                headline.includes(searchValue) ||
                category.includes(searchValue) ||
                description.includes(searchValue)
            ) {

                card.style.display =
                    "block";

            }

            else {

                card.style.display =
                    "none";

            }

        }
    );


    const latestNewsSection =
        document.getElementById(
            "latest-news-section"
        );


    if (latestNewsSection) {

        latestNewsSection.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// ======================================================
// 11. LOAD NEWS WHEN PAGE OPENS
// ======================================================

loadPublishedNews();