import "./styles.css";
import {makeTodo, makeProject, projectList} from "./todo.js";
import {drawTodoHeader, updateSidebar, drawTodoForm} from "./dom.js";
import {isValid, parse} from "date-fns";
import {getTodos, getProjects, printStorageCount} from "./readStorage.js";

const body = document.querySelector("body");
const projectElement = document.querySelector("#project");
const sidebar = document.querySelector("#sidebar");

const clearBtn = document.querySelector("#clearStorage");
clearBtn.addEventListener("click", () => {
    localStorage.clear();
})

//const project1 = makeProject("project 1");
/*
const project2 = makeProject("project 2");
const project3 = makeProject("project 3");
*/
function makeTestTodo(project, n) {
    const testTodo = makeTodo(
        `todo ${n}`,
        "description",
        "2026-4-20",
        2,
        ["step 1", "step 2", "step 3"],
        "notes"
    );
    project.addTodo(testTodo);
}
/*
makeTestTodo(project1, 1);
makeTestTodo(project1, 2);
makeTestTodo(project1, 3);
makeTestTodo(project2, 1);
*/


//testTodo.editTodo("new title", "new desc", "2026-4-21", 1, ["new step 1", "new step 2"], "new notes");

updateSidebar(projectList);

let populateBtn = document.querySelector("#populate");
populateBtn.addEventListener("click", () => {
    console.log("loading todos");
    getTodos();
    console.log("loading projects");
    getProjects();
    
})

// every time the page loads, populate it with projects and
// todos from local storage
window.addEventListener("load", (event) => {
    console.log("loading projects");
    getProjects();
    console.log("loading todos");
    getTodos();

})




