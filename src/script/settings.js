// Import eletron
const electron = require('electron');
const {ipcRenderer} = electron;

// Back button
const backButton = document.getElementById('settings-back-button');
backButton.addEventListener('click',(e)=>{
    ipcRenderer.send('mainPage', '');
})

// Load informations
ipcRenderer.send('settings-info:req', ''); // reload informations

const sheetName = document.getElementById('default-sheet-name');
const nominal = document.getElementById('shift-nominal');
const upper = document.getElementById('shift-upper');
const lower = document.getElementById('shift-lower');

ipcRenderer.on('settings-info:res', (err, data)=>{
    sheetName.value = data.defaultSheetName;
    nominal.value = data.nominalShift;
    upper.value = data.upperShift;
    lower.value = data.lowerShift;
})

// Save sheet name
const saveSheetButton = document.getElementById('default-sheet-name-save');
saveSheetButton.addEventListener('click', (e)=>{
    let newSheetName = document.getElementById('default-sheet-name');
    if(newSheetName.value == ''){
        // do nothing when the name is empty
    }else{
        ipcRenderer.send('settings-sheet:req', newSheetName.value);
    }
})

ipcRenderer.on('settings-sheet:res', (err, response)=>{
    if(response.status){ // saving correct
        iziToast.show({
            title: response.message,
            color: 'green',
            timeout: 2500,
            close: false,
            pauseOnHover: false,
        });
    }else{
        iziToast.show({ // saving incorrect
            title: response.message,
            color: 'red',
            timeout: 2500,
            close: false,
            pauseOnHover: false,
        });
    }
})

// Save shifts
const saveShiftsButton = document.getElementById('default-shifts-save');
saveShiftsButton.addEventListener('click', (e)=>{
    let nominal = document.getElementById('shift-nominal');
    let upper = document.getElementById('shift-upper');
    let lower = document.getElementById('shift-lower');
    ipcRenderer.send('settings-shifts:req', {"lowerShift":lower.value,"upperShift":upper.value,"nominalShift":nominal.value});
})


ipcRenderer.on('settings-shifts:res', (err, response)=>{
    if(response.status){ // saving correct
        iziToast.show({
            title: response.message,
            color: 'green',
            timeout: 2500,
            close: false,
            pauseOnHover: false,
        });
    }else{
        iziToast.show({ // saving incorrect
            title: response.message,
            color: 'red',
            timeout: 2500,
            close: false,
            pauseOnHover: false,
        });
    }
})