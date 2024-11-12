let InitVals = []
let cat_map_num = {
    "none": 0,
    "Tablet": 1,
    "Capsule": 2,
    "Injection": 3,
    "Tube": 4,
    "Gel": 5,
    "Powder": 6,
    "Syrup": 7,
    "Cream": 8,
    "Drops": 9,
    "Ointment": 10,
    "Lotion": 11,
    "Nano": 12,
    "Shot": 13,
    "Respules": 14,
    "Spray": 15,
    "Inhaler": 16,
    "Others": 17
}
let cat_map_str = {
    0: "none",
    1: "Tablet",
    2: "Capsule",
    3: "Injection",
    4: "Tube",
    5: "Gel",
    6: "Powder",
    7: "Syrup",
    8: "Cream",
    9: "Drops",
    10: "Ointment",
    11: "Lotion",
    12: "Nano",
    13: "Shot",
    14: "Respules",
    15: "Spray",
    16: "Inhaler",
    17: "Others"
}

// Function to fetch all products and return the JSON data
async function __fetchAllProducts() {
    try {
        const response = await fetch('https://prods-exp-server.onrender.com/allProds');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch all products: ${response.statusText}`);
        }
        
        // Return the parsed JSON data
        return await response.json();
        
    } catch (error) {
        console.error('Error fetching all products:', error);
        return null;  // Return null in case of error
    }
}

// Function to fetch expiring products and return the JSON data
async function __fetchExpiringProducts() {
    try {
        const response = await fetch('https://prods-exp-server.onrender.com/expiring');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch expiring products: ${response.statusText}`);
        }
        
        // Return the parsed JSON data
        return await response.json();
        
    } catch (error) {
        console.error('Error fetching expiring products:', error);
        return null;  // Return null in case of error
    }
}

// Function to fetch expired products and return the JSON data
async function __fetchExpiredProducts() {
    try {
        const response = await fetch('https://prods-exp-server.onrender.com/expired');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch expired products: ${response.statusText}`);
        }
        
        // Return the parsed JSON data
        return await response.json();
        
    } catch (error) {
        console.error('Error fetching expired products:', error);
        return null;  // Return null in case of error
    }
}

async function __deleteTuple(category, product_n, batch_no, qty, price, manufacturer_n, bill_no, exp_date) {
    const baseUrl = 'https://prods-exp-server.onrender.com/delete';
    const params = new URLSearchParams({
        category: category,
        product_name: product_n,
        batch_number: batch_no,
        qty: qty,
        price: price,
        manufacturer_name: manufacturer_n,
        bill_number: bill_no,
        expiry_date: exp_date
    }).toString();
    const fullUrl = `${baseUrl}?${params}`;
    try {
        const response = await fetch(fullUrl, {
            method: 'DELETE'  // Specify the DELETE method
        });
        
        if (!response.ok) {
            throw new Error(`Failed to delete product: ${response.statusText}`);
        }

        // Optionally handle the response data here if needed
        const data = await response.text(); // If the server sends a message
        console.log('Delete successful:', data);

    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

async function __addTuple(productDetails) {
    // Destructure the array into individual variables
    const [cat, product_n, batch_no, qty, price, manufacturer_n, bill_no, exp_date] = productDetails;

    const baseUrl = 'https://prods-exp-server.onrender.com/addproduct';
    const bodyData = {
        category: cat,
        product_name: product_n,
        batch_number: batch_no,
        qty: qty,
        price: price,
        manufacturer_name: manufacturer_n,
        bill_number: bill_no,
        expiry_date: exp_date
    };

    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        });
        
        if (!response.ok) {
            throw new Error(`Failed to add product: ${response.statusText}`);
        }
        const data = await response.text(); 
        console.log('Product added successfully:', data);
    } catch (error) {
        console.error('Error adding product:', error);
        throw error; // Propagate the error up to handle in addRow
    }
}


function formattedSearch(str) {
    str = str.trim();
    if(!str) return 'whderjn';
    return str;
}
async function __fetch_searched_products(string) {
    try {
        string = formattedSearch(string)
        const response = await fetch(`https://prods-exp-server.onrender.com/searchStringPref/${encodeURIComponent(string)}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch expiring products: ${response.statusText}`);
        }
        
        // Return the parsed JSON data
        return await response.json();
        
    } catch (error) {
        console.error('Error fetching products:', error);
        return null;  // Return null in case of error
    }
}
async function __fetch_hard_searched_products(string) {
    try {
        string = formattedSearch(string)
        const response = await fetch(`https://prods-exp-server.onrender.com/searchStringHard/${encodeURIComponent(string)}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch expiring products: ${response.statusText}`);
        }
        
        // Return the parsed JSON data
        return await response.json();
        
    } catch (error) {
        console.error('Error fetching products:', error);
        return null;  // Return null in case of error
    }
}

function deleteAllChildren(parentDiv) {
    const children = parentDiv.children; // Get all children of the parent div
    const numberOfChildren = children.length;

    // Loop through the children starting from the last child
    for (let i = numberOfChildren - 1; i >= 0; i--) {
        parentDiv.removeChild(children[i]); // Remove child element
    }
}
function convertDateFormat(dateString) {
    // Create a new Date object from the input string
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
    }

    // Get the year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    // Return the formatted date string
    return `${year}-${month}-${day}`;
}
function normalizeSpaces(str) {
    // Trim leading/trailing spaces and replace multiple spaces with a single space
    return str.trim().replace(/\s+/g, ' ');
}



async function addbts(cell) {
    cell.id = "u-d";
    let update = document.createElement("button");
    update.classList.add("u-d-button");
    update.innerText = "U";
    update.style.backgroundColor = "Green";
    update.addEventListener("click", function() {
        showUpdateTemplate();
        fillGlobalArrayWithInitVals(cell)
    })
    let del = document.createElement("button");
    del.classList.add("u-d-button");
    del.innerText = "D";
    del.style.backgroundColor = "rgb(209, 0, 0)";
    del.addEventListener("click", function() {
        delete_row(cell);
    })
    cell.appendChild(update)
    cell.appendChild(del)
}

async function addAll() {
    const products = await __fetchAllProducts();
    const home_sec = document.getElementById('home-content-table');
    deleteAllChildren(home_sec);
    document.getElementById('home-num').textContent = `All Items (${products.length})`;
    for (let i = 0; i < products.length; i++) {
        const productArray = Object.values(products[i]);
        let newRow = home_sec.insertRow();
        let cell = newRow.insertCell(0);
        await addbts(cell)
        for(let i = 1; i < 8; i++) {
            let cell = newRow.insertCell(i);
            if(i == 4 || i == 5 || i == 6) cell.innerHTML = `${(productArray[i - 1] === null) ? '----' : productArray[i - 1]}`;
            else if(i == 1) cell.innerHTML = `${cat_map_str[productArray[i - 1]]}`;
            else cell.innerHTML = `${productArray[i - 1]}`;
        }
        const date = new Date(productArray[7]);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        productArray[7] = date.toLocaleDateString('en-US', options);
        cell = newRow.insertCell(8);
        cell.innerHTML = `${productArray[7]}`;
    }
}

async function addExpiring() {
    const products = await __fetchExpiringProducts();
    const expiring_sec = document.getElementById('expiring-content-table');
    deleteAllChildren(expiring_sec);
    document.getElementById('expiring-num').textContent = `Expiring Items (${products.length})`;
    for (let i = 0; i < products.length; i++) {
        const productArray = Object.values(products[i]);
        let newRow = expiring_sec.insertRow();
        let cell = newRow.insertCell(0);
        await addbts(cell)
        for(let i = 1; i < 8; i++) {
            let cell = newRow.insertCell(i);
            if(i == 4 || i == 5 || i == 6) cell.innerHTML = `${(productArray[i - 1] === null) ? '----' : productArray[i - 1]}`;
            else if(i == 1) cell.innerHTML = `${cat_map_str[productArray[i - 1]]}`;
            else cell.innerHTML = `${productArray[i - 1]}`;
        }
        const date = new Date(productArray[7]);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        productArray[7] = date.toLocaleDateString('en-US', options);
        cell = newRow.insertCell(8);
        cell.innerHTML = `${productArray[7]}`;
    }
}


async function addExpired() {
    const products = await __fetchExpiredProducts();
    const expired_sec = document.getElementById('expired-content-table');
    deleteAllChildren(expired_sec);
    document.getElementById('expired-num').textContent = `Expired Items (${products.length})`;
    for (let i = 0; i < products.length; i++) {
        const productArray = Object.values(products[i]);
        let newRow = expired_sec.insertRow();
        let cell = newRow.insertCell(0);
        await addbts(cell)
        for(let i = 1; i < 8; i++) {
            let cell = newRow.insertCell(i);
            if(i == 4 || i == 5 || i == 6) cell.innerHTML = `${(productArray[i - 1] === null) ? '----' : productArray[i - 1]}`;
            else if(i == 1) cell.innerHTML = `${cat_map_str[productArray[i - 1]]}`;
            else cell.innerHTML = `${productArray[i - 1]}`;
        }
        const date = new Date(productArray[7]);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        productArray[7] = date.toLocaleDateString('en-US', options);
        cell = newRow.insertCell(8);
        cell.innerHTML = `${productArray[7]}`;
    }
}

async function searchString(event) {
    const string = event.target.value;
    const products = await __fetch_searched_products(string);
    const search_sec = document.getElementById('search-content-table');
    deleteAllChildren(search_sec);
    for (let i = 0; i < products.length; i++) {
        const productArray = Object.values(products[i]);
        let newRow = search_sec.insertRow();
        let cell = newRow.insertCell(0);
        await addbts(cell)
        for(let i = 1; i < 8; i++) {
            let cell = newRow.insertCell(i);
            if(i == 4 || i == 5 || i == 6) cell.innerHTML = `${(productArray[i - 1] === null) ? '----' : productArray[i - 1]}`;
            else if(i == 1) cell.innerHTML = `${cat_map_str[productArray[i - 1]]}`;
            else cell.innerHTML = `${productArray[i - 1]}`;
        }
        const date = new Date(productArray[7]);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        productArray[7] = date.toLocaleDateString('en-US', options);
        cell = newRow.insertCell(8);
        cell.innerHTML = `${productArray[7]}`;
    }
}

async function updateSearch() {
    const string = document.getElementById('search-input').value;
    const products = await __fetch_searched_products(string);
    const search_sec = document.getElementById('search-content-table');
    deleteAllChildren(search_sec);
    for (let i = 0; i < products.length; i++) {
        const productArray = Object.values(products[i]);
        let newRow = search_sec.insertRow();
        let cell = newRow.insertCell(0);
        await addbts(cell)
        for(let i = 1; i < 8; i++) {
            let cell = newRow.insertCell(i);
            if(i == 4 || i == 5 || i == 6) cell.innerHTML = `${(productArray[i - 1] === null) ? '----' : productArray[i - 1]}`;
            else if(i == 1) cell.innerHTML = `${cat_map_str[productArray[i - 1]]}`;
            else cell.innerHTML = `${productArray[i - 1]}`;
        }
        const date = new Date(productArray[7]);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        productArray[7] = date.toLocaleDateString('en-US', options);
        cell = newRow.insertCell(8);
        cell.innerHTML = `${productArray[7]}`;
    }
}

async function delete_row(button) {
    const row = button.parentNode.children;
    await __deleteTuple(cat_map_num[row[1].textContent], row[2].textContent, row[3].textContent, row[4].textContent === '----' ? null : row[4].textContent, row[5].textContent === '----' ? null : row[5].textContent, row[6].textContent === '----' ? null : row[6].textContent, row[7].textContent, convertDateFormat(row[8].textContent));
    await addAll();
    await addExpired();
    await addExpiring();
    await updateSearch();
}


async function reset(string) {
    if(string === 'all') await addAll();
    else if(string === 'expiring') await addExpiring();
    else await addExpired();
}


function isValidDateFormat(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
}


async function addRow() {
    const vals = [
        cat_map_num[document.getElementById('create-cat').value],
        normalizeSpaces(document.getElementById('inp-1').value),
        normalizeSpaces(document.getElementById('inp-2').value),
        normalizeSpaces(document.getElementById('inp-3').value) || null,
        (normalizeSpaces(document.getElementById('inp-4').value) && normalizeSpaces(document.getElementById('inp-4').value) != 0) || null,
        normalizeSpaces(document.getElementById('inp-5').value) || null,
        normalizeSpaces(document.getElementById('inp-6').value),
        normalizeSpaces(document.getElementById('inp-7').value)
    ];
    
    if(vals[0] == 0) {
        return;
    }
    if(!isValidDateFormat(vals[7])) {
        console.log('invalid date format error')
        return;
    }
    
    const product = await __fetch_hard_searched_products(vals[1]);
    
    if(product.length > 0) {
        
        console.log('product name should be unique')
        return;
    }
    try {
        await __addTuple(vals);
    } catch (error) {
        console.error("Error in adding row:", error);
        return;
    }
    document.getElementById('create-cat').value = 'none';
    document.getElementById('inp-1').value =
    document.getElementById('inp-2').value =
    document.getElementById('inp-3').value =
    document.getElementById('inp-4').value =
    document.getElementById('inp-5').value =
    document.getElementById('inp-6').value =
    document.getElementById('inp-7').value = '';
    await addAll();
    await addExpired();
    await addExpiring();
    await updateSearch();
}



async function fillGlobalArrayWithInitVals(button) {
    const row = button.parentNode.children;
    InitVals = [row[1].textContent, row[2].textContent, row[3].textContent,
    row[4].textContent, row[5].textContent, row[6].textContent, row[7].textContent, convertDateFormat(row[8].textContent)];
    document.getElementById('update-cat').value = `${InitVals[0]}`;
    document.getElementById('inp-8').value = `${InitVals[1]}`;
    document.getElementById('inp-9').value = `${InitVals[2]}`;
    document.getElementById('inp-10').value = `${InitVals[3] === '----' ? '' : InitVals[3]}`;
    document.getElementById('inp-11').value = `${InitVals[4] === '----' ? '' : InitVals[4]}`;
    document.getElementById('inp-12').value = `${InitVals[5] === '----' ? '' : InitVals[5]}`;
    document.getElementById('inp-13').value = `${InitVals[6]}`;
    document.getElementById('inp-14').value = `${InitVals[7]}`;
}

async function emptyUpdateInputs() {
    InitVals.length = 0;
    document.getElementById('update-cat').value = 'none';
    document.getElementById('inp-8').value =
    document.getElementById('inp-9').value =
    document.getElementById('inp-10').value =
    document.getElementById('inp-11').value =
    document.getElementById('inp-12').value =
    document.getElementById('inp-13').value =
    document.getElementById('inp-14').value = '';
}


async function updateRow() {
    const vals = [
        cat_map_num[document.getElementById('update-cat').value],
        normalizeSpaces(document.getElementById('inp-8').value),
        normalizeSpaces(document.getElementById('inp-9').value),
        normalizeSpaces(document.getElementById('inp-10').value) || null,
        (normalizeSpaces(document.getElementById('inp-11').value) && normalizeSpaces(document.getElementById('inp-11').value) != 0) || null,
        normalizeSpaces(document.getElementById('inp-12').value) || null,
        normalizeSpaces(document.getElementById('inp-13').value),
        normalizeSpaces(document.getElementById('inp-14').value)
    ];
    if(vals[0] == 0) {
        return;
    }
    if(!isValidDateFormat(vals[7])) {
        console.log('invalid date format error')
        return;
    }


    await __deleteTuple(cat_map_num[InitVals[0]], InitVals[1], InitVals[2], InitVals[3] === '----' ? null : InitVals[3],
    InitVals[4] === '----' ? null : InitVals[4], InitVals[5] === '----' ? null : InitVals[5], InitVals[6], convertDateFormat(InitVals[7]));
    try {
        await __addTuple(vals);
    } catch (error) {
        console.error("Error in adding row:", error);
        return;
    }
    let update = document.getElementById("show");
    let main = document.getElementById("main-wrapper");
    main.classList.remove("wrapper-blur");
    update.id = "no-show";
    await emptyUpdateInputs();
    await addAll();
    await addExpired();
    await addExpiring();
    await updateSearch();
    
}








document.getElementById('search-input').addEventListener('input', searchString)
document.addEventListener('DOMContentLoaded', async () => {
    await addAll();
    await addExpiring(); // Ensure this runs after the DOM is loaded
    await addExpired(); // Ensure this runs after the DOM is loaded
});