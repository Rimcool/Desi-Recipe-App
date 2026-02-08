const { ipcRenderer } = require('electron');

let currentRecipes = []; // Store recipes globally for viewing details

function saveRecipeAsPDFByIndex(index) {
    const recipe = currentRecipes[index];
    if (!recipe) return;

    const pdfContent = `
        <h1>${recipe.name}</h1>
        <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
        <p><strong>Prep Time:</strong> ${recipe.prepTimeMinutes} minutes</p>
        <p><strong>Cook Time:</strong> ${recipe.cookTimeMinutes} minutes</p>
        <p><strong>Servings:</strong> ${recipe.servings}</p>
        <h2>Ingredients:</h2>
        <ul>
            ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
        <h2>Instructions:</h2>
        <ol>
            ${recipe.instructions.map(inst => `<li>${inst}</li>`).join('')}
        </ol>
    `;

    ipcRenderer.send('save-recipe-pdf', { name: recipe.name, content: pdfContent });
}

function showRecipeDetailByIndex(index) {
    const recipe = currentRecipes[index];
    if (!recipe) return;

    const display = document.getElementById('display');
    display.innerHTML = `
        <div class="recipe-detail">
            <h2>${recipe.name}</h2>
            <p><strong>Difficulty:</strong> ${recipe.difficulty} | <strong>Prep:</strong> ${recipe.prepTimeMinutes}m | <strong>Cook:</strong> ${recipe.cookTimeMinutes}m | <strong>Servings:</strong> ${recipe.servings}</p>
            <h3>Ingredients:</h3>
            <ul>
                ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
            <h3>Instructions:</h3>
            <ol>
                ${recipe.instructions.map(inst => `<li>${inst}</li>`).join('')}
            </ol>
            <button onclick="saveRecipeAsPDFByIndex(${index})" class="btn-pdf">Save as PDF 📄</button>
            <button onclick="resetView()" class="back-btn">Back to Search</button>
        </div>
    `;
}

// Reset view to a clean home page (clears results and input)
function resetView() {
    const display = document.getElementById('display');
    const input = document.getElementById('userInput');
    if (display) display.innerHTML = '';
    if (input) input.value = '';
}

function saveAsPDF() {
    // Tells the main.js "Brain" to start the PDF process
    ipcRenderer.send('print-to-pdf');
}

async function checkKitchen() {
    const input = document.getElementById('userInput').value.toLowerCase();
    const ingredientsHave = input.split(',').map(item => item.trim());
    const display = document.getElementById('display');
    
    display.innerHTML = "Checking the pantry...";

    try {
        // Fetch only Pakistani recipes from DummyJSON
        const response = await fetch('https://dummyjson.com/recipes/tag/Pakistani');
        const data = await response.json();
        const recipes = data.recipes;

        // FILTER LOGIC: Check if the user can cook a recipe with what they have
        const matches = recipes.filter(recipe => {
            const recipeIngredients = recipe.ingredients.map(i => i.toLowerCase());
            
            // Check if AT LEAST ONE ingredient the user has is in the recipe
            // This finds recipes that can use the ingredients they have
            return ingredientsHave.some(have => 
                recipeIngredients.some(ingredient => ingredient.includes(have))
            );
        });

        if (matches.length > 0) {
            currentRecipes = matches; // Store recipes for later use
            display.innerHTML = `Found ${matches.length} recipes!<br>`;
            display.innerHTML += matches.map((r, i) => `
                <div class="recipe">
                    <strong>${r.name}</strong><br>
                    <small>Difficulty: ${r.difficulty} | Prep: ${r.prepTimeMinutes}m | Cook: ${r.cookTimeMinutes}m</small><br>
                    <button onclick="showRecipeDetailByIndex(${i})" class="btn-view">View Recipe</button>
                </div>
            `).join('');
        } else {
            display.innerHTML = "No Pakistani recipes found with these items. Try 'Chicken' or 'Garlic'!";
        }
    } catch (err) {
        display.innerHTML = "Error loading recipes. Check your internet!";
    }
}
