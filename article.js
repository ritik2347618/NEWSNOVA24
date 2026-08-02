// ======================================================
// NEWSNOVA24 - ARTICLE PAGE JAVASCRIPT
// MongoDB API Version
// ======================================================


// ======================================================
// 1. URL SE ARTICLE ID LENA
// ======================================================

const urlParams =
    new URLSearchParams(window.location.search);

const articleId =
    urlParams.get("id");


// ======================================================
// 2. HTML ELEMENTS
// ======================================================

const articleContainer =
    document.getElementById("article-container");

const articleNotFound =
    document.getElementById("article-not-found");

const articleTitle =
    document.getElementById("article-title");

const articleCategory =
    document.getElementById("article-category");

const articleAuthor =
    document.getElementById("article-author");

const articleDate =
    document.getElementById("article-date");

const articleImage =
    document.getElementById("article-image");

const articleContent =
    document.getElementById("article-content");


// Current article ko share buttons ke liye store karenge

let selectedArticle = null;


// ======================================================
// 3. MONGODB SE ARTICLE LOAD KARNA
// ======================================================

async function loadArticle() {

    // URL me ID hi nahi hai

    if (!articleId) {

        showArticleNotFound();
        return;

    }


    try {

        const response =
            await fetch(
                `/api/news/${articleId}`
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Article not found"
            );

        }


        selectedArticle =
            result.news;


        displayArticle(
            selectedArticle
        );


    } catch (error) {

        console.error(
            "Unable to load article:",
            error
        );


        showArticleNotFound();

    }

}


// ======================================================
// 4. ARTICLE DISPLAY KARNA
// ======================================================

function displayArticle(article) {


    // Headline

    if (articleTitle) {

        articleTitle.textContent =
            article.title;

    }


    // Category

    if (articleCategory) {

        articleCategory.textContent =
            article.category;

    }


    // Author

    if (articleAuthor) {

        articleAuthor.textContent =
            article.author;

    }


    // Date

    if (articleDate) {

        const formattedDate =
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


        articleDate.textContent =
            formattedDate;

    }


    // Image

    if (articleImage) {

        articleImage.src =
            article.image;

        articleImage.alt =
            article.title;

    }


    // Full Article

    if (articleContent) {

        articleContent.textContent =
            article.content;

    }


    // Browser Tab Title

    document.title =
        article.title +
        " - NEWSNOVA24";


    // Article show

    if (articleContainer) {

        articleContainer.style.display =
            "block";

    }


    // Not Found hide

    if (articleNotFound) {

        articleNotFound.style.display =
            "none";

    }

}


// ======================================================
// 5. ARTICLE NOT FOUND
// ======================================================

function showArticleNotFound() {

    if (articleContainer) {

        articleContainer.style.display =
            "none";

    }


    if (articleNotFound) {

        articleNotFound.style.display =
            "block";

    }

}


// ======================================================
// 6. FOOTER YEAR
// ======================================================

const footerYear =
    document.getElementById("footer-year");


if (footerYear) {

    footerYear.textContent =
        new Date().getFullYear();

}


// ======================================================
// 7. CURRENT ARTICLE URL
// ======================================================

const currentArticleURL =
    window.location.href;


// ======================================================
// 8. FACEBOOK SHARE
// ======================================================

const facebookButton =
    document.getElementById(
        "share-facebook"
    );


if (facebookButton) {

    facebookButton.addEventListener(
        "click",
        function () {

            const facebookURL =
                "https://www.facebook.com/sharer/sharer.php?u=" +
                encodeURIComponent(
                    currentArticleURL
                );


            window.open(
                facebookURL,
                "_blank"
            );

        }
    );

}


// ======================================================
// 9. WHATSAPP SHARE
// ======================================================

const whatsappButton =
    document.getElementById(
        "share-whatsapp"
    );


if (whatsappButton) {

    whatsappButton.addEventListener(
        "click",
        function () {


            let message =
                "Read this article on NEWSNOVA24";


            if (selectedArticle) {

                message =
                    selectedArticle.title +
                    "\n\n" +
                    currentArticleURL;

            }


            const whatsappURL =
                "https://wa.me/?text=" +
                encodeURIComponent(
                    message
                );


            window.open(
                whatsappURL,
                "_blank"
            );

        }
    );

}


// ======================================================
// 10. X / TWITTER SHARE
// ======================================================

const twitterButton =
    document.getElementById(
        "share-twitter"
    );


if (twitterButton) {

    twitterButton.addEventListener(
        "click",
        function () {


            let message =
                "NEWSNOVA24 Article";


            if (selectedArticle) {

                message =
                    selectedArticle.title;

            }


            const twitterURL =
                "https://twitter.com/intent/tweet?text=" +
                encodeURIComponent(
                    message
                ) +
                "&url=" +
                encodeURIComponent(
                    currentArticleURL
                );


            window.open(
                twitterURL,
                "_blank"
            );

        }
    );

}


// ======================================================
// 11. COPY ARTICLE LINK
// ======================================================

const copyButton =
    document.getElementById(
        "copy-link"
    );


if (copyButton) {

    copyButton.addEventListener(
        "click",
        async function () {

            try {

                await navigator
                    .clipboard
                    .writeText(
                        currentArticleURL
                    );


                alert(
                    "Article link copied!"
                );

            }

            catch (error) {

                alert(
                    "Unable to copy article link."
                );

            }

        }
    );

}


// ======================================================
// 12. PAGE OPEN HOTE HI ARTICLE LOAD KARO
// ======================================================

loadArticle();