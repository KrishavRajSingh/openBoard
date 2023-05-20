let optionsCont = document.querySelector('.options-cont');

// true ->  show options    false -> hide options
let optionsFlag = true;

let iconElem = optionsCont.children[0]; //iconElement
let toolsCont = document.querySelector(".tools-cont");  //tools-container
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let pencilFlag = false;
let eraserFlag = false;
let pencil = toolsCont.querySelector(".pencil");
let eraser = toolsCont.querySelector(".eraser");
let sticky = toolsCont.querySelector(".sticky");
let upload = toolsCont.querySelector(".upload")

optionsCont.addEventListener("click",(e)=>{
    optionsFlag = !optionsFlag;
    
    if(optionsFlag)
    openTools();
    else
    closeTools(e);
})
function openTools(){
    iconElem.classList.remove("fa-times");
    iconElem.classList.add("fa-bars");
    toolsCont.style.display = "flex";
    pencilFlag = false;
    eraserFlag = false;
}

function closeTools(e){  
    iconElem.classList.remove("fa-bars");
    iconElem.classList.add("fa-times");
    toolsCont.style.display = "none";
    pencilToolCont.style.display = "none";
    eraserToolCont.style.display = "none";
    
}

pencil.addEventListener("click",(e)=>{
    // true -> show pencil      false -> hide pencil
    pencilFlag = !pencilFlag;
    if(pencilFlag)
    pencilToolCont.style.display = "block";
    else
    pencilToolCont.style.display = "none";
    
})

eraser.addEventListener("click",(e)=>{
    // true -> show eraser      false -> hide eraser
    eraserFlag = !eraserFlag;
    if(eraserFlag)
    eraserToolCont.style.display = "flex";
    else
    eraserToolCont.style.display = "none";
    
})

sticky.addEventListener("click",(e)=>{
    let stickyTemplateHTML = `
    <div class="header-cont">
            <div class="minimize">
         
            </div>
            <div class="remove">
              
            </div>
    </div>
    <div class="note-cont">
            <textarea spellcheck="false"></textarea>
    </div>
    `;
    createSticky(stickyTemplateHTML);

    // let stickyCont = document.createElement('div');
    // stickyCont.setAttribute("class","sticky-cont");
    // stickyCont.innerHTML = `
    // <div class="header-cont">
    //         <div class="minimize">
    //             <i class="fa-regular fa-window-minimize"></i>
    //         </div>
    //         <div class="remove">
    //             <i class="fa-solid fa-xmark"></i>
    //         </div>
    // </div>
    // <div class="note-cont">
    //         <textarea spellcheck="false"></textarea>
    // </div>
    // `;
    // document.body.appendChild(stickyCont);

    // let minimize = stickyCont.querySelector(".minimize");
    // let remove = stickyCont.querySelector(".remove");
   
    // noteActions(minimize,remove,stickyCont);
    
    // stickyCont.onmousedown = function(event) {
    //     dragAndDrop(stickyCont,event);
    // };
      
    // stickyCont.ondragstart = function() {
    //     return false;
    // };
})

function createSticky(stickyTemplate){
    let stickyCont = document.createElement('div');
    stickyCont.setAttribute("class","sticky-cont");
    stickyCont.innerHTML = stickyTemplate;
    document.body.appendChild(stickyCont);

    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");
   
    noteActions(minimize,remove,stickyCont);
    
    stickyCont.onmousedown = function(event) {
        dragAndDrop(stickyCont,event);
    };
      
    stickyCont.ondragstart = function() {
        return false;
    };
}

function noteActions(minimize,remove,stickyCont){
    // remove sticky
    remove.addEventListener("click",(e)=>{
        stickyCont.remove();
    })
    // minimize note
    minimize.addEventListener("click",(e)=>{
        let noteCont = stickyCont.querySelector(".note-cont");
        let display = getComputedStyle(noteCont).getPropertyValue("display");
        console.log(display);
        if(display === "none")
        noteCont.style.display = "block";
        else
        noteCont.style.display = "none";
    })
}

function dragAndDrop(element,event){
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;
    
    element.style.position = 'absolute';
    element.style.zIndex = 1000;
    // document.body.appendChild(element);
    
    moveAt(event.pageX, event.pageY);
    
    // moves the element at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }
    
    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }
    
    // move the element on mousemove
    document.addEventListener('mousemove', onMouseMove);
    
    // drop the element, remove unneeded handlers
    element.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}

upload.addEventListener("click",(e)=>{
    let input = document.createElement("input");
    input.setAttribute("type","file");
    input.click();

    input.addEventListener("change",(e)=>{
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickyTemplateHTML = `
        <div class="header-cont">
                <div class="minimize">
                    <i class="fa-regular fa-window-minimize"></i>
                </div>
                <div class="remove">
                    <i class="fa-solid fa-xmark"></i>
                </div>
        </div>
        <div class="note-cont">
            <img src="${url}">
        </div>
        `;
        
        createSticky(stickyTemplateHTML);
    })
})