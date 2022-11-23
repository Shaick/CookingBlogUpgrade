let addIngredientsBtn = document.getElementById('addKeywordsBtn');
let ingredientList = document.querySelector('.keywordsList');
let ingredeintDiv = document.querySelectorAll('.keywordsDiv')[0];

addIngredientsBtn.addEventListener('click', function(){
  let newIngredients = ingredeintDiv.cloneNode(true);
  let input = newIngredients.getElementsByTagName('input')[0];
  input.value = '';
  ingredientList.appendChild(newIngredients);
});