const electron = require('electron');
const url = require('url');
const path = require('path');
const saveRaport = require('./src/modules/saveRaport');
const saveTemplate = require('./src/modules/saveTemplate');
const {DB_templates} = require('./src/database/database');
const {DB_deleteById} = require('./src/database/DB_functions');

const {app, BrowserWindow, Menu, ipcMain, dialog} = electron;

// Main app window variable
let appWindow;

//Choosen raports directory variable
let reportsDirectory = '';

const browserWindowSettings = {
        icon: path.join(__dirname, 'src/graphics/ogp-logo.ico'), // Setting app icon
        height: 800,
        width: 1200,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    }

// Listen for the app to be ready
app.on('ready', ()=>{
    //Create main window
    appWindow = new BrowserWindow(browserWindowSettings);
    // Load html into a window
    appWindow.loadFile('index.html');
    // Build menu from template
    const defaultMenu = Menu.buildFromTemplate([]);
    // Insert menu (actually blank menu)
    // Menu.setApplicationMenu(defaultMenu);
});

// Open directory choose window
ipcMain.on('chooseRaportsDirectory:req', async (e, arg)=>{
    const directory = await dialog.showOpenDialog(appWindow, {
        properties: ['openDirectory']
    })
  reportsDirectory = directory.filePaths[0];
  appWindow.webContents.send('chooseRaportsDirectory:res', directory.filePaths[0]);
})

// Save raports
ipcMain.on('saveRaports', async (err, data)=>{
    const file = await dialog.showSaveDialog(appWindow, {
        properties: ['openFile'],
        filters:[{ name: 'File', extensions: ['xlsx', 'xls'] }]
    })
    if(!file.canceled){ // check if the saving was canceled
        if(reportsDirectory == undefined){
            appWindow.webContents.send('saveRaports:res', {status: false, message: 'No directory path!'});
        }else{
            saveRaport(data, reportsDirectory, file.filePath, (result)=>{
                appWindow.webContents.send('saveRaports:res', result);
            })
        }
    }
})

// Save templates
ipcMain.on("saveTemplate:req", (err, object)=>{
    saveTemplate(object, (result)=>{
        appWindow.webContents.send('saveTemplate:res', result);
    });
})

// Get templates
ipcMain.on("templates:req", (err, data)=>{
    let templates = DB_templates.get('templates').value()
    appWindow.webContents.send('templates:res', templates);
})

// Delete template
ipcMain.on("deleteTemplate:req", (err, id)=>{
    let result = DB_deleteById(DB_templates, 'templates', id);
    if(result){
        appWindow.webContents.send('deleteTemplate:res', {status: true, message: "Template deleted!"});
    }else{
        appWindow.webContents.send('deleteTemplate:res', {status: false, message: "Can't delete template! Try again later..."});
    }
    
})













// EXCEL I/O ===================================================================================

// const demo = "demo text";
// const newFile = XLSX.utils.book_new();
// const newSheet = XLSX.utils.aoa_to_sheet([]);

// const cell = "A1";

// XLSX.utils.sheet_add_aoa(newSheet, [["DemoText"]], {origin: cell});

// XLSX.utils.book_append_sheet(newFile, newSheet, "DemoSheet");


// XLSX.writeFile(newFile, "./src/demoFile.xlsx");

// const workbook = XLSX.readFile("./raports/Rap36.xls");
// const worksheet = workbook.Sheets["WorkSheet_01"];
// console.log(worksheet["E9"].v);
