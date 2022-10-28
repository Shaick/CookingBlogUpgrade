require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');

//Get homepage
exports.homepage = async(req, res) => {
    try{
        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
        const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
        const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
        const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);
    
        const food = { latest, thai, american, chinese };

        res.render('index', { title: 'Cookinkg Blog - Home', categories, food } );
    }
    catch(error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

//Get /categories
exports.exploreCategories = async(req, res) => {
    try{
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories', { title: 'Cookinkg Blog - Categories', categories } );
    }
    catch(error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

//Get /recipe/:id
exports.exploreRecipes = async(req, res) => {
    try{
        let recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);

        res.render('recipe', { title: 'Cookinkg Blog - Recipe', recipe } );
    }
    catch(error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

//Get /categories/:id
exports.exploreCategoriesById = async(req, res) => { 
    try {
      let categoryId = req.params.id;
      const limitNumber = 20;
      const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
      res.render('categories', { title: 'Cooking Blog - Categoreis', categoryById } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 

  //Post /search
  exports.searchRecipe = async(req, res) => {
    try {
      let searchTerm = req.body.searchTerm;
      let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
      //res.json(recipe);
      res.render('search', { title: 'Cooking Blog - Search', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
    
  }
  
/**
 * GET /explore-latest
 * Explplore Latest 
*/
exports.exploreLatest = async(req, res) => {
    try {
      const limitNumber = 20;
      const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
      res.render('explore-latest', { title: 'Cooking Blog - Explore Latest', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 

  /**
 * GET /explore-random
 * Explore Random as JSON
*/
exports.exploreRandom = async(req, res) => {
    try {
      let count = await Recipe.find().countDocuments();
      let random = Math.floor(Math.random() * count);
      let recipe = await Recipe.findOne().skip(random).exec();
      res.render('explore-random', { title: 'Cooking Blog - Explore Latest', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 