import {makeTodo, makeProject} from "./todo.js";
import {updateSidebar} from "./dom.js"
// note: storage read and write are split to avoid circular dependency

// reads todos from local storage and recreates them
function getTodos(){

    // check if the todo ids exist in storage
    if(localStorage.getItem("todoIds") === null) {
        console.log("todo id list read error");
        return;
    }

    const todoIds = JSON.parse(localStorage.getItem("todoIds"));

    for(let i = 0; i < todoIds.length; i++) {
        let todo = JSON.parse(localStorage.getItem(todoIds[i]));
        makeTodo(todo.title, todo.description, todo.dueDate, todo.priority, 
                 todo.checklist, todo.notes, todo.id);
    }
}

// reads projects from local storage and recreates them
function getProjects(){

    // check if the project ids exist in storage
    if(localStorage.getItem("projectIds") === null) {
        console.log("project id list read error");
        return;
    }

    const projectIds = JSON.parse(localStorage.getItem("projectIds"));

    for(let i = 0; i < projectIds.length; i++) {
        let project = JSON.parse(localStorage.getItem(projectIds[i]));
        makeProject(project.title, project.todoList, project.id);
    }

    updateSidebar();
}

function printStorageCount() {
    if(localStorage.getItem("todoIds")){
        console.log("# todos: " + JSON.parse(localStorage.getItem("todoIds")).length);
    } else {
        console.log("no todo id list");
    }

    if(localStorage.getItem("projectIds")){
        console.log("# proj: " + JSON.parse(localStorage.getItem("projectIds")).length);
    } else {
        console.log("no project id list");
    }
}

export {getTodos, getProjects, printStorageCount};