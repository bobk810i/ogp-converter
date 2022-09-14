const uniqid = require('uniqid');

function DB_indexById(database, databaseName, id){
    let isDatabaseName = false;
    let isDatabase = false;
    let isId = false;
    if(database !== undefined){isDatabase = true;} // check if database arg. exisits
    if(databaseName !== undefined){isDatabaseName = true;} // check if database name arg. exisits
    if(id !== undefined){isId = true;} // check if id arg. exisits
    if(isDatabase && isId && isDatabaseName){
        let index = 0;
        let goodIndex = 0;
        let idExsist = false;
        data = database.get(databaseName).value();
        data.forEach((element)=>{
            if(element._id == id){
                goodIndex = index;
                idExsist = true;
            }
            index = index+ 1;
        })
        if(idExsist){
            return goodIndex
        }else{
            return null
        }
    }else{
        return null
    }
    
}

function DB_elementById(database, databaseName, id){
    let isDatabase = false;
    let isDatabaseName = false;
    let isId = false;
    if(database !== undefined){isDatabase = true;} // check if database arg. exisits
    if(databaseName !== undefined){isDatabaseName = true;} // check if database name arg. exisits
    if(id !== undefined){isId = true;} // check if id arg. exisits
    if(isDatabase && isId && isDatabaseName){
        let goodElement = null;
        let idExsists = false;
        data = database.get(databaseName).value();
        data.forEach((element)=>{
            if(element._id == id){
                goodElement = element;
                idExsists = true;
            }
        })
        if(idExsists){
            return goodElement
        }else{
            return null
        }
    }else{
        return null
    }
}

function DB_deleteById(database, databaseName, id){
    let isDatabase = false;
    let isDatabaseName = false;
    let isId = false;
    if(database !== undefined){isDatabase = true;} // check if database arg. exisits
    if(databaseName !== undefined){isDatabaseName = true;} // check if database name arg. exisits
    if(id !== undefined){isId = true;} // check if id arg. exisits
    if(isDatabase && isId && databaseName){
        let success = false;
        let index = DB_indexById(database, databaseName, id);
        if(index !== null){ // check if element with this id exsists
            data = database.get(databaseName).value();
            data.forEach((element)=>{
                if(element._id == id){
                    database.get(databaseName).get(index).delete(true);
                    database.save();
                    success = true;
                } 
            })
            return success
        }else{
            return false
        }       
    }else{
        return false
    }
}

function DB_addElement(database, databaseName, element){
    let isDatabase = false;
    let isDatabaseName = false;
    let isElement = false;
    if(database !== undefined){isDatabase = true;} // check if database arg. exisits
    if(databaseName !== undefined){isDatabaseName = true;} // check if database name arg. exisits
    if(element !== undefined){isElement = true;} // check if element arg. exisits
    if(isDatabase && isElement && isDatabaseName){
        let uniqueId = uniqid();
        Object.assign(element, {_id : uniqueId});
        database.get(databaseName).push(element);
        database.save();
        return true
    }else{
        return false
    }
}

function DB_editElement(database, databaseName, id, element){
    let isDatabase = false;
    let isDatabaseName = false;
    let isId = false;
    let isElement = false;
    if(database !== undefined){isDatabase = true;} // check if database arg. exisits
    if(databaseName !== undefined){isDatabaseName = true;} // check if database name arg. exisits
    if(id !== undefined){isId = true;} // check if id arg. exisits
    if(element !== undefined){isElement = true;} // check if element arg. exisits
    if(isDatabase && isId && databaseName && isElement){
        let index = DB_indexById(database, databaseName, id);
        if(index !== null){
            let databaseValueNames = []; // list of properties names in database Model
            let dbValues = Object.entries(database.get(databaseName).get(index).value());
            dbValues.forEach((dbValue)=>{ // set list of properties names
                databaseValueNames.push(dbValue[0]);
            })
            let toAdd = Object.entries(element); // transform element object into array
            toAdd.forEach((valueName)=>{
                if(databaseValueNames.includes(valueName[0])){
                    database.get(databaseName).get(index).get(valueName[0]).set(valueName[1]);
                }
            })
            database.save();
            return true
        }else{
            return false
        }
    }else{
        return false
    }
}

module.exports = {DB_indexById, DB_elementById, DB_deleteById, DB_addElement, DB_editElement};

