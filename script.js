// ======================================================
// NEWSNOVA24 - COMPLETE MAIN WEBSITE JAVASCRIPT
// MongoDB + Search + Profiles + Mobile Menu
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
// 3. MOBILE HAMBURGER MENU
// ======================================================

const menuToggle =
    document.getElementById("menu-toggle");

const navMenu =
    document.getElementById("nav-menu");


if (menuToggle && navMenu) {

    menuToggle.addEventListener(
        "click",
        function () {

            // Open / Close menu

            navMenu.classList.toggle(
                "mobile-menu-open"
            );


            const menuIsOpen =
                navMenu.classList.contains(
                    "mobile-menu-open"
                );


            // Accessibility

            menuToggle.setAttribute(
                "aria-expanded",
                menuIsOpen
            );


            // Change ☰ into X

            const menuIcon =
                menuToggle.querySelector("i");


            if (menuIcon) {

                if (menuIsOpen) {

                    menuIcon.classList.remove(
                        "fa-bars"
                    );

                    menuIcon.classList.add(
                        "fa-xmark"
                    );

                }

                else {

                    menuIcon.classList.remove(
                        "fa-xmark"
                    );

                    menuIcon.classList.add(
                        "fa-bars"
                    );

                }

            }

        }
    );


    // ==================================================
    // CLOSE MENU WHEN USER CLICKS A LINK
    // ==================================================

    const navigationLinks =
        navMenu.querySelectorAll("a");


    navigationLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    if (window.innerWidth <= 600) {

                        closeMobileMenu();

                    }

                }
            );

        }
    );

}


// ======================================================
// 4. CLOSE MOBILE MENU FUNCTION
// ======================================================

function closeMobileMenu() {

    if (!navMenu || !menuToggle) {

        return;

    }


    navMenu.classList.remove(
        "mobile-menu-open"
    );


    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );


    const menuIcon =
        menuToggle.querySelector("i");


    if (menuIcon) {

        menuIcon.classList.remove(
            "fa-xmark"
        );

        menuIcon.classList.add(
            "fa-bars"
        );

    }

}


// ======================================================
// 5. HANDLE WINDOW RESIZE
// ======================================================

window.addEventListener(
    "resize",
    function () {

        /*
        Agar phone se desktop width par
        browser resize hota hai to mobile
        menu state reset ho jayegi.
        */

        if (window.innerWidth > 600) {

            closeMobileMenu();

        }

    }
);


// ======================================================
// 6. HIDE ALL CO-FOUNDER PROFILES
// ======================================================

function hideAllProfiles() {

    const abhishekProfile =
        document.getElementById("abhishek");

    const ritikProfile =
        document.getElementById("ritik");

    const praveenProfile =
        document.getElementById("praveen");


    if (abhishekProfile) {

        abhishekProfile.style.display =
            "none";

    }


    if (ritikProfile) {

        ritikProfile.style.display =
            "none";

    }


    if (praveenProfile) {

        praveenProfile.style.display =
            "none";

    }

}


// ======================================================
// 7. ABHISHEK TIWARI PROFILE
// ======================================================

function showAbhishek() {

    hideAllProfiles();


    const abhishekProfile =
        document.getElementById(
            "abhishek"
        );


    if (!abhishekProfile) {

        return;

    }


    abhishekProfile.style.display =
        "block";


    abhishekProfile.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


// ======================================================
// 8. RITIK KUMAR PROFILE
// ======================================================

function showRitik() {

    hideAllProfiles();


    const ritikProfile =
        document.getElementById(
            "ritik"
        );


    if (!ritikProfile) {

        return;

    }


    ritikProfile.style.display =
        "block";


    ritikProfile.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


// ======================================================
// 9. PRAVEEN KUMAR GUPTA PROFILE
// ======================================================

function showPraveen() {

    hideAllProfiles();


    const praveenProfile =
        document.getElementById(
            "praveen"
        );


    if (!praveenProfile) {

        return;

    }


    praveenProfile.style.display =
        "block";


    praveenProfile.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


// ======================================================
// 10. CONTACT SECTION
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


            // Mobile menu close

            if (window.innerWidth <= 600) {

                closeMobileMenu();

            }

        }
    );

}


// ======================================================
// 11. ABOUT SECTION
// ======================================================

const aboutLink =
    document.querySelector(
        'a[href="#about"]'
    );


if (aboutLink) {

    aboutLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            const aboutSection =
                document.getElementById(
                    "about"
                );


            if (aboutSection) {

                aboutSection.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

            }


            if (window.innerWidth <= 600) {

                closeMobileMenu();

            }

        }
    );

}


// ======================================================
// 12. NEWS CONTAINER
// ======================================================

const newsContainer =
    document.getElementById(
        "news-container"
    );


// ======================================================
// 13. GET NEWS FROM MONGODB
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
// 14. DISPLAY NEWS ON HOMEPAGE
// ======================================================

function displayNews(publishedNews) {

    if (!newsContainer) {

        return;

    }


    newsContainer.innerHTML = "";


    // ==================================================
    // NO NEWS AVAILABLE
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
    // DISPLAY EACH ARTICLE
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


            // MongoDB Article ID

            newsCard.id =
                "news-" +
                article._id;


            // ==================================================
            // OPEN FULL ARTICLE
            // ==================================================

            newsCard.addEventListener(
                "click",
                function () {

                    window.location.href =

                        "article.html?id=" +

                        article._id;

                }
            );


            // ==================================================
            // ARTICLE DATE
            // ==================================================

            let articleDate =
                "Date unavailable";


            if (article.createdAt) {

                const parsedDate =
                    new Date(
                        article.createdAt
                    );


                if (
                    !Number.isNaN(
                        parsedDate.getTime()
                    )
                ) {

                    articleDate =
                        parsedDate.toLocaleDateString(
                            "en-IN",
                            {
                                day: "2-digit",
                                month: "long",
                                year: "numeric"
                            }
                        );

                }

            }


            // ==================================================
            // ARTICLE VALUES
            // ==================================================

            const image =
                article.image || "";

            const title =
                article.title ||
                "Untitled News";

            const category =
                article.category ||
                "News";

            const description =
                article.description ||
                "";

            const author =
                article.author ||
                "NEWSNOVA24";


            // ==================================================
            // NEWS CARD HTML
            // ==================================================

            newsCard.innerHTML = `

                <img
                    src="${image}"
                    alt="${title}"
                    class="news-image"
                >


                <div class="news-content">


                    <span class="news-category">

                        ${category}

                    </span>


                    <h3 class="news-headline">

                        ${title}

                    </h3>


                    <p class="news-description">

                        ${description}

                    </p>


                    <div class="news-info">


                        <span class="news-author">

                            By ${author}

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
// 15. SEARCH NEWS
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


    // ==================================================
    // SEARCH BUTTON CLICK
    // ==================================================

    searchButton.addEventListener(
        "click",
        function () {

            searchNews();

        }
    );


    // ==================================================
    // ENTER KEY SEARCH
    // ==================================================

    searchInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                searchNews();

            }

        }
    );

}


// ======================================================
// 16. SEARCH FUNCTION
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


    // ==================================================
    // SCROLL TO LATEST NEWS
    // ==================================================

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
// 17. LOAD NEWS WHEN WEBSITE OPENS
// ======================================================

loadPublishedNews();