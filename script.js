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
// 3. HIDE ALL CO-FOUNDER PROFILES
// ======================================================

function hideAllProfiles() {

    const abhishekProfile =
        document.getElementById("abhishek");

    const ritikProfile =
        document.getElementById("ritik");

    const praveenProfile =
        document.getElementById("praveen");


    if (abhishekProfile) {

        abhishekProfile.style.display = "none";

    }


    if (ritikProfile) {

        ritikProfile.style.display = "none";

    }


    if (praveenProfile) {

        praveenProfile.style.display = "none";

    }

}


// ======================================================
// 4. ABHISHEK TIWARI PROFILE
// ======================================================

function showAbhishek() {

    hideAllProfiles();


    const abhishekProfile =
        document.getElementById("abhishek");


    if (!abhishekProfile) {

        return;

    }


    abhishekProfile.style.display = "block";


    abhishekProfile.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


// ======================================================
// 5. RITIK KUMAR PROFILE
// ======================================================

function showRitik() {

    hideAllProfiles();


    const ritikProfile =
        document.getElementById("ritik");


    if (!ritikProfile) {

        return;

    }


    ritikProfile.style.display = "block";


    ritikProfile.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


// ======================================================
// 6. PRAVEEN KUMAR GUPTA PROFILE
// ======================================================

function showPraveen() {

    hideAllProfiles();


    const praveenProfile =
        document.getElementById("praveen");


    if (!praveenProfile) {

        return;

    }


    praveenProfile.style.display = "block";


    praveenProfile.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


// ======================================================
// 7. CONTACT SECTION
// ======================================================

const contactLink =
    document.querySelector(
        'a[href="#contact"]'
    );


if (contactLink) {

    contactLink.addEventListener(

        "click",

        function (event) {

            event.preventDefault();


            const contactSection =
                document.getElementById(
                    "contact"
                );


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
// 8. NEWS CONTAINER
// ======================================================

const newsContainer =
    document.getElementById(
        "news-container"
    );


// ======================================================
// 9. GET NEWS FROM MONGODB
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


        displayNews(
            publishedNews
        );


    }

    catch (error) {

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
// 10. DISPLAY NEWS ON HOMEPAGE
// ======================================================

function displayNews(publishedNews) {

    if (!newsContainer) {

        return;

    }


    newsContainer.innerHTML = "";


    // ==================================================
    // NO NEWS
    // ==================================================

    if (publishedNews.length === 0) {

        newsContainer.innerHTML = `

            <p id="no-news-message">

                No news published yet.

            </p>

        `;


        return;

    }


    // ==================================================
    // DISPLAY ARTICLES
    // ==================================================

    publishedNews.forEach(

        function (article) {


            const newsCard =
                document.createElement(
                    "article"
                );


            newsCard.classList.add(
                "news-card"
            );


            newsCard.style.cursor =
                "pointer";


            // MongoDB uses _id

            newsCard.id =
                "news-" +
                article._id;


            // ==========================================
            // OPEN FULL ARTICLE
            // ==========================================

            newsCard.addEventListener(

                "click",

                function () {

                    window.location.href =

                        "article.html?id=" +

                        article._id;

                }

            );


            // ==========================================
            // FORMAT MONGODB DATE
            // ==========================================

            const articleDate =
                new Date(
                    article.createdAt
                )
                .toLocaleDateString(

                    "en-IN",

                    {

                        day: "2-digit",

                        month: "long",

                        year: "numeric"

                    }

                );


            // ==========================================
            // CREATE NEWS CARD
            // ==========================================

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

        }

    );

}


// ======================================================
// 11. SEARCH NEWS
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


    // SEARCH BUTTON

    searchButton.addEventListener(

        "click",

        function () {

            searchNews();

        }

    );


    // ENTER KEY SEARCH

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
// 12. SEARCH FUNCTION
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


            const headlineElement =

                card.querySelector(

                    ".news-headline"

                );


            const categoryElement =

                card.querySelector(

                    ".news-category"

                );


            const descriptionElement =

                card.querySelector(

                    ".news-description"

                );


            if (
                !headlineElement ||
                !categoryElement ||
                !descriptionElement
            ) {

                return;

            }


            const headline =

                headlineElement

                    .innerText

                    .toLowerCase();


            const category =

                categoryElement

                    .innerText

                    .toLowerCase();


            const description =

                descriptionElement

                    .innerText

                    .toLowerCase();


            if (

                headline.includes(
                    searchValue
                )

                ||

                category.includes(
                    searchValue
                )

                ||

                description.includes(
                    searchValue
                )

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


    // Scroll to Latest News

    const latestNewsSection =

        document.getElementById(

            "latest-news-section"

        );


    if (latestNewsSection) {

        latestNewsSection.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }

}


// ======================================================
// 13. LOAD NEWS WHEN WEBSITE OPENS
// ======================================================

loadPublishedNews();