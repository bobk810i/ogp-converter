// Import eletron
const electron = require('electron');
const {ipcRenderer} = electron;

// Raports directory input button
const raportsButton = document.getElementById('raports-directory-button');
const raportsPath = document.getElementById('raports-directory-input-path');

raportsButton.addEventListener('click', (e)=>{
    ipcRenderer.send('chooseRaportsDirectory:req', '');
})
ipcRenderer.on('chooseRaportsDirectory:res', (err, res)=>{
    if(res != undefined){
        raportsPath.innerHTML = res;
    }else{
        raportsPath.innerHTML = '';
    }
    
})

// Add cell button
const addCellButton = document.getElementById('add-cell-btn');
const cellTemplate = document.getElementById('cell-add-template');
const cellsList = document.querySelector('.cells-selection-list');
addCellButton.addEventListener('click',(e)=>{
    let template = document.importNode(cellTemplate.content, true);
    cellsList.appendChild(template);
})

//Save cells button
const saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', (e)=>{
    let cells = document.querySelectorAll('.cells-selection');
    let isEmpty = false;
    let cellsObject = [];
    cells.forEach((cell)=>{ // list all selected cells
        let cellIndex = cell.querySelector('.cell-index').value;
        let cellName = cell.querySelector('.cell-name').value;
        if(cellIndex == "" || cellName == ""){ // if some windows are empty return error
            isEmpty = true;
        }else{
            let obj = {};
            obj["index"] = cellIndex;
            obj["name"] = cellName;
            cellsObject.push(obj);
        }
    })
    if(isEmpty){ // if windows are empty then return an error, if not send data
        iziToast.show({
            title: 'Some windows are empty!',
            color: 'red',
            timeout: 2500,
            close: false,
            pauseOnHover: false,
        });
    }else{
        console.log(cellsObject);
        ipcRenderer.send('saveRaports', cellsObject);
    }

})

ipcRenderer.on('saveRaports:res', (err, data)=>{
    // response from saving
})


