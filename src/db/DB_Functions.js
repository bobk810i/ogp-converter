const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid');

function DB_get(dbPath, dbName){
    let fullDbPath = path.join(__dirname, dbPath);
    let rawData = fs.readFileSync(fullDbPath);
    let data = JSON.parse(rawData);

    return {"status": true, "data": data};
}

function DB_getElement(dbPath, dbName, id){
    let fullDbPath = path.join(__dirname, dbPath);
    let rawData = fs.readFileSync(fullDbPath);
    let data = JSON.parse(rawData);
    
    let finalElement = null;
    data[dbName].forEach((element)=>{ // search fir the element in database
        if(element._id == id){
            finalElement = element;
        }
    })
    if(finalElement != null){ // element found in database
        return {"status": true, "data": finalElement};
    }else{ // element not found in database
        return {"status": false}
    }
}

function DB_addElement(dbPath, dbName, newElement){
    let fullDbPath = path.join(__dirname, dbPath);
    let rawData = fs.readFileSync(fullDbPath);
    let data = JSON.parse(rawData);

    newElement["_id"] = uniqid(); // Add id to the element

    data[dbName].push(newElement);
    fs.writeFileSync(fullDbPath, JSON.stringify(data, null, 2), 'utf8');
    return {"status": true};
}

function DB_editElement(dbPath, dbName, id, newElement){
    let fullDbPath = path.join(__dirname, dbPath);
    let rawData = fs.readFileSync(fullDbPath);
    let data = JSON.parse(rawData);
    let elementIndex = indexById(data[dbName], id); // get the element index in database
    let oldElement = DB_getElement(dbPath, dbName, id).data; // get the old element itself
    
    let finalElement = oldElement;

    if(finalElement != null){ // element found in database
        let dbValuesNames = [];
        let dbEditedValuesNames = [];
        Object.entries(finalElement).forEach((entry)=>{ // list all the existing db element entries
            dbValuesNames.push(entry[0]);
        })
        Object.entries(newElement).forEach((entry)=>{ // list all the new db element entries
            dbEditedValuesNames.push(entry[0]);
        })
        
        dbValuesNames.forEach((existingValue)=>{
            dbEditedValuesNames.forEach((newValue)=>{
                if(existingValue == newValue){
                    finalElement[existingValue] = newElement[existingValue];
                }
            })
        })

        data[dbName].splice(elementIndex, 1); // delete old element
        data[dbName].push(finalElement); // add element to the database
        fs.writeFileSync(fullDbPath, JSON.stringify(data, null, 2), 'utf8');
        return {"status": true} // everything alright

    }else{ // element not found in database
        return {"status": false}
    }
}

function indexById(data, id){
    let counter = 0;
    let index = counter;
    data.forEach((element)=>{
        if(element._id == id){
            index = counter;
            
        }else{
            counter = counter + 1;
        }
    })
    return index;
}

function DB_deleteElement(dbPath, dbName, id){
    let fullDbPath = path.join(__dirname, dbPath);
    let rawData = fs.readFileSync(fullDbPath);
    let data = JSON.parse(rawData);
    let elementIndex = indexById(data[dbName], id);

    data[dbName].splice(elementIndex, 1);
    fs.writeFileSync(fullDbPath, JSON.stringify(data, null, 2), 'utf8');
    return {"status": true};
}

module.exports = {DB_getElement, DB_addElement, DB_editElement, DB_deleteElement, DB_get};