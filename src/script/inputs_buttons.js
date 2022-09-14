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

// Add cell button and shortcut
const addCellButton = document.getElementById('add-cell-btn');
const cellTemplate = document.getElementById('cell-add-template');
const cellsList = document.querySelector('.cells-selection-list');
const appWindow = document.querySelector('body');
addCellButton.addEventListener('click',(e)=>{
    addCell();
})
appWindow.addEventListener('keydown', (e)=>{
    if(e.key == 'ArrowDown'){ // Arrow Down adds new cell row
        addCell();
    }
    if(e.key == 'Enter'){ // Enter key saves raport
        saveCells();
    }
})


function addCell(){
    let template = document.importNode(cellTemplate.content, true);
    cellsList.appendChild(template);
}

//Save cells button
const saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', (e)=>{
    saveCells();
})

function saveCells(){
    let cells = document.querySelectorAll('.cells-selection');
    let isEmpty = false;
    let indexCorrext = true;
    let cellsObject = [];
    cells.forEach((cell)=>{ // list all selected cells
        let cellIndex = cell.querySelector('.cell-index').value;
        let cellName = cell.querySelector('.cell-name').value;
        if(cellIndex == "" || cellName == ""){ // if some windows are empty return error
            isEmpty = true;
        }else{
            let obj = {};
            if(cellIndex[0].toUpperCase() == cellIndex[0].toLowerCase()){ // check id index was written correctly - first char is a letter
                indexCorrext = false;
            }
            let indexNumber = cellIndex.substring(1);
            if(indexNumber.toUpperCase() != indexNumber.toLowerCase()){ // check id index was written correctly - the rest is number
                indexCorrext = false;
            }

            obj["index"] = cellIndex;
            obj["name"] = cellName;
            cellsObject.push(obj);
        }
    })

    let cellsNumber = cells.length;
    if(cellsNumber <= 24){ // 24 characters from C to Z - limit the quantity od cells
        if(isEmpty){ // if windows are empty then return an error, if not send data
            iziToast.show({
                title: 'Some windows are empty!',
                color: 'red',
                timeout: 2500,
                close: false,
                pauseOnHover: false,
            });
        }else{
            if(indexCorrext){
                ipcRenderer.send('saveRaports', cellsObject);
            }else{
                iziToast.show({
                    title: 'Wrong cell index!',
                    color: 'red',
                    timeout: 2500,
                    close: false,
                    pauseOnHover: false,
                });
            }
        }
    } else{
        iziToast.show({
            title: 'Cells limit reached!',
            color: 'yellow',
            timeout: 2500,
            close: false,
            pauseOnHover: false,
        });
    }
}

ipcRenderer.on('saveRaports:res', (err, response)=>{
    // response from saving
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


