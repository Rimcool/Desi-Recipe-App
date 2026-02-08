# PK Desi Ingredient Game

A fun retro-style Electron app that helps you discover Pakistani recipes based on ingredients you have at home.

## Features

✨ **90s Retro Design** — Neon glows, pixel-art overlay, and arcade vibes  
🍛 **Pakistani Recipes** — Real recipes from the DummyJSON API  
🎮 **Interactive Gameplay** — Enter ingredients to find recipes  
📄 **Export to PDF** — Save recipes and search results as PDFs  
🔄 **Fast Search** — Real-time recipe matching  

## Getting Started

### Prerequisites
- **Node.js** (v14+)
- **npm**

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/Rimcool/Desi-Recipe-App.git
   cd Desi-Recipe-App
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the app:
   ```bash
   npm start
   ```

### Building for Distribution

To create Windows installers and portable zips:

```bash
npm run dist
```

Output files will be in the `dist/` folder:
- `DesiRecipeGame Setup 1.0.0.exe` — Windows installer
- `DesiRecipeGame-1.0.0-win.zip` — Portable zip

## How to Use

1. **Enter Ingredients** — Type the ingredients you have (comma-separated)
2. **Search** — Click "What can I cook?"
3. **View Recipe** — Click on any recipe card to see full details
4. **Save as PDF** — Export recipes or the search screen as PDFs
5. **Back to Search** — Click "Back to Search" to start over with a clean slate

## Tech Stack

- **Electron** — Desktop app framework
- **Node.js** — Runtime
- **Vanilla JS** — Frontend logic
- **DummyJSON API** — Recipe data (Pakistani recipes)
- **electron-builder** — App packaging

## API

Recipes are fetched from the [DummyJSON API](https://dummyjson.com/recipes/tag/Pakistani).

## Author

**Rimcool** (rimlashehad@gmail.com)

## License

ISC

---

**Enjoy cooking with the recipes you discover!** 🇵🇰
