import { compareAsc, parse, isValid } from "date-fns";
import { storeATodo, storeAProject } from "./writeStorage.js";

const globalTodoList = [];
const projectList = [];
let currentProject;

function getCurrentProject(){
    return currentProject;
}
function setCurrentProject(project){
    currentProject = project;
}

// given an id, searches the list of todos for one with a matching
// id and returns it
function searchGlobalTodoList(id) {
    for(let i = 0; i < globalTodoList.length; i++){
        if(id == globalTodoList[i].id){
            return globalTodoList[i];
        }
    }
}

function searchProjectList(id) {
    for(let i = 0; i < projectList.length; i++){
        if(id == projectList[i].id){
            return projectList[i];
        }
    }
}

function makeTodo(title, description, dueDate, priority, checklist, notes, id = 0) {
    
    let brandNew = false;
    // if no id is provided (i.e. this is a brand new todo), 
    // assign a new one
    if(id == 0) {
        brandNew = true;
        id = crypto.randomUUID();
    }
    let complete = false;
    const toggleComplete = () => complete = !complete;
    let dateObj;
    if(isValid(new Date(dueDate))) {
        dateObj = parse(dueDate, "yyyy-MM-dd", new Date());
    } else {
        dateObj = false;
    }
    
    // assumes priority is an int where small number = high priority
    // e.g. returns negative when the calling object is higher priority
    function comparePriority(otherTodo){
        return this.priority - otherTodo.priority;
    }

    // Edits the values of an existing todo
    // note: is "this" needed? idk
    function editTodo(newTitle, newDesc, newDate, newPriority, newChecklist, newNotes) {
        this.title = newTitle;
        this.description = newDesc;
        if(isValid(new Date(newDate))){
            this.dateObj = parse(newDate, "yyyy-MM-dd", new Date());
        } else {
            this.dateObj = false;
        }
        this.priority = newPriority;
        this.checklist = newChecklist;
        this.notes = newNotes;

        // updates the todo in local storage
        storeATodo(this, false);
    }

    function print() {
        for(const [key, value] of Object.entries(this)) {
            if(typeof value != "function") {
                console.log(`${key}: ${value}`);
            }
        }
    }

    const todo = {
        title,
        description,
        priority,
        checklist,
        notes,
        id,
        complete,
        dateObj,
        print,
        comparePriority,
        toggleComplete,
        editTodo,
    };

    globalTodoList.push(todo);
    storeATodo(todo, brandNew);
    return todo;
}

function makeProject(title, todoList = [], id = 0) {
    
    let brandNew = false;
    // if no id is provided (i.e. this is a brand new project), assign one
    if(id == 0) {
        brandNew = true;
        id = crypto.randomUUID();
    }
    
    // adds a todo to the project
    function addTodo(todo) {
        todoList.push(todo);
        storeAProject(this, false);
    }

    function removeTodo(id) {
        // remove todo from the project todo list
        for(let i = 0; i < todoList.length; i++){
            if(todoList[i].id == id) {
                todoList.splice(i, 1);
                console.log("removing todo from project");
            }
        }
        // remove todo from the global todo list
        for(let i = 0; i < globalTodoList.length; i++){
            if(globalTodoList[i].id == id) {
                globalTodoList.splice(i, 1);
                console.log("removing todo from list");
            }
        }
        // update project in local storage
        storeAProject(this, false);
    }

    // comparison functions for use with sort()
    function prioritySortFunc(todo1, todo2) {
        return todo1.comparePriority(todo2);
    }
    function duedateSortFunc(todo1, todo2) {
        return compareAsc(todo1.dueDate, todo2.dueDate);
    }
    // sort the todos by different criteria
    function sortByPriority() {
        todoList.sort(prioritySortFunc);
    }
    function sortByDueDate() {
        todoList.sort(duedateSortFunc);
    }

    function printProject() {
        console.log(`Project: ${title}`);
        for(let i = 0; i < todoList.length; i++) {
            todoList[i].print();
        }
    }

    const project = {
        id,
        todoList,
        title,
        addTodo,
        removeTodo, 
        printProject, 
        sortByPriority, 
        sortByDueDate,
    };
    projectList.push(project);
    storeAProject(project, brandNew);
    return project;
}


export { makeTodo, makeProject, searchGlobalTodoList, searchProjectList,
        projectList, globalTodoList, getCurrentProject, setCurrentProject};