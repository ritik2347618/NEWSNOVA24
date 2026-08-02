// ==========================================
// NEWSNOVA24 - SECURE NEWS ROUTES / API
// ==========================================

const express = require("express");
const router = express.Router();

const News = require("../models/News");


// ==========================================
// ADMIN AUTH MIDDLEWARE
// ==========================================

function requireAdmin(req, res, next) {

    if (
        req.session &&
        req.session.isAdmin
    ) {

        return next();

    }

    return res.status(401).json({

        success: false,
        message: "Admin login required"

    });

}


// ==========================================
// 1. PUBLISH NEW NEWS
// ADMIN ONLY
// POST /api/news
// ==========================================

router.post(
    "/",
    requireAdmin,
    async (req, res) => {

        try {

            const newNews = new News({

                title: req.body.title,

                category: req.body.category,

                author: req.body.author,

                image: req.body.image,

                description: req.body.description,

                content: req.body.content

            });


            const savedNews =
                await newNews.save();


            return res.status(201).json({

                success: true,

                message:
                    "News published successfully",

                news: savedNews

            });


        } catch (error) {

            console.error(error);


            return res.status(500).json({

                success: false,

                message:
                    "Failed to publish news",

                error: error.message

            });

        }

    }
);


// ==========================================
// 2. GET ALL NEWS
// PUBLIC
// GET /api/news
// ==========================================

router.get(
    "/",
    async (req, res) => {

        try {

            const news =
                await News
                    .find()
                    .sort({
                        createdAt: -1
                    });


            return res.status(200).json({

                success: true,

                news: news

            });


        } catch (error) {

            return res.status(500).json({

                success: false,

                message:
                    "Failed to load news",

                error: error.message

            });

        }

    }
);


// ==========================================
// 3. GET SINGLE ARTICLE
// PUBLIC
// GET /api/news/:id
// ==========================================

router.get(
    "/:id",
    async (req, res) => {

        try {

            const news =
                await News.findById(
                    req.params.id
                );


            if (!news) {

                return res
                    .status(404)
                    .json({

                        success: false,

                        message:
                            "News not found"

                    });

            }


            return res.status(200).json({

                success: true,

                news: news

            });


        } catch (error) {

            return res.status(500).json({

                success: false,

                message:
                    "Failed to load article",

                error: error.message

            });

        }

    }
);


// ==========================================
// 4. UPDATE NEWS
// ADMIN ONLY
// PUT /api/news/:id
// ==========================================

router.put(
    "/:id",
    requireAdmin,
    async (req, res) => {

        try {

            const updatedNews =
                await News.findByIdAndUpdate(

                    req.params.id,

                    req.body,

                    {
                        new: true,
                        runValidators: true
                    }

                );


            if (!updatedNews) {

                return res
                    .status(404)
                    .json({

                        success: false,

                        message:
                            "News not found"

                    });

            }


            return res.status(200).json({

                success: true,

                message:
                    "News updated successfully",

                news: updatedNews

            });


        } catch (error) {

            return res.status(500).json({

                success: false,

                message:
                    "Failed to update news",

                error: error.message

            });

        }

    }
);


// ==========================================
// 5. DELETE NEWS
// ADMIN ONLY
// DELETE /api/news/:id
// ==========================================

router.delete(
    "/:id",
    requireAdmin,
    async (req, res) => {

        try {

            const deletedNews =
                await News.findByIdAndDelete(
                    req.params.id
                );


            if (!deletedNews) {

                return res
                    .status(404)
                    .json({

                        success: false,

                        message:
                            "News not found"

                    });

            }


            return res.status(200).json({

                success: true,

                message:
                    "News deleted successfully"

            });


        } catch (error) {

            return res.status(500).json({

                success: false,

                message:
                    "Failed to delete news",

                error: error.message

            });

        }

    }
);


module.exports = router;