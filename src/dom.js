import { searchGlobalTodoList, searchProjectList, makeTodo, 
        getCurrentProject, setCurrentProject, makeProject,
        projectList
} from "./todo.js";
import { format } from "date-fns";

import xIcon from "./close.svg";
import check from "./check.svg";

// creates a header (title, duedate, checkbox) for the given todo
// and appends it to parentElement
function drawTodoHeader(todo, parentElement){

    // top level todo container, has the id data attribute
    let container = document.createElement("div");
    container.classList.add("todoContainer");
    container.addEventListener("click", expandTodo);
    container.dataset.id = todo.id;

    // header container
    let header = document.createElement("div");
    header.classList.add("todoHeader");

    // checkbox
    let checkbox = document.createElement("button");
    checkbox.classList.add("todoCheckbox");
    checkbox.addEventListener("click", clickCheckBox);

    // title
    let title = document.createElement("h1");
    title.classList.add("todoTitle");
    title.textContent = todo.title;

    // duedate
    let duedate = document.createElement("div");
    duedate.classList.add("todoDuedate");
    if(todo.dateObj) {
        duedate.textContent = `${format(todo.dateObj, "MM/dd")}`;
    }

    // options
    const options = document.createElement("button");
    options.classList.add("todoOptions");
    options.textContent = "Options";
    options.addEventListener("click", showTodoOptions);


    parentElement.appendChild(container);
    container.appendChild(header);
    header.appendChild(checkbox);
    header.appendChild(title);
    header.appendChild(duedate);
    header.appendChild(options);
}

function showTodoOptions(e){
    
    if(e.target.classList.contains("expanded")){

    } else {

        // edit button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("todoEditBtn");
        editBtn.addEventListener("click", editTodo);

        // delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("todoDeleteBtn");
        deleteBtn.addEventListener("click", deleteTodo);

        e.target.appendChild(editBtn);
        e.target.appendChild(deleteBtn);
    }
    e.stopPropagation();
}

// if not already present, appends a todo's description, checklist, 
// and notes to its header. If already present, hides them instead
function expandTodo(event){

    // selects the todo container of the event target
    let parentElement = event.target.closest(".todoContainer");

    // if the todo is already expanded...
    if(parentElement.classList.contains("expanded")){

        // remove the 2nd child (i.e. the details section)
        parentElement.children[1].remove();

    // if it isn't expanded, appennd the description, checklist, and notes
    } else {

        const id = parentElement.dataset.id;
        const todoInfo = searchGlobalTodoList(id);

        // container for expanded todo items
        const details = document.createElement("div");
        details.classList.add("todoDetails");

        // description
        let description = document.createElement("div");
        description.classList.add("todoDescription");
        description.textContent = todoInfo.description;

        // checklist
        let checklist = document.createElement("ul");
        checklist.classList.add("todoChecklist");
        for(let i = 0; i < todoInfo.checklist.length; i++){
            let listItem = document.createElement("ul");
            listItem.textContent = todoInfo.checklist[i];
            checklist.appendChild(listItem);
        }

        // notes
        let notes = document.createElement("div");
        notes.classList.add("todoNotes");
        notes.textContent = todoInfo.notes;

        parentElement.appendChild(details);
        details.appendChild(description);
        details.appendChild(checklist);
        details.appendChild(notes);
    }
    parentElement.classList.toggle("expanded");
}

function updateSidebar() {
    
    const projectListElem = document.querySelector("#projectList");
    // clear current list of projects
    for(const child of document.querySelectorAll("#projectList *")){
        child.remove();
    }
    console.log("# projects: " + projectList.length);
    // write the new list of projects
    for(let i = 0; i < projectList.length; i++){
        const project = document.createElement("li");
        project.classList.add("projectTitle");
        project.dataset.id = projectList[i].id;
        project.textContent = projectList[i].title;
        // when the project name is clicked, display the project
        project.addEventListener("click", (event) => {
            displayProject(event, document.querySelector("#projectContainer"));
        })
        projectListElem.appendChild(project);
    }
}

function addTodoToProject(event) {
    drawTodoForm(event.target.parentNode);
}

function displayProject(event, parentElement) {

    // clear currently displayed project
    for(const child of parentElement.querySelectorAll("*")){
        child.remove();
    }
    // find new project
    const id = event.target.dataset.id;
    const project = searchProjectList(id);
    setCurrentProject(project);
    // create project header
    const projectHeader = document.createElement("div");
    projectHeader.dataset.projectId = id;
    projectHeader.id = "projectHeader";
    const projectTitle = document.createElement("div");
    projectTitle.textContent = project.title;
    const addTodo = document.createElement("button");
    addTodo.textContent = "Add Todo";
    addTodo.addEventListener("click", addTodoToProject);
    parentElement.appendChild(projectHeader);
    projectHeader.appendChild(projectTitle);
    projectHeader.appendChild(addTodo);

    refreshProject(project, parentElement);
}

// deletes and reprints a project's todo headers
function refreshProject(project, parentElement){
    const todos = document.querySelectorAll(".todoContainer");
    todos.forEach((todo) => todo.remove());
    // print todo headers
    for(let i = 0; i < project.todoList.length; i++){
        drawTodoHeader(project.todoList[i], parentElement);
    }
}

function createFormElem(inputId, inputType, name, labelText, value, radioValue){
    const label = document.createElement("label");
    label.setAttribute("for", `${inputId}Input`);
    label.textContent = labelText;
    label.classList.add("formLabel");
    label.id = `${inputId}Label`;

    let input;
    if(inputType == "textarea"){
        input = document.createElement("textarea");
        input.setAttribute("rows", 3);
        input.setAttribute("cols", 20);
    } else {
        input = document.createElement("input");
        input.setAttribute("type", inputType);
    }
    input.setAttribute("id", inputId);
    input.setAttribute("name", name);
    input.classList.add("formElement");
    input.id = `${inputId}Input`;
    if(value) {
        input.value = value;
    }
    if(inputType == "radio"){
        input.setAttribute("value", radioValue);
    }
    
    label.appendChild(input);
    return label;
}

function submitForm(event, isEdit, defaultValues){
    // get form input values
    const title = document.querySelector("#titleInput").value;
    const duedate = document.querySelector("#duedateInput").value;
    const description = document.querySelector("#descriptionInput").value;
    const notes = document.querySelector("#notesInput").value;
    let priority = 2;
    if(document.querySelector("input[type=radio]:checked")){
        console.log("there is a checked radio button");
        priority = document.querySelector("input[type=radio]:checked").value;
    }
    const checklist = [];
    const checklistItems = document.querySelectorAll("#checklistFieldset input");
    for(let i = 0; i < checklistItems.length; i++){
        checklist.push(checklistItems[i].value);
    }
    // if creating a new todo...
    if(!isEdit) {
        // create new todo, add it to the todos list, and print
        const newTodo = makeTodo(title, description, duedate, priority, checklist, notes);
        getCurrentProject().addTodo(newTodo);
        drawTodoHeader(newTodo, document.querySelector("#projectContainer"));
    // else if editing an existing todo...
    } else {
        // edit the todo and refresh the project
        defaultValues.editTodo(title, description, duedate, priority, checklist, notes);
        refreshProject(getCurrentProject(), document.querySelector("#projectContainer"));
    }
    
    document.querySelector("#formContainer").remove();
    
}

// displays the form used to create or edit todos
// defaultValues is the todo object to be edited
function drawTodoForm(appendTo, isEdit = false, defaultValues){
    
    cancelForm();

    let values;
    // default form values when creating a new todo 
    if(!isEdit) {
        values = {
            title: "",
            duedate: "",
            description: "",
            notes: "",
            checklist: [],
            priority: 2
        };
    // if editing an exisitng todo, its values are used instead
    } else {
        values = defaultValues;
    }

    const formContainer = document.createElement("div");
    formContainer.id = "formContainer";

    formContainer.appendChild(createFormElem("title", "text", "title", "Title", values.title));
    if(!isEdit){
        formContainer.appendChild(createFormElem("duedate", "date", "duedate", "Due Date", values.duedate));
    } else {
        formContainer.appendChild(createFormElem("duedate", "date", "duedate", "Due Date", format(values.dateObj, "yyyy-MM-dd")));

    }
    formContainer.appendChild(createFormElem("description", "textarea", "description", "Description", values.description));
    formContainer.appendChild(createFormElem("notes", "textarea", "notes", "Notes", values.notes));

    // priority
    const pFieldset = document.createElement("fieldset");
    pFieldset.id = "priorityFieldset"
    const legend = document.createElement("legend");
    legend.textContent = "Priority";
    const radioContainer = document.createElement("div");
    radioContainer.id = "radioContainer";
    radioContainer.appendChild(createFormElem("priority1", "radio", "priority", "High", 1));
    radioContainer.appendChild(createFormElem("priority2", "radio", "priority", "Medium", 2));
    radioContainer.appendChild(createFormElem("priority3", "radio", "priority", "Low", 3));

    pFieldset.appendChild(legend);
    pFieldset.appendChild(radioContainer);
    formContainer.appendChild(pFieldset);

    // checklist
    let clCounter = 0;
    let valuesCounter = 0;
    const clFieldset = document.createElement("fieldset");
    clFieldset.id = "checklistFieldset";
    const clLegend = document.createElement("legend");
    clLegend.textContent = "Checklist";
    const addBtn = document.createElement("button");
    addBtn.textContent = "Add Checklist Item";
    addBtn.addEventListener("click", () => {
        clCounter++;
        const clItem = createFormElem(`clItem${clCounter}`, "text", `clitem${clCounter}`, ``, values.checklist[valuesCounter]);
        const deleteBtn = document.createElement("img");
        deleteBtn.src = xIcon;
        deleteBtn.classList.add("checklistDeleteBtn");
        deleteBtn.addEventListener("click", deleteChecklistItem);
        clItem.appendChild(deleteBtn);
        clFieldset.appendChild(clItem);
    });
    
    for(let i = 0; i < values.checklist.length; i++) {
        addBtn.click();
        valuesCounter++;
    }

    clFieldset.appendChild(clLegend);
    clFieldset.appendChild(addBtn);
    formContainer.appendChild(clFieldset);

    const formBtns = document.createElement("div");
    formBtns.id = "formBtns";
    formContainer.appendChild(formBtns)

    // submit button
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Submit";
    submitBtn.id = "submitBtn";
    submitBtn.addEventListener("click", (e) => {submitForm(e, isEdit, defaultValues)});
    formBtns.appendChild(submitBtn);

    // cancel button
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.id = "cancelBtn";
    cancelBtn.addEventListener("click", cancelForm);
    formBtns.appendChild(cancelBtn);

    appendTo.appendChild(formContainer);
}

function deleteChecklistItem(event) {
    event.target.parentElement.remove();
}

// if there is a todo form open, deletes it
function cancelForm() {
    const form = document.querySelector("#formContainer");
    if(form){
        console.log("deleting form");
        form.remove();
    }
}

function clickCheckBox(event) {
    event.target.classList.toggle("checked");
    const todoId = event.target.closest(".todoContainer").dataset.id;
    const todo = searchGlobalTodoList(todoId);
    todo.toggleComplete();
    event.stopPropagation();
}

function editTodo(event) {
    const todoId = event.target.closest(".todoContainer").dataset.id;
    const todo = searchGlobalTodoList(todoId);

    drawTodoForm(document.querySelector("#projectHeader"), true, todo);
}

function deleteTodo(event) {
    let id = event.target.closest(".todoContainer").dataset.id;
    getCurrentProject().removeTodo(id);
    refreshProject(getCurrentProject(), document.querySelector("#projectContainer"));
}

function addProject(){
    const projectList = document.querySelector("#projectList");
    const newProject = document.createElement("li");
    newProject.classList.add("newProject");
    const projectName = document.createElement("input");
    projectName.classList.add("newProjectInput");

    const cancel = document.createElement("img");
    cancel.src = xIcon;
    cancel.classList.add("projectIcon");
    cancel.addEventListener("click", () => {
        newProject.remove();
    })

    const confirm = document.createElement("img");
    confirm.src = check;
    confirm.classList.add("projectIcon");
    confirm.addEventListener("click", () => {
        makeProject(projectName.value);
        updateSidebar();
    })

    projectList.appendChild(newProject);
    newProject.appendChild(projectName);
    newProject.appendChild(confirm);
    newProject.appendChild(cancel);

}
const addProjectBtn = document.querySelector("#addProjectBtn");
addProjectBtn.addEventListener("click", addProject);

export {drawTodoHeader, updateSidebar, drawTodoForm};