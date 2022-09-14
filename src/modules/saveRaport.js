const XLSX = require("xlsx");
const fs = require('fs'); 
const path = require('path');
const {DB_config} = require('../database/database');
const {DB_addElement, DB_elementById} = require('../database/DB_functions');
const configId = '6h9ssbnqsl807pnzp';

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const startingRow = 5;
const startingColumn = 2;

function saveRaport(data, directoryPath, savePath, callback){
    if(directoryPath != ""){ // check if the directory path exsists
        // Create a new file and sheet + add info
        const newFile = XLSX.utils.book_new();
        const newSheet = XLSX.utils.aoa_to_sheet([]);
        XLSX.utils.book_append_sheet(newFile, newSheet, "Data"); // append sheet th the file

        // Excel file constants
        XLSX.utils.sheet_add_aoa(newSheet, [["L.p."]], {origin: 'A1'});
        XLSX.utils.sheet_add_aoa(newSheet, [["File name"]], {origin: 'B1'});
        XLSX.utils.sheet_add_aoa(newSheet, [["Nominal"]], {origin: 'A2'});
        XLSX.utils.sheet_add_aoa(newSheet, [["Upper tol."]], {origin: 'A3'});
        XLSX.utils.sheet_add_aoa(newSheet, [["Lower tol."]], {origin: 'A4'});
        XLSX.utils.sheet_add_aoa(newSheet, [["-"]], {origin: 'B2'});
        XLSX.utils.sheet_add_aoa(newSheet, [["-"]], {origin: 'B3'});
        XLSX.utils.sheet_add_aoa(newSheet, [["-"]], {origin: 'B4'});

        // Read all files in directory
        fs.readdir(directoryPath, (err, filesList)=>{
            let filesCounter = 0;
            filesList.forEach((file)=>{ // check how many xls or xlsx files they are
                let name = file.split('.')[1];
                if(name == 'xls' || name == 'xlsx'){ // check if the file is xls or xlsx
                    filesCounter = filesCounter + 1;
                }
            })
            if(filesCounter != 0){
                let rowCounter = startingRow;
                filesList.forEach((file)=>{ // save files if conuter != 0
                    let columnCounter = startingColumn;
                     let name = file.split('.')[1];
                     if(name == 'xls' || name == 'xlsx'){

                        const wb = XLSX.readFile(path.join(directoryPath, file));
                        const defaultWorkSheet = DB_elementById(DB_config, 'config', configId);
                        const worksheet = wb.Sheets[defaultWorkSheet.defaultSheetName]; // DEFAULT SHEET NAME FROM DB

                        data.forEach((cell)=>{ // write each cell that user wrote in program
                            // Read value from opened file and write it to the new one
                            XLSX.utils.sheet_add_aoa(newSheet, [[worksheet[cell.index].v]], {origin: `${alphabet[columnCounter]}${rowCounter}`});
                            
                            // Set the column name
                            // XLSX.utils.sheet_add_aoa(newSheet, [[worksheet[cell.index].v]], {origin: `${alphabet[columnCounter]}1`});

                            // Set the nominal dimention
                            // let dataColumn = cell.index[0];
                            // let nominalColumnRaw = alphabet.indexOf(dataColumn.toUperCase());
                            // let nominalColumn = parseInt(nominalColumnRaw) - 1;
                            // XLSX.utils.sheet_add_aoa(newSheet, [[worksheet[`${alphabet[nominalColumn]}${cell.index[1]}`].v]], {origin: `${alphabet[columnCounter]}2`});

                            // Set the upper tol. and lower tol.
                            // XLSX.utils.sheet_add_aoa(newSheet, [[worksheet[`${alphabet[nominalColumn + 4]}${cell.index[1]}`].v]], {origin: `${alphabet[columnCounter]}3`});
                            // XLSX.utils.sheet_add_aoa(newSheet, [[worksheet[`${alphabet[nominalColumn + 5]}${cell.index[1]}`].v]], {origin: `${alphabet[columnCounter]}4`});

                            columnCounter = columnCounter + 1; // switch to another column
                        })
                        rowCounter = rowCounter + 1; // switch to another row

                     }
                })
            }else{
                callback({status: false, message: 'No .xls or .xlsx files in directory!'})
            }

            // Save new file
            XLSX.writeFile(newFile, savePath);

        });




        callback({status: true, message: 'Raport saved!'});
    }else{
        callback({status: false, message: 'No directory path!'});
    }
}

module.exports = saveRaport;


// Async example ===============================

// async function load(){
//     let result = await new Promise((resolve, reject)=>{
//         let data
//         try{
//             data =  Project.find()
//         }catch(err){
//             reject(err);
//         }finally{
//             resolve(data);
//         }
//     })
//     return result
// }

// module.exports = load;