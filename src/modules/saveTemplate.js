const {DB_templates} = require('../database/database');
const {DB_addElement, DB_editElement} = require('../database/DB_functions');

function saveTemplate(data, callback){
    let allTemplates = DB_templates.get('templates').value();
    let exists = false;
    let existsId;
    allTemplates.forEach((template)=>{ // check if the same template alerady exsists
        if(template.templateName == data.templateName){
            exists = true;
            existsId = template._id;
        }
    })

    if(exists){ // the same name exists
        let result = DB_editElement(DB_templates, 'templates', existsId, data);
        if(result){
            callback({status: true, message: 'Template saved!'});
        }else{
            callback({status: false, message: 'Something went wrong!'});
        }
    }else{ // the same name doesn't exsists
        let result = DB_addElement(DB_templates, 'templates', data);
        if(result){
            callback({status: true, message: 'Template saved!'});
        }else{
            callback({status: false, message: 'Something went wrong!'});
        }
    }
    
}

module.exports = saveTemplate;