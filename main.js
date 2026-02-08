const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

// --- MISSING CODE STARTS HERE ---

function createWindow() {
  // Create the browser window
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      // CRITICAL FIX: Enable Node.js features in your HTML/Renderer JS
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load your HTML file
  win.loadFile('index.html');
}

// Start the app when Electron is ready
app.whenReady().then(createWindow);

// Standard behavior: Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// --- MISSING CODE ENDS HERE ---

// The IPC listener for saving individual recipe PDFs
ipcMain.on('save-recipe-pdf', (event, data) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    
    dialog.showSaveDialog(win, {
        title: 'Save Recipe',
        defaultPath: path.join(app.getPath('downloads'), `${data.name}.pdf`),
        filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
    }).then(result => {
        if (!result.canceled) {
            // Create HTML content for PDF
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
                        h1 { color: #01411c; border-bottom: 3px solid #ffce00; padding-bottom: 10px; }
                        h2 { color: #01411c; margin-top: 20px; }
                        ul, ol { line-height: 1.8; }
                        p { margin: 5px 0; }
                    </style>
                </head>
                <body>
                    ${data.content}
                </body>
                </html>
            `;
            
            // Create a temporary window to render the HTML and convert to PDF
            const tempWin = new BrowserWindow({ show: false });
            tempWin.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(htmlContent)}`);
            
            tempWin.webContents.on('did-finish-load', () => {
                tempWin.webContents.printToPDF({}).then(data => {
                    fs.writeFile(result.filePath, data, (error) => {
                        if (error) console.error(error);
                        else console.log(`Recipe saved to: ${result.filePath}`);
                        tempWin.close();
                    });
                }).catch(err => console.error(err));
            });
        }
    });
});

// The IPC listener for the old print-to-pdf (if still needed)
ipcMain.on('print-to-pdf', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    
    // Show a save dialog so the user can pick where the PDF goes
    dialog.showSaveDialog(win, {
        title: 'Save Desi Recipe',
        defaultPath: path.join(app.getPath('downloads'), 'recipe.pdf'),
        filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
    }).then(result => {
        if (!result.canceled) {
            // Generate PDF from the current window content
            win.webContents.printToPDF({}).then(data => {
                fs.writeFile(result.filePath, data, (error) => {
                    if (error) throw error;
                    console.log(`Saved recipe to: ${result.filePath}`);
                });
            }).catch(error => console.log(error));
        }
    });
});
