// Import eletron
const electron = require('electron');
const {ipcRenderer} = electron;

// Global variables
let templatesGlobal;

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

// Save template 
const saveTemplateButton1 = document.getElementById('save-template-button');
const saveTemplateButton2 = document.getElementById('save-template-save');
const cancelSaveTemplateButton = document.getElementById('save-template-cancel');
const saveTemplateModal = document.querySelector('.save-template-modal-bcg');
const saveTemplateInput = document.getElementById('save-template-input');

saveTemplateButton1.addEventListener('click', (e)=>{
    saveTemplateInput.value = '';
    saveTemplateModal.style.display = 'flex';
})
cancelSaveTemplateButton.addEventListener('click', (e)=>{
    saveTemplateModal.style.display = 'none';
})
saveTemplateButton2.addEventListener('click', (e)=>{
    let cellsList = document.querySelectorAll('.cells-selection');
    if(cellsList.length != 0){
        saveTemplate(cellsList);
    }else{
        saveTemplateModal.style.display = 'none';
        iziToast.show({ // saving incorrect
            title: 'No cells in template!',
            color: 'red',
            timeout: 2500,
            close: false,
            pauseOnHover: false,
        });
    }
})

function saveTemplate(cellsList){
    let obj = [];
    cellsList.forEach((item)=>{
        let index = item.querySelector('.cell-index').value;
        let name = item.querySelector('.cell-name').value;
        let temp = {};
        temp["name"] = name;
        temp["index"] = index;
        obj.push(temp);
    })
    if(saveTemplateInput.value.length != 0){
        let dbObject = {"templateName" : saveTemplateInput.value, "template": obj};
        ipcRenderer.send("saveTemplate:req", dbObject);
    }else{
        // do nothing
    }
    
}

ipcRenderer.on("saveTemplate:res", (err, response)=>{
    if(response.status){ // saving correct
        iziToast.show({
            title: response.message,
            color: 'green',
            timeout: 2500,
            close: false,
            pauseOnHover: false,
        });
        ipcRenderer.send("templates:req", ''); // reload templates list
        cellsList.innerHTML = ''; // clear cells list
    }else{
        iziToast.show({ // saving incorrect
            title: response.message,
            color: 'red',
            timeout: 2500,
            close: false,
            pauseOnHover: false,
        });
    }
    saveTemplateModal.style.display = 'none';
})

// Load templates list
ipcRenderer.send("templates:req", ''); // request for templates list
ipcRenderer.on("templates:res", (err, data)=>{
    templatesGlobal = data; // put tamplates into global variable
    loadTemplates(data);
})

const templateTemplate = document.getElementById('search-list-template');
const searchTemplateList = document.getElementById('search-list');
function loadTemplates(templates){
    searchTemplateList.innerHTML = '';
    templates.forEach((item)=>{
        let tmp = document.importNode(templateTemplate.content, true);
        let name = tmp.querySelector('.search-item-name');
        let delButton = tmp.querySelector('.search-item-delete');
        name.innerHTML = item.templateName;
        delButton.id = item._id;
        name.id = item._id;
        searchTemplateList.appendChild(tmp);
    })
}

// Delete template
function deleteTemplate(id){
    ipcRenderer.send('deleteTemplate:req', id);
}
ipcRenderer.on('deleteTemplate:res', (err, response)=>{
    if(response.status){ // deleting correct
        iziToast.show({
            title: response.message,
            color: 'green',
            timeout: 2500,
            close: false,
            pauseOnHover: false,
        });
    }else{
        iziToast.show({ // deleting incorrect
            title: response.message,
            color: 'red',
            timeout: 2500,
            close: false,
            pauseOnHover: false,
        });
    }
    ipcRenderer.send("templates:req", ''); // reload templates list
    cellsList.innerHTML = ''; // clear cells list
})

// Open template
function openTemplate(id){
    templatesGlobal.forEach((element)=>{
        if(element._id == id){
            loadTemplate(element);
        }
    })
}

function loadTemplate(data){
    let selectedTemplateName = document.getElementById(data._id);
    cellsList.innerHTML = ''; // clear cells list
    unboldList();
    selectedTemplateName.style.fontWeight = 700;
    data.template.forEach((item)=>{
        let tmp = document.importNode(cellTemplate.content, true);
        let index = tmp.querySelector('.cell-index');
        let name = tmp.querySelector('.cell-name');
        index.value = item.index;
        name.value = item.name;
        cellsList.appendChild(tmp);
    })
}

function unboldList(){ // unbolds all list entries
    let searchListNames = document.querySelectorAll('.search-item-name');
    searchListNames.forEach((name)=>{name.style.fontWeight = 400});
}

// New template button
const newTemplateButton = document.getElementById('new-template-button');
newTemplateButton.addEventListener('click', (e)=>{
    cellsList.innerHTML = ''; // clear cells list
    unboldList(); // unbold all the list entries
})

// Settings
const settingsButton = document.getElementById('settings-button');
settingsButton.addEventListener('click', (e)=>{
    ipcRenderer.send('settings', '');
})
