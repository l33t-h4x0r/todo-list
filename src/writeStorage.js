// note: storage read and write are split to avoid circular dependency

// adds/updates a single todo to/in local storage and 
// updates the id lookup array if needed
function storeATodo(todo, brandNew){
    // add the todo to storage
    localStorage.setItem(todo.id, JSON.stringify(todo));

    // if a brand new todo, add its id to the array of todo ids
    if(brandNew){
        if(!localStorage.getItem("todoIds")){
            localStorage.setItem("todoIds", JSON.stringify([]));
        }
        let idList = JSON.parse(localStorage.getItem("todoIds"));
        idList.push(todo.id);
        localStorage.setItem("todoIds", JSON.stringify(idList));    
    }
}

// adds/updates a single project to/in local storage and 
// updates the id lookup array if needed
function storeAProject(project, brandNew){
    // add the project to storage
    localStorage.setItem(project.id, JSON.stringify(project));

    // if a new project, add its id to the array of project ids
    if(brandNew){
        // if the id array doesn't exist in storage, make it
        if(!localStorage.getItem("projectIds")){
            localStorage.setItem("projectIds", JSON.stringify([]));
        }
        let idList = JSON.parse(localStorage.getItem("projectIds"));
        idList.push(project.id);
        localStorage.setItem("projectIds", JSON.stringify(idList));
    }
}

// removes the given id from its id list and removes the 
// id's corresponding object from storage
function removeIdFromList(id, type) {
    if(type == "todo" || type == "project") {
        let idArr = JSON.parse(localStorage.getItem(`${type}Ids`));
        let index = idArr.indexOf(id);
        if(index >= 0 && localStorage.getItem(id)){
            idArr.splice(index, 1);
            localStorage.setItem(`${type}Ids`, JSON.stringify(idArr));
            localStorage.removeItem(id);
        } else {
            console.error("removeIdFromList id not found");
        }
    } else {
        console.error("removeIdFromList invalid listType");
    }
}


export {storeATodo, storeAProject, removeIdFromList};
