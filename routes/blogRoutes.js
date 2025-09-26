const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");

router.post("/", blogController.createBlog);
router.get("/", blogController.getAllBlogs);
router.get("/recent", blogController.getRecentPosts);
router.get("/:id", blogController.getBlogById);
router.get("/:slug", blogController.getBlogBySlug);
router.put("/:id", blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);
router.get("/category/:categoryId", blogController.getBlogsByCategory);

router.get("/category/name/:categoryName", blogController.getBlogsByCategoryName);




module.exports = router;
