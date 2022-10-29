require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
const User = require('../models/User');

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

  /**
 * GET /submit-recipe
 * Submit Recipe
*/
exports.submitRecipe = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
  }

/**
 * POST /submit-recipe
 * Submit Recipe
*/
exports.submitRecipeOnPost = async(req, res) => {
    try {
  
      let imageUploadFile;
      let uploadPath;
      let newImageName;
  
      if(!req.files || Object.keys(req.files).length === 0){
        console.log('No Files where uploaded.');
      } else {
  
        imageUploadFile = req.files.image;
        newImageName = Date.now() + imageUploadFile.name;
  
        uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
  
        imageUploadFile.mv(uploadPath, function(err){
          if(err) return res.satus(500).send(err);
        })
  
      }
  
      const newRecipe = new Recipe({
        name: req.body.name,
        description: req.body.description,
        email: req.body.email,
        ingredients: req.body.ingredients,
        category: req.body.category,
        image: newImageName
      });
      
      await newRecipe.save();
  
      req.flash('infoSubmit', 'Recipe has been added.')
      res.redirect('/submit-recipe');
    } catch (error) {
      // res.json(error);
      req.flash('infoErrors', error);
      res.redirect('/submit-recipe');
    }
  }

/*  // Delete Recipe
 async function deleteRecipe(){
   try {
     await Recipe.deleteOne({ name: 'New Recipe Updated' });
   } catch (error) {
     console.log(error);
   }
 }
 deleteRecipe(); */

/*   async function updateRecipe() {
    try{
        const res = await Recipe.updateOne( {name: 'Cozumel'} , { name: 'New Recipe Updated'});
        res.n;  //number of documents matched
        res.nModified; // Number of documents modified
    } catch(error) {
        console.log(error);
    }
  }

  updateRecipe(); */

  // Get login
  exports.loginGet = async(req, res) => {
        res.render('login');
  }  

 
  exports.signupGet = async(req, res) => { 
        res.render('signup');
  }

  //Post /SignUp
exports.signupPost = async(req, res) => {
  const {email, nick,password} = req.body;
  try {
     // const username = await User.find(user => user.name = req.body.name);
      //const useremail  = await User.find(user => user.email = req.body.email);
      const existUser = await User.findOne({ email, nick, function(err, user){
        if (err) {console.log(err); return res.satus(500).send({message: err.message});}
      } });
      if(existUser) return res.json({message: "Usuario ja existe"});
      
      const newUser = new User({
        nick: nick,
        email: email,
        password: password,
        photo: ""
      });

      console.log(newUser),
      await newUser.save();
      return res.redirect("/login");
      
        //res.end("SignUp Successful...!");
    } catch (error) {
       // next(err);
      res.json({message: error.message || "Error Occured" });
    }
}

  //Post /Login
exports.loginPost = async(req, res) => {
    try {
      const {email, password} = req.body;
      User.findOne({email: email, password: password}, function(err, user){
        if (err) {console.log(err); return res.satus(500).send({message: err.message});}
        if(!user) { 
          //req.flash('infoSubmit', 'User not find.')
          res.json({message: "user not find"});
          return ;
        }
        req.session.user = user;
        console.log(req.session.user);
        return res.render('dashboard', {user : user});
      })
    } catch (error) {
        res.satus(500).send({message: error.message || "Error Occured" });
    }
}

// route for dashboard
exports.dashboard = async(req, res) => {
    if(req.session.user){
        res.render('dashboard', {user : req.session.user});
    }else{
        res.send("Unauthorize User")
    }
}

// Get logout
exports.logout = async(req, res) => {
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.send("Error")
        }else{
            const food = { latest, thai, american, chinese, Spanish };
            res.render('index', { title: 'Cookinkg Blog - Home', categories, food } );
        }
    })
}