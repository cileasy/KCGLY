// 用于存储库存数据的数组，模拟数据库
let inventoryData = [];
const correctPassword = "123456"; // 预设密码，可修改为实际密码

function login() {
    const enteredPassword = document.getElementById('password').value;
    if (enteredPassword === correctPassword) {
        document.getElementById('loginSection').style.display = "none";
        document.getElementById('addProductSection').style.display = "block";
        document.getElementById('inventoryTable').style.display = "block";
        loadDataFromFile();
    } else {
        alert("密码错误，请重新输入");
    }
}

function addProduct() {
    const productId = document.getElementById('productId').value;
    const productName = document.getElementById('productName').value;
    const productQuantity = parseInt(document.getElementById('productQuantity').value);
    const productSpecification = document.getElementById('productSpecification').value;
    if (productId && productName &&!isNaN(productQuantity)) {
        const newProduct = {
            id: productId,
            name: productName,
            quantity: productQuantity,
            specification: productSpecification
        };
        inventoryData.push(newProduct);
        saveDataToFile(() => {
            updateTable();
            // 清空输入框
            document.getElementById('productId').value = "";
            document.getElementById('productName').value = "";
            document.getElementById('productQuantity').value = "";
            document.getElementById('productSpecification').value = "";
        });
    } else {
        alert("请正确填写商品信息");
    }
}

function editQuantity(operation, button) {
    const row = button.parentNode.parentNode;
    const productId = row.cells[0].innerHTML;
    const currentQuantity = parseInt(row.cells[2].innerHTML);
    let newQuantity;
    const changeValue = parseInt(prompt(`请输入要${operation === 'plus'? '加' : '减'}的数量`, '1'));
    if (!isNaN(changeValue)) {
        if (operation === 'plus') {
            newQuantity = currentQuantity + changeValue;
        } else if (operation ==='minus') {
            newQuantity = Math.max(0, currentQuantity - changeValue);
        }
        const index = inventoryData.findIndex(item => item.id === productId);
        inventoryData[index].quantity = newQuantity;
        saveDataToFile(() => {
            updateTable();
        });
    } else {
        alert("请输入有效的数字");
    }
}

function editProduct(button) {
    const row = button.parentNode.parentNode;
    const productId = row.cells[0].innerHTML;
    const index = inventoryData.findIndex(item => item.id === productId);
    const oldName = inventoryData[index].name;
    const oldQuantity = inventoryData[index].quantity;
    const oldSpecification = inventoryData[index].specification;
    const newId = prompt("请输入新的商品编号", productId);
    const newName = prompt("请输入新的商品名称", oldName);
    const newQuantity = parseInt(prompt("请输入新的库存数量", oldQuantity));
    const newSpecification = prompt("请输入新的规格", oldSpecification);
    if (newId && newName &&!isNaN(newQuantity)) {
        inventoryData[index].id = newId;
        inventoryData[index].name = newName;
        inventoryData[index].quantity = newQuantity;
        inventoryData[index].specification = newSpecification;
        saveDataToFile(() => {
            updateTable();
        });
    } else {
        alert("请正确填写商品信息");
    }
}

function updateTable() {
    const tableBody = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = "";
    inventoryData.sort((a, b) => a.name.localeCompare(b.name));
    inventoryData.forEach(item => {
        console.log(typeof item.quantity);
        const row = document.createElement('tr');
        let quantityCellStyle = "";
        if (item.quantity < 0) {
            quantityCellStyle = "negative-quantity";
        }
        row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td class="${quantityCellStyle}">${item.quantity}</td>
                    <td>${item.specification}</td>
                    <td>
                        <button onclick="editQuantity('minus', this)">减</button>
                        <button onclick="editQuantity('plus', this)">加</button>
                        <button onclick="editProduct(this)">修改商品信息</button>
                        <button onclick="deleteProduct(this)">删除商品</button>
                    </td>
                `;
        tableBody.appendChild(row);
    });
}

function saveDataToFile(callback) {
    const jsonData = JSON.stringify(inventoryData);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'save.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (this.status === 200) {
            console.log('数据保存成功');
            if (callback) {
                callback();
            }
        } else {
            console.error('数据保存失败');
        }
    };
    xhr.onerror = function () {
        console.log('读取文件时发生错误:', this.statusText);
        inventoryData = [];
        updateTable();
    };
    xhr.send(jsonData);
}

function loadDataFromFile() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'inventoryData.json', true);
    xhr.onload = function () {
        if (this.status === 200) {
            try {
                inventoryData = JSON.parse(this.responseText);
            } catch (error) {
                console.error('解析数据文件出错：', error);
                inventoryData = [];
            } finally {
                updateTable();
            }
        } else {
            console.log('文件不存在或读取失败');
            inventoryData = [];
            updateTable();
        }
    };
    xhr.onerror = function () {
        console.log('读取文件时发生错误:', this.statusText);
        inventoryData = [];
        updateTable();
    }
    xhr.send();
}

function sortProductsByName() {
    inventoryData.sort((a, b) => a.name.localeCompare(b.name));
    updateTable();
}

function sortProductsByQuantity() {
    inventoryData.sort((a, b) => a.quantity - b.quantity);
    updateTable();
}

function deleteProduct(button) {
    const row = button.parentNode.parentNode;
    const productId = row.cells[0].innerHTML;
    const index = inventoryData.findIndex(item => item.id === productId);
    inventoryData.splice(index, 1);
    saveDataToFile(() => {
        updateTable();
    });
}
