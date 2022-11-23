require('../models/database');
const bcrypt = require('bcrypt');
const Category = require('../models/Category');
const Post = require('../models/Post');
const User = require('../models/User');

//Get homepage
exports.homepage = async(req, res) => {
    try{
        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Post.find({}).sort({_id: -1}).limit(limitNumber);
        const thai = await Post.find({ 'category': 'Thai' }).limit(limitNumber);
        const american = await Post.find({ 'category': 'American' }).limit(limitNumber);
        const chinese = await Post.find({ 'category': 'Chinese' }).limit(limitNumber);
    
        const food = { latest, thai, american, chinese };

        res.render('index', { title: 'Blog Ser & Estar - Inicio', categories, food } );
    }
    catch(error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

//Get /categories
exports.exploreCategories = async(req, res) => {
    try{
        const categories = await Category.find({}).limit();
        res.render('categories', { title: 'Blog Ser & Estar - Categorias', categories } );
    }
    catch(error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

//Get /post/:id
exports.explorePost = async(req, res) => {
    try{
        let postId = req.params.id;
        const post = await Post.findById(postId);

        res.render('post', { title: 'Blog Ser & Estar - Postagens', post } );
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
      const categoryById = await Post.find({ 'category': categoryId }).limit(limitNumber);
      res.render('categories', { title: 'Blog Ser & Estar - Categorias', categoryById } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 

  //Post /search
  exports.searchPost = async(req, res) => {
    try {
      let searchTerm = req.body.searchTerm;
      let post = await Post.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
      //res.json(post);
      res.render('search', { title: 'Blog Ser & Estar - Busca', post } );
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
      const post = await Post.find({}).sort({ _id: -1 }).limit(/* limitNumber */);
      res.render('explore-latest', { title: 'Cooking Blog - Ultimas Postagens', post } );
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
      let count = await Post.find().countDocuments();
      let random = Math.floor(Math.random() * count);
      let post = await Post.findOne().skip(random).exec();
      res.render('explore-random', { title: 'Blog Ser & Estar - Sortear', post } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 

  /**
 * GET /submit-post
 * Submit Post
*/
exports.submitPost = async(req, res) => {
  const limitNumber = 10;
  const categories = await Category.find({}).limit(limitNumber);
    if(req.session.user){
      const infoErrorsObj = req.flash('infoErrors');
      const infoSubmitObj = req.flash('infoSubmit');
      res.render('submit-post', { title: 'Blog Ser & Estar - Enviar Postagem', infoErrorsObj, infoSubmitObj, categories  } );
    } else {
      req.flash('error_msg', 'Essa pagina requer Autorização!');
      res.redirect('/login');
    }

  }

/**
 * POST /submit-post
 * Submit Post
*/
exports.submitBlogOnPost = async(req, res) => {

    try {
  
      let imageUploadFile;
      let uploadPath;
      let newImageName;
  
      if(!req.files || Object.keys(req.files).length === 0){
        console.log('No Files where uploaded.');
      } else {
  
        imageUploadFile = req.files.image;
        newImageName = Date.now() + imageUploadFile.name;
  
        uploadPath = require('path').resolve('./') + '/public/uploads' + newImageName;
  
        imageUploadFile.mv(uploadPath, function(err){
          if(err) return res.satus(500).send(err);
        })
  
      }
  
      const newPost = new Post({
        name: req.body.name,
        description: req.body.description,
        email: req.body.email,
        ingredients: req.body.ingredients,
        category: req.body.category,
        image: newImageName
      });
      
      await newPost.save();
  
      req.flash('infoSubmit', 'Nova Postagem Concluida.')
      res.redirect('/submit-post');
    } catch (error) {
      // res.json(error);
      req.flash('infoErrors', error);
      res.redirect('/submit-post');
    }
  }

  exports.updateOnPost = async(req, res) => {

    try {
      let id = req.body.id;
      const { name, description, email, ingredients, category } = req.body;
      let imageUploadFile;
      let uploadPath;
      let newImageName;
  
      if(!req.files || Object.keys(req.files).length === 0){
        console.log('No Files where uploaded.');
      } else {
  
        imageUploadFile = req.files.image;
        newImageName = Date.now() + imageUploadFile.name;
  
        uploadPath = require('path').resolve('./') + '/public/uploads' + newImageName;
  
        imageUploadFile.mv(uploadPath, function(err){
          if(err) return res.satus(500).send(err);
        })
  
      }

      const res = await Post.findByIdAndUpdate( id , { name: name, description: description, email: email, ingredients: ingredients, category: category , image: newImageName});
  
      req.flash('infoSubmit', 'Post has been Updated.')
      res.redirect('/submit-post');
    } catch (error) {
      // res.json(error);
      req.flash('infoErrors', error);
      res.redirect('/submit-post');
    }
  }

  exports.updatePosts = async(req, res) => {
    try {
      const posts = await Post.find({}).limit();
      res.render('edit-posts', { title: 'Blog Ser & Estar - Atualizar Postagens', posts } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 

  exports.updatePost = async(req, res) => {
    try {
      let postId = req.params.id;
      const post = await Post.findById({"_id": postId});
      const infoErrorsObj = req.flash('infoErrors');
      const infoSubmitObj = req.flash('infoSubmit');
      const categories = await Category.find({}).limit();
      res.render('update-post', { title: 'Cooking Blog - Atualizar Postagem', infoErrorsObj, infoSubmitObj, post, categories } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 


 async function deletePost(name){
   try {
     await Post.deleteOne({ name: 'New Post Updated' });
   } catch (error) {
     console.log(error);
   }
 }


   async function updatePost(name, img) {
    try{
        const res = await Post.updateOne( {name: 'Cozumel'} , { name: 'New Post Updated'});
        res.n;  //number of documents matched
        res.nModified; // Number of documents modified
    } catch(error) {
        console.log(error);
    }
  }

  

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
     // const salt = await bcrypt.genSaltSync();
      //const hashPassword = await bcrypt.hashSync( email, password, salt);
      
      User.findOne({email: email, password: password}, function(err, user) {
        if (err) {console.log(err); return res.satus(500).send({message: err.message});}
        if(!user) { 
          req.flash('infoSubmit', 'User not found.');
          return ;
        }
        req.session.user = user;
        console.log(req.session.user);
        return res.render('dashboard', {user : user});
      });
    } catch (error)  {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
}

exports.editCategories = async(req, res) => {
  try {
    const limitNumber = 80;
    const categories = await Category.find({}).limit(limitNumber);
    res.render('edit-categories', { title: 'Blog Ser & Estar - Categorias', categories } );
 
    } catch (error) {
      res.json({message: error.message || "Error Occured" });
    }
}

exports.editCategoryById = async(req, res) => { 
  try {
    let categoryId = req.params.id;
    const limitNumber = 40;
    const category = await Category.findOne({ 'name': categoryId }).limit(limitNumber);
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('edit-category', { title: 'Blog Ser & Estar', infoErrorsObj, infoSubmitObj, category } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 

exports.editCategoryPost = async(req, res) => {
  const {name} = req.body;
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }

    const res = await Category.updateOne( {name: name} , { name: 'New Recipe Updated', image: newImageName});
  
    req.flash('infoSubmit', 'Category has been Updated.')
    res.redirect('/edit-categories');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/edit-categories');
  }
}


exports.submitCategory = async(req, res) => {
    if(req.session.user){
      const infoErrorsObj = req.flash('infoErrors');
      const infoSubmitObj = req.flash('infoSubmit');
      res.render('register-category', { title: 'Blog Ser & Estar - Cadastrar Categoria', infoErrorsObj, infoSubmitObj } );
    } else {
      req.flash('error_msg', 'Please log in to view that resource');
      res.redirect('/login');
    }

  }

//Register Category

exports.submitCategoryPost = async(req, res) => {

  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/category/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }

     const newCategory = new Category({
      name: req.body.name,
      image: newImageName
    });
    
    await newCategory.save();

    req.flash('infoSubmit', 'Categoria Cadastrada.')
    res.redirect('/register-category');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/register-category');
  }
}

// route for dashboard
exports.dashboard = async(req, res) => {
    if(req.session.user){
        res.render('dashboard', {user : req.session.user});
    }else{   
      req.flash('error_msg', 'Entre com usuario para poder acessar!');   
        res.redirect('/login');
    }
}

// Get logout
exports.logout = async(req, res) => {
  const limitNumber = 10;
  const categories = await Category.find({}).limit(limitNumber);
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.send("Error")
        }else{
            const food = { latest, thai, american, chinese, Spanish };
            res.render('index', { title: 'Blog Ser & Estar - Inicio', categories, food } );
        }
    })
}