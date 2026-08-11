// ======================================================
// NEWSNOVA24 - ADMIN JAVASCRIPT
// Session + Image Upload + Publish + View + Edit + Delete
// ======================================================


// ======================================================
// ELEMENTS
// ======================================================

const newsForm = document.getElementById("newsForm");
const publishedNewsList = document.getElementById("published-news-list");
const noNewsMessage = document.getElementById("admin-no-news");
const logoutButton = document.getElementById("admin-logout-btn");
const newsImageInput = document.getElementById("newsImage");
const imagePreview = document.getElementById("imagePreview");

let editingArticleId = null;
let existingImage = "";


// ======================================================
// 1. CHECK ADMIN SESSION
// ======================================================

async function checkAdminSession() {
    try {
        const response = await fetch("/api/admin/check", {
            method: "GET",
            credentials: "same-origin",
            cache: "no-store"
        });

        if (!response.ok) {
            window.location.replace("login.html");
            return false;
        }

        const result = await response.json();

        if (!result.loggedIn) {
            window.location.replace("login.html");
            return false;
        }

        return true;

    } catch (error) {
        console.error("Session check failed:", error);
        window.location.replace("login.html");
        return false;
    }
}


// ======================================================
// 2. HANDLE UNAUTHORIZED
// ======================================================

function handleUnauthorized(response) {
    if (response.status === 401 || response.status === 403) {
        alert("Your admin session has expired. Please login again.");
        window.location.replace("login.html");
        return true;
    }

    return false;
}


// ======================================================
// 3. IMAGE PREVIEW
// ======================================================

if (newsImageInput) {
    newsImageInput.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            this.value = "";
            return;
        }

        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            alert("Image size must be less than 5MB.");
            this.value = "";
            return;
        }

        if (imagePreview) {
            const previewURL = URL.createObjectURL(file);

            imagePreview.src = previewURL;
            imagePreview.style.display = "block";
        }
    });
}

// ==================================================
// CONVERT IMAGE TO BASE64
// ==================================================

function imageToBase64(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = () => {
            reject(new Error("Unable to read image"));
        };

        reader.readAsDataURL(file);

    });

}


// ======================================================
// 4. PUBLISH / UPDATE NEWS
// ======================================================

if (newsForm) {
    newsForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const title =
            document.getElementById("newsTitle")?.value.trim();

        const category =
            document.getElementById("newsCategory")?.value;

        const author =
            document.getElementById("newsAuthor")?.value.trim();

        const description =
            document.getElementById("newsDescription")?.value.trim();

        const content =
            document.getElementById("newsContent")?.value.trim();

        const imageFile =
            newsImageInput?.files[0];


        // ==================================================
        // VALIDATION
        // ==================================================

        if (
            !title ||
            !category ||
            !author ||
            !description ||
            !content
        ) {
            alert("Please fill all fields!");
            return;
        }


        if (!editingArticleId && !imageFile) {
            alert("Please select a news image!");
            return;
        }


       // ==================================================
// PREPARE NEWS DATA
// ==================================================

let imageData = existingImage || "";

if (imageFile) {

    try {

        imageData = await imageToBase64(imageFile);

    } catch (error) {

        alert("Unable to process the selected image.");
        return;

    }

}

// ==================================================
// JSON DATA
// ==================================================

const newsData = {

    title: title,
    category: category,
    author: author,
    image: imageData,
    description: description,
    content: content

};



        // ==================================================
        // SUBMIT
        // ==================================================

        try {

            let response;

           if (editingArticleId) {

    response = await fetch(
        `/api/news/${editingArticleId}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(newsData),

            credentials: "same-origin"
        }
    );

} else {

    response = await fetch(
        "/api/news",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(newsData),

            credentials: "same-origin"
        }
    );

}

            if (handleUnauthorized(response)) {
                return;
            }


            const result = await response.json();


            if (!response.ok) {
                throw new Error(
                    result.message || "Something went wrong"
                );
            }


            if (editingArticleId) {
                alert("News updated successfully!");
            } else {
                alert("News published successfully!");
            }


            editingArticleId = null;
            existingImage = "";

            newsForm.reset();

            if (imagePreview) {
                imagePreview.src = "";
                imagePreview.style.display = "none";
            }

            resetSubmitButton();

            await displayPublishedNews();

        } catch (error) {

            console.error("Save News Error:", error);

            alert(
                "Unable to save news: " +
                error.message
            );
        }
    });
}


// ======================================================
// 5. GET ARTICLES
// ======================================================

async function getArticles() {

    try {

        const response = await fetch("/api/news", {
            method: "GET",
            cache: "no-store"
        });

        const result = await response.json();


        if (!response.ok) {
            throw new Error(
                result.message || "Unable to load news"
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
// ESCAPE HTML
// ======================================================

function escapeHTML(value = "") {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ======================================================
// 6. DISPLAY PUBLISHED NEWS
// ======================================================

async function displayPublishedNews() {

    if (!publishedNewsList) {
        return;
    }


    const articles = await getArticles();

    publishedNewsList.innerHTML = "";


    if (articles.length === 0) {

        if (noNewsMessage) {
            noNewsMessage.style.display = "block";
        }

        return;
    }


    if (noNewsMessage) {
        noNewsMessage.style.display = "none";
    }


    articles.forEach(function (article) {

        const card = document.createElement("div");

        card.classList.add("admin-news-card");

        card.id =
            "admin-news-" +
            article._id;


        const date = article.createdAt
            ? new Date(article.createdAt)
                .toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                    }
                )
            : "";


        const image = escapeHTML(article.image || "");
        const title = escapeHTML(article.title || "");
        const category = escapeHTML(article.category || "");
        const description = escapeHTML(article.description || "");
        const author = escapeHTML(article.author || "");
        const id = escapeHTML(article._id || "");


        card.innerHTML = `

            <div class="admin-news-image">

                <img
                    src="${image}"
                    alt="${title}"
                >

            </div>


            <div class="admin-news-content">

                <span class="admin-news-category">
                    ${category}
                </span>


                <h3>
                    ${title}
                </h3>


                <p>
                    ${description}
                </p>


                <div class="admin-news-meta">

                    <span>
                        ${author}
                    </span>

                    <span>
                        ${date}
                    </span>

                </div>


                <div class="admin-news-actions">

                    <button
                        type="button"
                        class="view-news-btn"
                        data-id="${id}"
                    >
                        View
                    </button>


                    <button
                        type="button"
                        class="edit-news-btn"
                        data-id="${id}"
                    >
                        Edit
                    </button>


                    <button
                        type="button"
                        class="delete-news-btn"
                        data-id="${id}"
                    >
                        Delete
                    </button>

                </div>

            </div>
        `;


        publishedNewsList.appendChild(card);
    });


    addActionEvents();
}


// ======================================================
// 7. BUTTON EVENTS
// ======================================================

function addActionEvents() {

    document
        .querySelectorAll(".view-news-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "article.html?id=" +
                        encodeURIComponent(
                            this.dataset.id
                        );
                }
            );
        });


    document
        .querySelectorAll(".edit-news-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    editArticle(
                        this.dataset.id
                    );
                }
            );
        });


    document
        .querySelectorAll(".delete-news-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    deleteArticle(
                        this.dataset.id
                    );
                }
            );
        });
}


// ======================================================
// 8. EDIT ARTICLE
// ======================================================

async function editArticle(articleId) {

    try {

        const response =
            await fetch(
                `/api/news/${encodeURIComponent(articleId)}`,
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Unable to load article"
            );
        }


        const article =
            result.news;


        if (!article) {
            throw new Error(
                "Article not found"
            );
        }


        editingArticleId =
            article._id;


        existingImage =
            article.image || "";


        // ==================================================
        // FILL FORM
        // ==================================================

        const titleInput =
            document.getElementById("newsTitle");

        const categoryInput =
            document.getElementById("newsCategory");

        const authorInput =
            document.getElementById("newsAuthor");

        const descriptionInput =
            document.getElementById("newsDescription");

        const contentInput =
            document.getElementById("newsContent");


        if (titleInput) {
            titleInput.value =
                article.title || "";
        }


        if (categoryInput) {
            categoryInput.value =
                article.category || "";
        }


        if (authorInput) {
            authorInput.value =
                article.author || "";
        }


        if (descriptionInput) {
            descriptionInput.value =
                article.description || "";
        }


        if (contentInput) {
            contentInput.value =
                article.content || "";
        }


        // File input blank rahega
        if (newsImageInput) {
            newsImageInput.value = "";
        }


        // Existing image preview
        if (
            imagePreview &&
            article.image
        ) {

            imagePreview.src =
                article.image;

            imagePreview.style.display =
                "block";
        }


        // Change submit button
        const submitButton =
            newsForm?.querySelector(
                'button[type="submit"]'
            );


        if (submitButton) {

            submitButton.innerHTML =
                '<i class="fas fa-save"></i> Update News';
        }


        // Scroll to form
        newsForm?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


    } catch (error) {

        console.error(
            "Edit Article Error:",
            error
        );


        alert(
            "Unable to load article for editing: " +
            error.message
        );
    }
}


// ======================================================
// 9. DELETE ARTICLE
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
                `/api/news/${encodeURIComponent(articleId)}`,
                {
                    method: "DELETE",
                    credentials: "same-origin"
                }
            );


        if (handleUnauthorized(response)) {
            return;
        }


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Unable to delete news"
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
            existingImage = "";

            newsForm?.reset();


            if (imagePreview) {

                imagePreview.src = "";
                imagePreview.style.display =
                    "none";
            }


            resetSubmitButton();
        }


        await displayPublishedNews();


    } catch (error) {

        console.error(
            "Delete News Error:",
            error
        );


        alert(
            "Unable to delete news: " +
            error.message
        );
    }
}


// ======================================================
// 10. RESET SUBMIT BUTTON
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
            '<i class="fas fa-paper-plane"></i> Publish News';
    }
}


// ======================================================
// 11. SECURE LOGOUT
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
                            method: "POST",
                            credentials: "same-origin"
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


                localStorage.removeItem(
                    "newsnova24_admin_logged_in"
                );


                sessionStorage.removeItem(
                    "newsnova24_admin_logged_in"
                );


                window.location.replace(
                    "login.html"
                );


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
// 12. PAGE START
// ======================================================

async function startAdminPanel() {

    const loggedIn =
        await checkAdminSession();


    if (!loggedIn) {
        return;
    }


    await displayPublishedNews();
}


// ======================================================
// START ADMIN PANEL
// ======================================================

startAdminPanel();