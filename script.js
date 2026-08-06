// ======================================================
// NEWSNOVA24 - COMPLETE MAIN WEBSITE JAVASCRIPT
// MongoDB + Search + Profiles + Mobile Menu + Categories
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

            navMenu.classList.toggle(
                "mobile-menu-open"
            );

            const menuIsOpen =
                navMenu.classList.contains(
                    "mobile-menu-open"
                );

            menuToggle.setAttribute(
                "aria-expanded",
                menuIsOpen
            );

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

                } else {

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


    // Close mobile menu after link click

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
// 4. CLOSE MOBILE MENU
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
// 5. WINDOW RESIZE
// ======================================================

window.addEventListener(
    "resize",
    function () {

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


// Store all MongoDB news here

let allPublishedNews = [];


// Currently selected category

let activeCategory = "All";


const latestNewsTitle =
    document.getElementById(
        "latest-news-title"
    );


const latestNewsSection =
    document.getElementById(
        "latest-news-section"
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


        // Save all news

        allPublishedNews =
            publishedNews;


        // Homepage par sab news show karo

        displayNews(
            allPublishedNews
        );


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
// 14. DISPLAY NEWS
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

        const message =
            activeCategory === "All"
                ? "No news published yet."
                : "No " +
                  activeCategory +
                  " news published yet.";


        newsContainer.innerHTML = `

            <p id="no-news-message">
                ${message}
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


            // MongoDB article ID

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
// 15. CATEGORY FILTER SYSTEM
// ======================================================

const categoryNames = [

    "India",
    "World",
    "Politics",
    "Business",
    "Technology",
    "Sports",
    "Entertainment",
    "Health"

];


const navLinks =
    document.querySelectorAll(
        "#nav-menu a"
    );


// ======================================================
// ACTIVE NAVIGATION
// ======================================================

function setActiveNavigation(clickedLink) {

    navLinks.forEach(
        function (link) {

            link.classList.remove(
                "active"
            );

        }
    );


    if (clickedLink) {

        clickedLink.classList.add(
            "active"
        );

    }

}


// ======================================================
// SHOW CATEGORY NEWS
// ======================================================

function showCategoryNews(
    category,
    clickedLink
) {

    activeCategory =
        category;


    // Filter MongoDB news according to category

    const filteredNews =
        allPublishedNews.filter(
            function (article) {

                const articleCategory =
                    String(
                        article.category || ""
                    )
                        .trim()
                        .toLowerCase();


                const selectedCategory =
                    category
                        .trim()
                        .toLowerCase();


                return (
                    articleCategory ===
                    selectedCategory
                );

            }
        );


    // Navigation active class

    setActiveNavigation(
        clickedLink
    );


    // Change Latest News heading

    if (latestNewsTitle) {

        latestNewsTitle.textContent =
            category + " News";

    }


    // Display filtered category

    displayNews(
        filteredNews
    );


    // Clear search box

    if (searchInput) {
        searchInput.value = "";
    }


    // Scroll to news

    if (latestNewsSection) {

        latestNewsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


// ======================================================
// SHOW ALL NEWS
// ======================================================

function showAllNews(clickedLink) {

    activeCategory =
        "All";


    setActiveNavigation(
        clickedLink
    );


    if (latestNewsTitle) {

        latestNewsTitle.textContent =
            "Latest News";

    }


    displayNews(
        allPublishedNews
    );


    if (searchInput) {
        searchInput.value = "";
    }

}


// ======================================================
// CATEGORY NAVIGATION CLICK
// ======================================================

navLinks.forEach(
    function (link) {


        const linkText =
            link.textContent.trim();


        // ==================================================
        // CATEGORY LINKS
        // ==================================================

        if (
            categoryNames.includes(
                linkText
            )
        ) {

            link.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    showCategoryNews(
                        linkText,
                        link
                    );


                    if (
                        window.innerWidth <= 600
                    ) {

                        closeMobileMenu();

                    }

                }
            );

        }


        // ==================================================
        // HOME LINK
        // ==================================================

        if (linkText === "Home") {

            link.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    showAllNews(
                        link
                    );


                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });


                    if (
                        window.innerWidth <= 600
                    ) {

                        closeMobileMenu();

                    }

                }
            );

        }

    }
);


// ======================================================
// 16. SEARCH NEWS
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


    // SEARCH BUTTON CLICK

    searchButton.addEventListener(
        "click",
        function () {

            searchNews();

        }
    );


    // ENTER KEY SEARCH

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
// 17. SEARCH FUNCTION
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
                ) ||
                category.includes(
                    searchValue
                ) ||
                description.includes(
                    searchValue
                )
            ) {

                card.style.display =
                    "block";

            } else {

                card.style.display =
                    "none";

            }

        }
    );


    // Scroll to news

    if (latestNewsSection) {

        latestNewsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


// ======================================================
// 18. LOAD NEWS WHEN WEBSITE OPENS
// ======================================================

loadPublishedNews();