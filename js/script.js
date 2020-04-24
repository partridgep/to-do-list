// First step in our workflow - select the DOM element

// Cached element references
const btn = document.querySelector('button');
const inpEl = document.querySelector('input');
const ulEl = document.querySelector('ul');
let liToDelete;

function markPlaceholderTask(li) {
    if (li.textContent == 'Add task to to-do list' || li.textContent == 'All tasks completed'){
        li.classList.add('placeholder_task');
    }
    else {
        li.classList.remove('placeholder_task')
    }
};

// Second step in our workflow - add the eventListener
//There are two arguments that get passed to addEVentListenebr
    // 1) event
    //2) callback function
// The callback function receives the event object as an argument
// at the the of execution
btn.addEventListener('click', handleButtonClick);

function handleButtonClick(evt) {
    // This expression only creates an in-memory element
    const liEl = document.createElement('li');
    if (inpEl.value !== '') {
        liEl.textContent = inpEl.value;
        ulEl.appendChild(liEl);
        inpEl.value = ''};
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
    }
};

//add event element to parent element to trigger on children element
ulEl.addEventListener('click', handleTaskClick);

function handleTaskClick(evt) {
    //get task that was clicked on
    let task = evt.target;

    // change style properties of task
    task.style.color = 'red';
    task.style.fontSize = '25px';
    task.style.fontWeight = '900';
    task.style.opacity = '0.5';

    //get height of task item
    let liHeight = task.getBoundingClientRect().height;
    console.log(liHeight);

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

    //set task as item we'll have to remove from the list
    liToDelete = evt.target;
    
    //trigger removal of item after it moves away
    setTimeout(removeLi, 900);
};


// remove task after click (after delay)
function removeLi() {
    //remove task item
    liToDelete.remove()
    //reset item to remove
    liToDelete = null;
    //set positions of button and input fields as relative so they stay in place
    btn.style.position = 'relative';
    inpEl.style.position = 'relative';
};

