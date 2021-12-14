function getExampleReceipts(userName){
    let receipts = new Array(); 
    if (userName != "none") {  
        let ex_receipt0 = 
        {
            id: "as8943nks01",
            date: "12/3/2021",
            title : "trader joe's groceries",
            users : ["jzimm135", "ehe340", "kev12"],
            people : [
                {
                    name : "Jacob",
                    initial : "j",
                    owes : 5.05
                },
                {
                    name : "Eddy",
                    initial : "e",
                    owes : -19.37
                },
                {
                    name : "Kev",
                    initial : "k",
                    owes : 7.16
                },
                {
                    name : "Adnan",
                    initial : "a",
                    owes : 7.16
                }
            ],
            tax : 5.25,
            subtotal : 19,
            total : 19.95,
            payer : 1,
            items : [{
                    name : "eggs",
                    price : 2.50,
                    sharedBy : ["Jacob", "Eddy", "Kev", "Adnan"],
                    sharedByString : "jeka"
                },
                {
                    name : "butter",
                    price : 4,
                    sharedBy : ["Kev", "Adnan"],
                    sharedByString : "ka"
                },
                {
                    name : "chicken",
                    price : 12.50,
                    sharedBy : ["Jacob", "Kev", "Adnan"],
                    sharedByString : "jka"
                }
            ]
        };
        let ex_receipt1 = 
        {
            id : "as8943nks01",
            date : "12/5/2021",
            title : "chipotle",
            users : ["jzimm135", "ehe340", "kev12"],
            people : [
                {
                    name : "Jacob",
                    initial : "j",
                    owes : -30.71
                },
                {
                    name : "Eddy",
                    initial : "e",
                    owes : 11.90
                },
                {
                    name : "Kevin",
                    initial : "k",
                    owes : 10.31
                },
                {
                    name : "Adnan",
                    initial : "a",
                    owes : 8.50
                }
            ],
            tax: 6.25,
            subtotal: 41.3,
            total: 43.88,
            payer: 0,
            items: [{
                    "name": "chicken burrito",
                    "price": 8.50,
                    "sharedBy": ["Kev"],
                    "sharedByString": "k"
                },
                {
                    "name": "burrito bowl",
                    "price": 20,
                    "sharedBy": ["Jacob", "Eddy"],
                    "sharedByString": "je"
                },
                {
                    "name": "quesadilla",
                    "price": 6.80,
                    "sharedBy": ["Adnan"],
                    "sharedByString": "a"
                },
                {
                    "name": "chips and guac",
                    "price": 6,
                    "sharedBy": ["Jacob", "Jacob", "Eddy", "Kev", "Adnan"],
                    "sharedByString": "jjeka"
                }
            ]
        };
        let ex2 = JSON.stringify(ex_receipt1);
        let ex_receipt2 = JSON.parse(ex2);
        ex_receipt2.title = "bfresh";
        receipts.push(ex_receipt0);
        receipts.push(ex_receipt1);
        receipts.push(ex_receipt2);
        receipts.push(ex_receipt1);
        receipts.push(ex_receipt0);
        receipts.push(ex_receipt1);
        receipts.push(ex_receipt2);
        receipts.push(ex_receipt1);
        receipts.push(ex_receipt0);
        receipts.push(ex_receipt1);
        receipts.push(ex_receipt2);
        receipts.push(ex_receipt1);
    }
    return receipts;
}

//build the receipt list
function createReceiptList(receipts){
    let receiptList = document.getElementById("receiptList");
    for (let i=0; i<receipts.length; i++){
        receiptList.appendChild(addReceipt(receipts[i],i));
    }
};


//Builds a new receipt item in the receiptList <ul>
//Takes in a receipt json
//and the index of which receipt it is working on relative to the receipts array
function addReceipt(receipt, i){
    let newReceipt = document.createElement("li"); 
    newReceipt.className = "oldReceipt";
    let title = createReceiptTitle(receipt.title, "receiptTitle");
    let date = createReceiptTitle(" on " + receipt.date, "receiptDate");
    let sharedDiv = document.createElement("div");
    let index = i;
    
    newReceipt.appendChild(title);
    newReceipt.appendChild(date);
    displayReceiptNames(sharedDiv, receipt);
    if (receipt.payer != -1){ //identify payer
        highlightPayer(sharedDiv, receipt);
    }
    newReceipt.appendChild(sharedDiv);
    newReceipt.onclick = function () {
                        document.body.style.pointerEvents = "none";
                        showReceipt(index) };
    newReceipt.ontouchend = function () {
                        document.body.style.touchAction = "none";
                        showReceipt(index) };
    return newReceipt;
};

function showReceipt(index) {
    let receipt = receipts[index];
    showFullReceipt(receipt);
    setTimeout(() => {
        document.body.style.touchAction = "auto";
        document.body.style.pointerEvents = "auto";
    }, 1000);
}

function createReceiptTitle(value, class_name){
    let title = document.createElement("div");
    title.className = class_name;
    title.className = class_name; //title related stuff
    let tnode = document.createTextNode(value); //add title
    title.appendChild(tnode);
    let arrow = document.createElement("i");
    if (class_name == "receiptTitle") {
        arrow.className = "fa fa-arrow-right";
    }
    title.appendChild(arrow);
    return title;
}

function displayReceiptNames(sharedDiv,receipt) {
    sharedDiv.className = "sharedBy"; //where 
    for (let i=0; i < receipt.people.length; i++){ //add names
        let nameDiv = document.createElement("div");
        nameDiv.className = "names";
        let currColor = nameColors[(i + 1) % nameColors.length];
        nameDiv.style.background = currColor;
        tnode = document.createTextNode(receipt.people[i].name);
        nameDiv.appendChild(tnode);
        sharedDiv.appendChild(nameDiv);
    }
}

function highlightPayer(x, receipt) {
    let payerName = x.getElementsByClassName("names")[receipt.payer];
    payerName.className += " payer";
    payerName.style.fontSize = "16px";
}

function showFullReceipt(receipt){
    populateReceipt(receipt);
    document.getElementsByClassName("addUser")[0].onclick = function () { sharePrevReceipt(receipt);}
    document.getElementById("deleteButton").onclick = function () { deleteReceipt(receipt);}
    document.getElementById("slider").style.transform = "translateX(-50%)";
}

function slideBack() {
    document.getElementById("slider").style.transform = "translateX(0%)";
    setTimeout(() => {
        while (!removeAllElementsByClassName("receiptRow")){};
        removeAllChildNodes("totalsRow");
    }, 600); 
}

function populateReceipt(receipt){
    clearArrayData();
    for (let i = 0; i < receipt.people.length; i++){
        names[i] = receipt.people[i].name;
        initials[i] = receipt.people[i].initial;
        totals[i] = receipt.people[i].owes;
    }
    let static = true;
    for (let i = 0; i < receipt.items.length; i++){
        items[i] = receipt.items[i].name;
        display(receipt.items[i].name,"items", static); //not editable
        prices[i] = receipt.items[i].price;
        display(prices[i].toString(),"prices", static); //not editable
        sharedBy[i] = receipt.items[i].sharedByString;
        displaySharedBy(sharedBy[i], static); //not editable
    }
    let top = document.getElementById("topInfo");
    top.getElementsByClassName("receiptTitle")[0].innerHTML = receipt.title;
    top.getElementsByClassName("receiptDate")[0].innerHTML = "on "  + receipt.date;
    document.getElementById("totalVal").innerHTML = receipt.total;
    document.getElementById("tax").innerHTML = "Tax: " + receipt.tax;
    payer = receipt.payer;
    if (payer > -1) {
        totals[payer] = totals[payer] * -1;
    }
    displayTotals("history");
    let owes = document.getElementsByClassName("owes");
    for (let i = 0; i < owes.length; i++) {
        if (i == receipt.payer){
            owes[receipt.payer].innerHTML = " is owed: $" + (-1 * receipt.people[i].owes);
        }
        else {
            owes[i].innerHTML = " owes: $" + (receipt.people[i].owes);
        }
    }
}

function clearArrayData(){
    names = [];
    initials = [];
    items = [];
    prices = [];
    sharedBy = [];
}

function removeAllElementsByClassName(class_name) {
    let rows = [];
    rows = document.getElementsByClassName(class_name);
    for (let i = 0; i < rows.length; i++) {
        rows[i].remove()
    }
    rows = document.getElementsByClassName(class_name);
    if (rows.length > 0){
        removeAllElementsByClassName(class_name);
    }
    return true;
}

function sharePrevReceipt(receipt) {
    document.getElementsByClassName("saveArea")[0].style.display = "flex";
    document.getElementsByTagName("input")["title"].value = receipt.title;
    let copyReceipt = JSON.parse(JSON.stringify(receipt));
    console.log(receipt);
    console.log("^^FROM SHAREPREV");
    document.getElementsByClassName("saveButton")[0].onclick = function () {submitShareReceipt(copyReceipt)};
}

function submitShareReceipt(copyReceipt) {
    let usernameOBJs = document.getElementsByName("sharedUser");
    let usernames = []; //initialize array without current username
    for (let i = 0; i < usernameOBJs.length; i++) {
        let str = usernameOBJs[i].value; //add new usernames
        if (str != ""){
            usernames.push(hash(str));
        }
    }
    if (usernames.length == 0) {
        return;
    }
    copyReceipt.users = [];
    copyReceipt.users = usernames;
    console.log(copyReceipt);
    document.share.receiptJSON.value = JSON.stringify(copyReceipt);
    setTimeout(() => {
        document.share.onsubmit = function () {return true};
        document.share.submit();
    }, 100);
}

function deleteReceipt(copyFromReceipt) {
    let text = "Are you sure you want to delete receipt \'" + copyFromReceipt.title + "\'?\n This action is not reversible.";
    if (confirm(text) == false) {
        return;
    }
    let receipt = JSON.parse(JSON.stringify(copyFromReceipt));
    console.log(receipt);
    let newusers = [];
    newusers = receipt.users;
    let index = newusers.indexOf(username);
    if (index == -1){
        return;
    }
    newusers.splice(index,1);
    receipt.users = newusers;
    document.delete.id.value = receipt._id;
    document.delete.receiptJSON.value = JSON.stringify(receipt);
    setTimeout(() => {
        document.delete.submit();
    }, 100);
}