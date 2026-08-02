// ======================================================
// NEWSNOVA24 - SECURE ADMIN JAVASCRIPT
// Session + MongoDB + Publish + View + Edit + Delete
// ======================================================


const newsForm =
    document.getElementById("newsForm");

const publishedNewsList =
    document.getElementById("published-news-list");

const noNewsMessage =
    document.getElementById("admin-no-news");


// Logout button
const logoutButton =
    document.getElementById("admin-logout-btn");


let editingArticleId = null;


// ======================================================
// 1. CHECK ADMIN SESSION
// ======================================================

async function checkAdminSession() {

    try {

        const response =
            await fetch("/api/admin/check");


        if (!response.ok) {

            window.location.href =
                "login.html";

            return false;

        }


        const result =
            await response.json();


        if (!result.loggedIn) {

            window.location.href =
                "login.html";

            return false;

        }


        return true;


    } catch (error) {

        console.error(
            "Session check failed:",
            error
        );


        window.location.href =
            "login.html";


        return false;

    }

}


// ======================================================
// 2. SESSION EXPIRED / UNAUTHORIZED
// ======================================================

function handleUnauthorized(response) {

    if (response.status === 401) {

        alert(
            "Your admin session has expired. Please login again."
        );


        window.location.href =
            "login.html";


        return true;

    }


    return false;

}


// ======================================================
// 3. PUBLISH / UPDATE NEWS
// ======================================================

if (newsForm) {

    newsForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const articleData = {

                title:
                    document
                        .getElementById("newsTitle")
                        .value
                        .trim(),

                category:
                    document
                        .getElementById("newsCategory")
                        .value,

                author:
                    document
                        .getElementById("newsAuthor")
                        .value
                        .trim(),

                image:
                    document
                        .getElementById("newsImage")
                        .value
                        .trim(),

                description:
                    document
                        .getElementById("newsDescription")
                        .value
                        .trim(),

                content:
                    document
                        .getElementById("newsContent")
                        .value
                        .trim()

            };


            // Validation

            if (
                !articleData.title ||
                !articleData.category ||
                !articleData.author ||
                !articleData.image ||
                !articleData.description ||
                !articleData.content
            ) {

                alert(
                    "Please fill all fields!"
                );

                return;

            }


            try {

                let response;


                // ======================================
                // UPDATE NEWS
                // ======================================

                if (editingArticleId) {

                    response =
                        await fetch(
                            `/api/news/${editingArticleId}`,
                            {
                                method: "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        articleData
                                    )
                            }
                        );

                }


                // ======================================
                // PUBLISH NEWS
                // ======================================

                else {

                    response =
                        await fetch(
                            "/api/news",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        articleData
                                    )
                            }
                        );

                }


                // Session expired?

                if (
                    handleUnauthorized(
                        response
                    )
                ) {

                    return;

                }


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Something went wrong"
                    );

                }


                if (editingArticleId) {

                    alert(
                        "News updated successfully!"
                    );

                }

                else {

                    alert(
                        "News published successfully!"
                    );

                }


                editingArticleId = null;


                newsForm.reset();


                resetSubmitButton();


                await displayPublishedNews();


            } catch (error) {

                console.error(error);


                alert(
                    "Unable to save news: " +
                    error.message
                );

            }

        }
    );

}


// ======================================================
// 4. GET ARTICLES
// ======================================================

async function getArticles() {

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


        return result.news || [];


    } catch (error) {

        console.error(
            "Unable to load articles:",
            error
        );


        return [];

    }

}


// ======================================================
// 5. DISPLAY PUBLISHED NEWS
// ======================================================

async function displayPublishedNews() {

    if (!publishedNewsList) {

        return;

    }


    const articles =
        await getArticles();


    publishedNewsList.innerHTML =
        "";


    if (articles.length === 0) {

        if (noNewsMessage) {

            noNewsMessage.style.display =
                "block";

        }


        return;

    }


    if (noNewsMessage) {

        noNewsMessage.style.display =
            "none";

    }


    articles.forEach(
        function (article) {


            const card =
                document.createElement(
                    "div"
                );


            card.classList.add(
                "admin-news-card"
            );


            card.id =
                "admin-news-" +
                article._id;


            const date =
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


            card.innerHTML = `

                <div class="admin-news-image">

                    <img
                        src="${article.image}"
                        alt="${article.title}"
                    >

                </div>


                <div class="admin-news-content">


                    <span class="admin-news-category">

                        ${article.category}

                    </span>


                    <h3>

                        ${article.title}

                    </h3>


                    <p>

                        ${article.description}

                    </p>


                    <div class="admin-news-meta">

                        <span>
                            ${article.author}
                        </span>

                        <span>
                            ${date}
                        </span>

                    </div>


                    <div class="admin-news-actions">


                        <button
                            type="button"
                            class="view-news-btn"
                            data-id="${article._id}"
                        >
                            View
                        </button>


                        <button
                            type="button"
                            class="edit-news-btn"
                            data-id="${article._id}"
                        >
                            Edit
                        </button>


                        <button
                            type="button"
                            class="delete-news-btn"
                            data-id="${article._id}"
                        >
                            Delete
                        </button>


                    </div>

                </div>

            `;


            publishedNewsList
                .appendChild(card);

        }
    );


    addActionEvents();

}


// ======================================================
// 6. BUTTON EVENTS
// ======================================================

function addActionEvents() {


    // VIEW

    document
        .querySelectorAll(
            ".view-news-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        window.location.href =
                            "article.html?id=" +
                            this.dataset.id;

                    }
                );

            }
        );


    // EDIT

    document
        .querySelectorAll(
            ".edit-news-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        editArticle(
                            this.dataset.id
                        );

                    }
                );

            }
        );


    // DELETE

    document
        .querySelectorAll(
            ".delete-news-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        deleteArticle(
                            this.dataset.id
                        );

                    }
                );

            }
        );

}


// ======================================================
// 7. EDIT ARTICLE
// ======================================================

async function editArticle(articleId) {

    try {

        const response =
            await fetch(
                `/api/news/${articleId}`
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message
            );

        }


        const article =
            result.news;


        editingArticleId =
            article._id;


        document
            .getElementById("newsTitle")
            .value =
            article.title;


        document
            .getElementById("newsCategory")
            .value =
            article.category;


        document
            .getElementById("newsAuthor")
            .value =
            article.author;


        document
            .getElementById("newsImage")
            .value =
            article.image;


        document
            .getElementById("newsDescription")
            .value =
            article.description;


        document
            .getElementById("newsContent")
            .value =
            article.content;


        const submitButton =
            newsForm.querySelector(
                'button[type="submit"]'
            );


        if (submitButton) {

            submitButton.innerHTML =
                "Update News";

        }


        newsForm.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });


    } catch (error) {

        console.error(error);


        alert(
            "Unable to load article for editing."
        );

    }

}


// ======================================================
// 8. DELETE ARTICLE
// ======================================================

async function deleteArticle(articleId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this news?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/news/${articleId}`,
                {
                    method: "DELETE"
                }
            );


        if (
            handleUnauthorized(
                response
            )
        ) {

            return;

        }


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message
            );

        }


        alert(
            "News deleted successfully!"
        );


        if (
            String(editingArticleId) ===
            String(articleId)
        ) {

            editingArticleId = null;

            newsForm.reset();

            resetSubmitButton();

        }


        await displayPublishedNews();


    } catch (error) {

        console.error(error);


        alert(
            "Unable to delete news."
        );

    }

}


// ======================================================
// 9. RESET SUBMIT BUTTON
// ======================================================

function resetSubmitButton() {

    if (!newsForm) {

        return;

    }


    const submitButton =
        newsForm.querySelector(
            'button[type="submit"]'
        );


    if (submitButton) {

        submitButton.innerHTML =
            "Publish News";

    }

}


// ======================================================
// 10. SECURE LOGOUT
// ======================================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function () {

            try {

                const response =
                    await fetch(
                        "/api/admin/logout",
                        {
                            method: "POST"
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Logout failed"
                    );

                }


                // Purane frontend login flags bhi hata do

                localStorage.removeItem(
                    "newsnova24_admin_logged_in"
                );

                sessionStorage.removeItem(
                    "newsnova24_admin_logged_in"
                );


                window.location.href =
                    "login.html";


            } catch (error) {

                console.error(
                    "Logout Error:",
                    error
                );


                alert(
                    "Unable to logout."
                );

            }

        }
    );

}


// ======================================================
// 11. PAGE START
// ======================================================

async function startAdminPanel() {

    const loggedIn =
        await checkAdminSession();


    if (!loggedIn) {

        return;

    }


    await displayPublishedNews();

}


startAdminPanel();