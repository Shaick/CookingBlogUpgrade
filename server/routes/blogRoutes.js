const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// App routes

router.get('/', blogController.homepage);
router.get('/post/:id', blogController.explorePost);
router.get('/edit-posts', blogController.updatePosts);
router.get('/update-post/:id', blogController.updatePost);
router.post('/update-post/:id', blogController.updateOnPost);
router.get('/categories', blogController.exploreCategories);
router.get('/categories/:id', blogController.exploreCategoriesById);
router.get('/edit-categories', blogController.editCategories);
router.get('/edit-category/:id', blogController.editCategoryById);
router.post('/edit-category/:id', blogController.editCategoryPost);
router.get('/register-category', blogController.submitCategory);
router.post('/register-category', blogController.submitCategoryPost);
router.post('/search', blogController.searchPost);
router.get('/explore-latest', blogController.exploreLatest);
router.get('/explore-random', blogController.exploreRandom);
router.get('/submit-post', blogController.submitPost);
router.post('/submit-post', blogController.submitBlogOnPost);
router.get('/login', blogController.loginGet);
router.post('/login', blogController.loginPost);
router.get('/logout', blogController.logout);
router.get('/dashboard', blogController.dashboard);
router.get('/signup', blogController.signupGet);
router.post('/signup', blogController.signupPost);


module.exports = router;