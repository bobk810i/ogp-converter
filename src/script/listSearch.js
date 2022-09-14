const searchWindow = document.getElementById('search-template-input');
searchWindow.addEventListener('input',(e)=>{
    let input = searchWindow.value
    input = input.toLowerCase();
    let newList = [];
    templatesGlobal.forEach((item)=>{
      let itemLowercase = item.templateName.toLowerCase();
      if(itemLowercase.includes(input)){ // check for all saved names looking for matching phrase
          newList.push(item);
      }
    })
    loadTemplates(newList);
})