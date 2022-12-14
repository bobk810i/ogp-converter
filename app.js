const electron = require('electron');
const url = require('url');
const path = require('path');
const saveRaport = require('./src/modules/saveRaport');
const saveTemplate = require('./src/modules/saveTemplate');
const {DB_getElement, DB_editElement, DB_addElement, DB_deleteElement, DB_get} = require('./src/db/DB_Functions');
const configId = '6h9ssbnqsl807pnzp';

const {app, BrowserWindow, Menu, ipcMain, dialog} = electron;

// Main app window variable
let appWindow;
const templates_db = 'templates.json';
const config_db = 'config.json';

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

    let options  = {
        buttons: ["Ok"],
        message: "Before saving close all Excel windows!",
        title: "Close windows",
        noLink: true,
    };
    dialog.showMessageBox(options).then(async (result)=>{
        // response: 0 - YES, 1 - NO
        if(result.response == 0){
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
        }else{
            // do nothing - just close the window
        }
    })
})

// Save templates
ipcMain.on("saveTemplate:req", (err, object)=>{
    saveTemplate(object, (result)=>{
        appWindow.webContents.send('saveTemplate:res', result);
    });
})

// Get templates
ipcMain.on("templates:req", (err, data)=>{
    let templates = DB_get(templates_db, 'templates').data;
    appWindow.webContents.send('templates:res', templates);
})

// Delete template
ipcMain.on("deleteTemplate:req", (err, id)=>{

    let options  = {
        buttons: ["Yes","No"],
        message: "Are you sure?",
        title: "Delete template",
        noLink: true,
    };
    dialog.showMessageBox(options).then((result)=>{
        // response: 0 - YES, 1 - NO
        if(result.response == 0){
            let result = DB_deleteElement(templates_db, 'templates', id).status;
            if(result){
                appWindow.webContents.send('deleteTemplate:res', {status: true, message: "Template deleted!"});
            }else{
                appWindow.webContents.send('deleteTemplate:res', {status: false, message: "Can't delete template! Try again later..."});
            }
        }else{
            // do nothing - just close the window
        }
    })
    
})

// Go to Settings page
ipcMain.on('settings', (err, data)=>{
    appWindow.loadFile('settings.html');
}) 

// Go to Main page
ipcMain.on('mainPage', (err, data)=>{
    appWindow.loadFile('index.html');
}) 

// Settings informations
ipcMain.on('settings-info:req', (err, data)=>{
    let element = DB_getElement(config_db, 'config', configId).data;
    appWindow.webContents.send('settings-info:res', element);
})

// Settings - default sheet name
ipcMain.on('settings-sheet:req', (err, newName)=>{
    let result = DB_editElement(config_db, 'config', configId, {"defaultSheetName": newName}).status;
    if(result){
        appWindow.webContents.send('settings-sheet:res', {status: true, message: "Saved!"});
    }else{
        appWindow.webContents.send('settings-sheet:res', {status: false, message: "Error occured! Try again later..."});
    }
})

// Settings default shifts values
ipcMain.on('settings-shifts:req', (err, data)=>{
    let result = DB_editElement(config_db, 'config', configId, data).status;
    if(result){
        appWindow.webContents.send('settings-shifts:res', {status: true, message: "Saved!"});
    }else{
        appWindow.webContents.send('settings-shifts:res', {status: false, message: "Error occured! Try again later..."});
    }
})

// TESTS =================================

// const {DB_getElement, DB_editElement, DB_addElement, DB_deleteElement} = require('./src/db/DB_Functions');

// let status = DB_deleteElement('templates.json', 'templates', "6h9ssbedsl843z0k8");
// console.log(status);
// DB_addElement('templates.json', 'templates', {"data": "jeden"});






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
