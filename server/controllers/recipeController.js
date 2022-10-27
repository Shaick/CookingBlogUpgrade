require('../models/database');
const Category = require('../models/Category');

//Get homepage
exports.homepage = async(req, res) => {
    try{
        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('index', { title: 'Cookinkg Blog - Home', categories } );
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