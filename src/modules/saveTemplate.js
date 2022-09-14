const {DB_templates} = require('../database/database');
const {DB_addElement} = require('../database/DB_functions');

function saveTemplate(data, callback){
    let result = DB_addElement(DB_templates, 'templates', data);
    if(result){
        callback({status: true, message: 'Template saved!'});
    }else{
        callback({status: false, message: 'Something went wrong!'});
    }
}

module.exports = saveTemplate;