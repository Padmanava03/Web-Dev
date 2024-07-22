let count = 0;
let total = 0.00;
let editingRow = null;
let reset = null;

function update(){
    let x = document.getElementById("item").value;
    let y = document.getElementById("quantity").value;
    let z = document.getElementById("price").value;
    if(x!=="" && y!=="" && z!==""){
        if(editingRow){
            let oldPrice = parseFloat(editingRow.getElementsByTagName("td")[3].textContent);
            total -= oldPrice;

            editingRow.getElementsByTagName("td")[0].textContent = x;
            editingRow.getElementsByTagName("td")[1].textContent = y;
            editingRow.getElementsByTagName("td")[2].textContent = z;
            editingRow.getElementsByTagName("td")[3].textContent = (parseInt(y)*parseFloat(z)).toFixed(2);

            total += parseInt(y)*parseFloat(z);
            document.getElementById("Total").textContent = total.toFixed(2);
            calculateGST(total);
            calculateGtotal(total);

            cancelEdit();
        }else{
            count += 1;
            let tbody = document.getElementsByTagName("tbody")[1];
            let newRow = document.createElement("tr");

            let newCell1 = document.createElement("th");
            newCell1.textContent = count;
            newRow.appendChild(newCell1);

            let newCell2 = document.createElement("td");
            newCell2.textContent = x;
            newCell2.style.paddingLeft = "10px";
            newRow.appendChild(newCell2);

            let newCell3 = document.createElement("td");
            newCell3.style.textAlign = "center";
            newCell3.textContent = y;
            newRow.appendChild(newCell3);

            let newCell4 = document.createElement("td");
            newCell4.style.textAlign = "center";
            newCell4.textContent = z;
            newRow.appendChild(newCell4);

            let newCell5 = document.createElement("td");
            newCell5.style.textAlign = "center";
            newCell5.textContent = (parseInt(y)*parseFloat(z)).toFixed(2);
            newCell5.style.paddingRight = "10px";
            newRow.appendChild(newCell5);

            let newCell6 = document.createElement("td");
            newCell6.style.display = "flex";
            newCell6.style.justifyContent = "space-evenly";
            newCell6.style.alignItems = "center";
            newCell6.className = "noPrint";

            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.id = "cancel-btn";
            deleteButton.style.width = "60px"
            deleteButton.onclick = function(){
                deleteRow(newRow);
            }
            newCell6.appendChild(deleteButton);
            
            let editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.id = "add-btn";
            editButton.onclick = function(){
                editRow(newRow);
            }
            editButton.style.width = "60px"
            newCell6.appendChild(editButton);
            newRow.appendChild(newCell6);

            tbody.appendChild(newRow);

            total += (parseInt(y)*parseFloat(z));
            document.getElementById("Total").textContent = total.toFixed(2);
            document.getElementById("Total").style.textAlign = "right";
            calculateGST(total);
            calculateGtotal(total);

            document.getElementById("item").value = "";
            document.getElementById("quantity").value = "";
            document.getElementById("price").value = "";
        }
    }else{
        alert("None of the feilds can be empty");
    }
}

function deleteRow(row) {
    let price = parseFloat(row.getElementsByTagName("td")[3].textContent);
    row.parentNode.removeChild(row);

    total -= price;
    document.getElementById("Total").textContent = total.toFixed(2);
    calculateGST(total);
    calculateGtotal(total);

    let tbody = document.getElementsByTagName("tbody")[1];
    let rows = tbody.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        rows[i].getElementsByTagName("th")[0].textContent = i + 1;
    }

    count -= 1;
}

function editRow(row){
    document.getElementById("item").value = row.getElementsByTagName("td")[0].textContent;
    document.getElementById("quantity").value = row.getElementsByTagName("td")[1].textContent;
    document.getElementById("price").value = row.getElementsByTagName("td")[2].textContent;

    document.getElementById("add-btn").textContent = "Done";

    let cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    document.getElementById("btn-section").appendChild(cancelButton);
    cancelButton.style.marginLeft = "50px";
    cancelButton.id = "cancel-btn"
    cancelButton.onclick = function(){
        cancelEdit();
    }

    editingRow = row;
}

function cancelEdit(){
    document.getElementById("item").value="";
    document.getElementById("quantity").value="";
    document.getElementById("price").value="";
    document.getElementById("add-btn").textContent = "Add";

    let cancelButton = document.getElementById("cancel-btn");
    cancelButton.remove();

    editingRow = null;
}

function printBill(){
    let tbody = document.getElementsByTagName("tbody")[1];
    let rows = tbody.getElementsByTagName("tr");
    if(rows.length > 0){
        window.print();
    }else{
        alert("Generate the bill first");
    }
}

function applyGST(){
    const gstField = document.getElementById("gst");
    if(gstField.value !== ""){
        gstField.setAttribute("readonly", true);
        document.getElementById("cgst").textContent = (parseFloat(gstField.value)/2).toFixed(2)+"%";
        document.getElementById("sgst").textContent = (parseFloat(gstField.value)/2).toFixed(2)+"%";
        calculateGST(total);
        calculateGtotal(total);
        document.getElementById("apply-btn").textContent = "Reset";
        document.getElementById("apply-btn").onclick = function(){
            resetGST();
        }
    }else{
        alert("GST field cannot be empty");
    }
}

function resetGST(){
    document.getElementById("gst").value = 0;
    document.getElementById("cgst").textContent = "0.00%";
    document.getElementById("sgst").textContent = "0.00%";
    calculateGST(total);
    calculateGtotal(total);
    document.getElementById("apply-btn").textContent = "Apply";
    document.getElementById("gst").readOnly = false;
    document.getElementById("apply-btn").onclick = function(){
        applyGST();
    }
}

function calculateGST(total){
    const gstField = document.getElementById("gst");
    document.getElementById("cgst-price").textContent = (total * (parseFloat(gstField.value)/2)/100).toFixed(2);
    document.getElementById("sgst-price").textContent = (total * (parseFloat(gstField.value)/2)/100).toFixed(2);
}

function calculateGtotal(total){
    total += parseFloat(document.getElementById("cgst-price").textContent) + parseFloat(document.getElementById("cgst-price").textContent);
    document.getElementById("G-Total").textContent = Math.round(total).toFixed(2);
}