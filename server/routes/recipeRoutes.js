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



module.exports = router;