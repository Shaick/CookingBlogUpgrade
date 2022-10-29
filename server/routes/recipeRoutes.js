const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// App routes

router.get('/', recipeController.homepage);
router.get('/recipe/:id', recipeController.exploreRecipes);
router.get('/categories', recipeController.exploreCategories);
router.get('/categories/:id', recipeController.exploreCategoriesById);
router.post('/search', recipeController.searchRecipe);
router.get('/explore-latest', recipeController.exploreLatest);
router.get('/explore-random', recipeController.exploreRandom);
router.get('/submit-recipe', recipeController.submitRecipe);
router.post('/submit-recipe', recipeController.submitRecipeOnPost);
router.get('/login', recipeController.loginGet);
router.post('/login', recipeController.loginPost);
router.get('/logout', recipeController.logout);
router.get('/dashboard', recipeController.dashboard);
router.get('/signup', recipeController.signupGet);
router.post('/signup', recipeController.signupPost);


module.exports = router;