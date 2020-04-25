// Cached element references
const btn = document.querySelector('button');
const inpEl = document.querySelector('input');
const ulEl = document.querySelector('ul');
const mainEl = document.querySelector('main');
let liToDelete = [];


//if list element is placeholder, dim opacity
function markPlaceholderTask() {
    const allLis = document.querySelectorAll('li');
    for(li of allLis) {
        if (li.textContent == 'Add first task' || li.textContent == 'All tasks completed!'){
            li.classList.add('placeholder_task');
        }
        else {
            li.classList.remove('placeholder_task')
        }
    }
};

//initialize so first task is marked as placeholder when page is loaded
markPlaceholderTask();

//if user clicks on the button
btn.addEventListener('click', handleButtonClick);

function handleButtonClick(evt) {
    // This expression only creates an in-memory element
    const liEl = document.createElement('li');
    //as long as user typed something
    if (inpEl.value !== '') {
        //get what user typed and add to new li element
        liEl.textContent = inpEl.value;
        //add new li element to ul
        ulEl.appendChild(liEl);
        //reset input value
        inpEl.value = ''};
        //check if we need to remove any placeholders
        checkPlaceholders();

        //adjusting the list's margin so it stays centered in the page
        adjustListMargins();
};


inpEl.addEventListener('keypress', handleEnterPress);

function handleEnterPress(evt) {
    //if user presses Enter
    if (evt.key === 'Enter') {
        const liEl = document.createElement('li');
        if (inpEl.value !== '') {
            liEl.textContent = inpEl.value;
            ulEl.appendChild(liEl);
            inpEl.value = ''};
            //check if we need to remove any placeholders
            checkPlaceholders();

            //adjusting the list's margin so it stays centered in the page
            adjustListMargins();
    }
};

//add event element to parent element to trigger on children element
ulEl.addEventListener('click', handleTaskClick);

function handleTaskClick(evt) {
    //get task that was clicked on
    let task = evt.target;
    console.log(task);

    //only remove if
    // a) task is not a placeholder task
    // b) task is not already in the process of being removed
    // c) task is a li element (bug fix: clicking of entire ul that causes crashing)
    if (task.classList.contains('placeholder_task') === false && task.classList.contains('remove') === false && task.tagName !== 'UL') {

        // change style properties of task
        task.classList.add('remove');

        //get height of task item
        let liHeight = task.getBoundingClientRect().height;

        //make task move up and away
        task.animate(
            [{ transform: 'translateY(0px)' }, 
            { transform: 'translateY(-300px)' }], { 
                // timing options
                duration: 1000,
                iterations: 1
            }
        );

        //make button slide up accordingly
        btn.animate(
            [{ transform: 'translateY(0px)' }, 
            { transform: `translateY(-${liHeight}px)` }], { 
                // timing options
                duration: 900,
                iterations: 1
            }
        );

        //make input field slide up accordingly
        inpEl.animate(
            [{ transform: 'translateY(0px)' }, 
            { transform: `translateY(-${liHeight}px)` }], { 
                // timing options
                duration: 900,
                iterations: 1
            }
        );

        //mark all tasks after removed task as such
        nextTasks = findTasksAfter();
        //make next tasks slide up accordingly
        for (task of nextTasks) {
            task.animate(
                [{ transform: 'translateY(0px)' }, 
                { transform: `translateY(-${liHeight}px)` }], { 
                    // timing options
                    duration: 900,
                    iterations: 1
                }
            );
        };

        //remove classes for remaining tasks, so we can check at next removal
        removeClasses();

        //set task as item we'll have to remove from the list
        liToDelete.push(evt.target);
        
        //trigger removal of item after it moves away
        setTimeout(removeLi, 900);

        //check if we've removed all tasks from list
        checkAllCompleted(liHeight);

    }
};

function findTasksAfter() {
    //first, set position of previous li elements to relative so they also slide up
    
    //get all tasks
    let tasks = ulEl.getElementsByTagName('li');


    //mark all tasks before removed element as 'before'
    for(task of tasks) {
        if (task.classList.contains('remove')) {
            break;
        }
        else {
            task.classList.add('before');
        }
    };

    //mark all tasks after removed element as 'after'
    for(task of tasks) {
        if (task.classList.length === 0) {
            task.classList.add('after');
        }
    };

    //find all tasks after removed item
    let tasksAfter = document.querySelectorAll('.after')
    return tasksAfter;
};


// remove task after click (after delay)
function removeLi() {
    //remove task item
    liToDelete[0].remove()

    //set positions of button and input fields as relative so they stay in place   
    btn.style.position = 'relative';
    inpEl.style.position = 'relative';

    //remove item to delete from array
    liToDelete.shift(); 
    
};


//check ul for placeholder tasks
function checkPlaceholders() {
    //get array of all tasks in ul
    let tasks = ulEl.getElementsByTagName('li');
    //if there's more than 1, iterate through them
    if (tasks.length > 1) {
        for(task of tasks) {
            //check if any of them are placeholders
            if (task.classList.contains('placeholder_task')) {
                //if so, remove placeholder task
                ulEl.removeChild(task);
            }
        }
    }
};

//check if completed all tasks
// takes height of list item as argument (to calculate its animation as it appears)
function checkAllCompleted(liHeight) {
    //get array of all tasks in ul
    let tasks = ulEl.getElementsByTagName('li');
    //if there's none, add the placeholder
    if (tasks.length === 1) {
        const allCompleteLi = document.createElement('li');
        //add li element saying all tasks were completed
        allCompleteLi.textContent = 'All tasks completed!';
        //add new li element to ul
        ulEl.appendChild(allCompleteLi);
        //mark new element as placeholder
        markPlaceholderTask();
        //make it slide up as it appears
        allCompleteLi.animate(
            [{ transform: 'translateY(0px)' }, 
            { transform: `translateY(-${liHeight}px)` }], { 
                // timing options
                duration: 900,
                iterations: 1
            }
        );
    }
};

function removeClasses() {
    //get array of all tasks in ul
    let tasks = ulEl.getElementsByTagName('li');
    //remove their classes 
    for(task of tasks) {
        task.classList.remove('before');
        task.classList.remove('after');
    };
};

function adjustListMargins() {
    //get adjusted height of to-do list
    let listHeight = mainEl.getBoundingClientRect().height;

    //set its top and bottom margin to negative halves of its height
    document.getElementById('list').style.marginBottom = -(listHeight)/2+'px';
    document.getElementById('list').style.marginTop = -(listHeight)/2+'px';
};



