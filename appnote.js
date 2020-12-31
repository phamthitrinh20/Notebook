console.log("Welcome to notes app. This is app.js");
showNotes();

let indexUpdate = '';
let indexDelete = '';

$('#myModal').on('shown.bs.modal', function () {
    $('#addTitle').focus();
})

$('#myModal').on('hidden.bs.modal', function () {
    setBlankText();
    $(document.getElementById("title")).hide();
    $(document.getElementById("content")).hide();
    indexUpdate = '';
});

$("#modal-btn-yes").on("click", function () {
    let notes = localStorage.getItem("notes");
    if (notes == null) {
        notesObj = [];
    } else {
        notesObj = JSON.parse(notes);
    }

    notesObj.splice(indexDelete, 1);
    localStorage.setItem("notes", JSON.stringify(notesObj));
    showNotes();
    $("#mi-modal").modal('hide');
});

$("#modal-btn-no").on("click", function () {
    $("#mi-modal").modal('hide');
});

$("#modal-btn-yes-all").on("click", function () {
    let notesElm = document.getElementById("notes");
    let invalid1 = document.getElementById("title");
    let invalid2 = document.getElementById("content");
    let myObj = {
        title: addTitle.value,
        text: addTxt.value
    }
    localStorage.clear();
    if (notesObj.length != 0) {
        notesElm.innerHTML = " ";
    } else {
        addTitle.value = '';
        addTxt.value = '';
    }
    $(invalid1).hide();
    $(invalid2).hide();
    document.getElementById("notes").innerHTML = `
            <p style="margin-left:25px">Nothing to show! Use the "Add Note" section above to add a note.</p>
        `;
    $("#deleteAll-modal").modal('hide');
});

$("#modal-btn-no-all").on("click", function () {
    $("#deleteAll-modal").modal('hide');
});


// If user adds a note, add it to the localStorage
let addBtn = document.getElementById("addBtn");
addBtn.addEventListener("click", function (e) {
    let invalid1 = document.getElementById("title");
    let invalid2 = document.getElementById("content");
    $(invalid1).hide();
    $(invalid2).hide();
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date + ' ' + time;
    if (indexUpdate != '') {
        let notes = localStorage.getItem("notes");
        let addTxt = document.getElementById("addTxt");
        let addTitle = document.getElementById("addTitle");
        let myObj = {
            title: addTitle.value,
            text: addTxt.value,
        }
        if (!checkInvalid(myObj, invalid1, invalid2)) {
            return;
        }
        if (notes == null) {
            notesObj = [];
        } else {
            notesObj = JSON.parse(notes);
        }
        let isExist = false;
        let isUpdate = true;
        notesObj.forEach(function (element, index) {
            if (indexUpdate == index) {
                if (element.text == addTxt.value && element.title == addTitle.value) {
                    isUpdate = false;
                } else {
                    element.text = addTxt.value;
                    element.title = addTitle.value;
                    element.dateTime = dateTime;
                }
            }
        });
        if (!isUpdate) {
            alert("Haven't entered data to update !!");
            return;
        }
        setBlankText();
        indexUpdate = '';
        localStorage.setItem("notes", JSON.stringify(notesObj));
        showNotes();
        alert("Update successful");
        $('#myModal').modal('toggle');
        return;
    }
    let addTxt = document.getElementById("addTxt");
    let addTitle = document.getElementById("addTitle");
    let notes = localStorage.getItem("notes");
    let myObj = {
        title: addTitle.value,
        text: addTxt.value,
        dateTime: dateTime
    }
    if (notes == null) {
        notesObj = [];
    } else {
        notesObj = JSON.parse(notes);
    }

    if (!checkInvalid(myObj, invalid1, invalid2)) {
        return;
    }

    alert("Added successfully");
    $('#myModal').modal('toggle');
    notesObj.push(myObj);
    addTitle.value = '';
    addTxt.value = '';
    $(invalid1).hide();
    $(invalid2).hide();

    setBlankText();
    localStorage.setItem("notes", JSON.stringify(notesObj));
    showNotes();


});

function checkInvalid(myObj, invalid1, invalid2) {
    if (addTitle.value === '' && myObj.text === '') {
        invalid1.innerText = "Please enter a title Note";
        invalid2.innerText = "Please enter content Note";
        $(invalid1).show();
        $(invalid2).show();
        document.getElementById("title").value = '';
        document.getElementById("content").value = '';
        return false;
    } else if (myObj.text === '') {
        invalid2.innerText = "Please enter content Note";
        $(invalid2).show();
        return false;
    } else if (myObj.title === '') {
        invalid1.innerText = "Please enter a title Note";
        $(invalid1).show();
        return false;
    }
    return true;
}

// Function to show elements from localStorage
function showNotes() {
    let notes = localStorage.getItem("notes");
    if (notes == null) {
        notesObj = [];
    } else {
        notesObj = JSON.parse(notes);
    }
    let html = "";
    notesObj.forEach(function (element, index) {
        html += `
            <div class="noteCard my-2 mx-2 card  " style="width: 15rem;  background:#d9ffcc; left:20px ; box-shadow: 0 5px 6px 0 rgba(10, 10, 10, 0.28); bottom: 9px;">
                    <div class="card-body  ">
                        <div class="row ml-1 form-inline" >
							<div>${element.dateTime}</div>
							<div class="ml-auto mr-3">
                                <a data-toggle="modal" data-target="#myModal" id="${index}"onclick="updateNote(this.id)" >
                                     <i class="fa fa-pencil" style="color:green;font-size:20px" ></i>
                                </a>
                                <a id="${index}"onclick="deleteNote(this.id)"> 
                                      <i class="fa fa-trash-o" style="color:red;font-size:20px"></i>
                                </a>
							</div>
                        </div>
                        <hr>
                        <div >
                            <h5 class="card-title ">${element.title}</h5>
                            <p class="card-text" > ${element.text}</p>
                        </div>
                    </div>
                </div>`;
    });
    let notesElm = document.getElementById("notes");
    if (notesObj.length != 0) {
        notesElm.innerHTML = html;
    } else {
        notesElm.innerHTML = `
            <p style="margin-left:25px">Nothing to show! Use the "Add Note" section above to add a note.</p>
        `;
    }
}
// hàm update a note
function updateNote(indexTmp) {
    let notes = localStorage.getItem("notes");
    document.getElementById("addTitle").focus();
    if (notes == null) {
        notesObj = [];
    } else {
        notesObj = JSON.parse(notes);
    }
    let html = "";
    notesObj.forEach(function (element, index) {
        if (indexTmp == index) {
            document.getElementById("addTxt").value = element.text;
            document.getElementById("addTitle").value = element.title;
        }
    });
    indexUpdate = indexTmp;
}


// Function to delete a note
function deleteNote(index) {
    $("#mi-modal").modal('show');
    indexDelete = index;
}

const btn_del_clear = document.getElementById('clear');
btn_del_clear.addEventListener('click', function () {
    let notes = localStorage.getItem("notes");
    if (notes == "[]" || notes == null) {
        alert("No delete object exists");
        return;
    }
    $("#deleteAll-modal").modal('show');
});

function setBlankText() {
    document.getElementById("addTxt").value = '';
    document.getElementById("addTitle").value = '';
}

//Function to seach a note
let search = document.getElementById('searchTxt');
search.addEventListener("input", function () {

    let inputVal = search.value.toLowerCase();
    let noteCards = document.getElementsByClassName('noteCard');
    Array.from(noteCards).forEach(function (element) {
        let cardTxt1 = element.getElementsByTagName("p")[0].innerText;
        let cardTxt2 = element.getElementsByTagName("h5")[0].innerText;
        if (cardTxt1.includes(inputVal)) {
            element.style.display = "block";
        } else if (cardTxt2.includes(inputVal)) {
            element.style.display = "block";
        } else {
            element.style.display = "none";
        }
    })
})