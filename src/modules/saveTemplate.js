const {DB_getElement, DB_editElement, DB_addElement, DB_deleteElement, DB_get} = require('../db/DB_Functions');
const templates_db = 'templates.json';

function saveTemplate(data, callback){
    let allTemplates = DB_get(templates_db, 'templates').data.templates;
    let exists = false;
    let existsId;
    allTemplates.forEach((template)=>{ // check if the same template alerady exsists
        if(template.templateName == data.templateName){
            exists = true;
            existsId = template._id;
        }
    })

    if(exists){ // the same name exists
        let result = DB_editElement(templates_db, 'templates', existsId, data).status;
        if(result){
            callback({status: true, message: 'Template saved!'});
        }else{
            callback({status: false, message: 'Something went wrong!'});
        }
    }else{ // the same name doesn't exsists
        let result = DB_addElement(templates_db, 'templates', data).status;
        if(result){
            callback({status: true, message: 'Template saved!'});
        }else{
            callback({status: false, message: 'Something went wrong!'});
        }
    }
    
}

module.exports = saveTemplate;