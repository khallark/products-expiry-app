let InitVals = []

// Function to fetch expiring products and return the JSON data
async function __fetchExpiringProducts() {
    try {
        const response = await fetch('https://products-expiry-app-24bbeea498a1.herokuapp.com/expiring');
        
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
        const response = await fetch('https://products-expiry-app-24bbeea498a1.herokuapp.com/expired');
        
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

async function __deleteTuple(product_n, batch_no, manufacturer_n, bill_no, exp_date) {
    const baseUrl = 'https://products-expiry-app-24bbeea498a1.herokuapp.com/delete';
    const params = new URLSearchParams({
        product_name: product_n,
        batch_number: batch_no,
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
    const [product_n, batch_no, manufacturer_n, bill_no, exp_date] = productDetails;

    const baseUrl = 'https://products-expiry-app-24bbeea498a1.herokuapp.com/addproduct';
    const bodyData = {
        product_name: product_n,
        batch_number: batch_no,
        manufacturer_name: manufacturer_n,
        bill_number: bill_no,
        expiry_date: exp_date
    };

    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)  // Send the data as JSON
        });
        
        if (!response.ok) {
            throw new Error(`Failed to add product: ${response.statusText}`);
        }

        // Optionally handle the response data here if needed
        const data = await response.text(); // If the server sends a message
        console.log('Product added successfully:', data);

    } catch (error) {
        console.error('Error adding product:', error);
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
        const response = await fetch(`https://products-expiry-app-24bbeea498a1.herokuapp.com/searchStringPref/${string}`);
        
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
        const response = await fetch(`https://products-expiry-app-24bbeea498a1.herokuapp.com/searchStringHard/${string}`);
        
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







function createRow(productArr, mode) {
    const div = document.createElement('div');
    if(mode === 'expire') div.className = 'expire-slot';
    else div.className = 'search-slot';
    
    const date = new Date(productArr[4]);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    productArr[4] = date.toLocaleDateString('en-US', options);

    div.innerHTML = `
        <table id="-table">
            <tr style="font-weight: bold;">
                <td>${productArr[0]}</td>
                <td>${productArr[1]}</td>
                <td>${productArr[2]}</td>
                <td>${productArr[3]}</td>
                <td>${productArr[4]}</td>
            </tr>
        </table>
        <button class="bin" onclick="delete_row(this)"><img id="search-img" src="bin.png" alt="delete"></button>
        <button class="update" onclick="showUpdateTemplate(); fillGlobalArrayWithInitVals(this);"><img id="expire-img" src="update.png"
        alt="update"></button>
    `;
    return div;  
}
function deleteChildrenExceptFirst(parentDiv) {
    const children = parentDiv.children; // Get all children of the parent div
    const numberOfChildren = children.length;

    // Loop through the children starting from the last child
    for (let i = numberOfChildren - 1; i > 0; i--) {
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






async function addExpiring() {
    const products = await __fetchExpiringProducts();
    console.log(products.length);
    const expiring_sec = document.getElementById('expiring-content');
    deleteChildrenExceptFirst(expiring_sec);
    document.getElementById('expiring-num').textContent = `Items (${products.length})`;
    for (let i = 0; i < products.length; i++) {
        const productArray = Object.values(products[i]);
        const row = createRow(productArray, 'expire');  // Create the row directly
        expiring_sec.appendChild(row);  // Append the row to the container
    }
}


async function addExpired() {
    const products = await __fetchExpiredProducts();
    const expired_sec = document.getElementById('expired-content');
    deleteChildrenExceptFirst(expired_sec);
    document.getElementById('expired-num').textContent = `Items (${products.length})`;
    for (let i = 0; i < products.length; i++) {
        const productArray = Object.values(products[i]);
        const row = createRow(productArray, 'expire');  // Create the row directly
        expired_sec.appendChild(row);  // Append the row to the container
    }
}


async function delete_row(button) {
    const row = button.parentNode.children[0].children[0].children[0];
    await __deleteTuple(row.children[0].textContent, row.children[1].textContent, row.children[2].textContent,
    row.children[3].textContent, convertDateFormat(row.children[4].textContent));
    await addExpired();
    await addExpiring();
    await updateSearch();
}


async function reset(string) {
    if(string === 'expiring') await addExpiring();
    else await addExpired();
}


function isValidDateFormat(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
}


async function addRow() {
    const vals = [
        normalizeSpaces(document.getElementById('inp-1').value),
        normalizeSpaces(document.getElementById('inp-2').value),
        normalizeSpaces(document.getElementById('inp-3').value),
        normalizeSpaces(document.getElementById('inp-4').value),
        normalizeSpaces(document.getElementById('inp-5').value)
    ];
    for(let i = 0; i < vals.length; i++) {
        if(!vals[i]) {
            console.log('string empty error')
            return;
        }
    }
    if(!isValidDateFormat(vals[4])) {
        console.log('invalid date format error')
        return;
    }
    const product = await __fetch_hard_searched_products(vals[1]);
    if(product.length > 0) {
        console.log('batch_no error')
        return;
    }
    __addTuple(vals);
    document.getElementById('inp-1').value =
    document.getElementById('inp-2').value =
    document.getElementById('inp-3').value =
    document.getElementById('inp-4').value =
    document.getElementById('inp-5').value = '';
    await addExpired();
    await addExpiring();
    await updateSearch();
}



async function fillGlobalArrayWithInitVals(button) {
    const row = button.parentNode.children[0].children[0].children[0];
    InitVals = [row.children[0].textContent, row.children[1].textContent, row.children[2].textContent,
    row.children[3].textContent, convertDateFormat(row.children[4].textContent)];
    document.getElementById('inp-6').value = `${InitVals[0]}`;
    document.getElementById('inp-7').value = `${InitVals[1]}`;
    document.getElementById('inp-8').value = `${InitVals[2]}`;
    document.getElementById('inp-9').value = `${InitVals[3]}`;
    document.getElementById('inp-10').value = `${InitVals[4]}`;
}
async function emptyUpdateInputs() {
    InitVals.length = 0;
    document.getElementById('inp-6').value =
    document.getElementById('inp-7').value =
    document.getElementById('inp-8').value =
    document.getElementById('inp-9').value =
    document.getElementById('inp-10').value = '';
}


async function updateRow() {
    const vals = [
        normalizeSpaces(document.getElementById('inp-6').value),
        normalizeSpaces(document.getElementById('inp-7').value),
        normalizeSpaces(document.getElementById('inp-8').value),
        normalizeSpaces(document.getElementById('inp-9').value),
        normalizeSpaces(document.getElementById('inp-10').value)
    ];
    for(let i = 0; i < vals.length; i++) {
        if(!vals[i]) {
            console.log('string empty error');
            return;
        }
    }
    if(!isValidDateFormat(vals[4])) {
        console.log('invalid date format error');
        return;
    }

    const products = await __fetch_hard_searched_products(vals[1])
    if(vals[1] != InitVals[1] && products.length > 0) {
        console.log('batch_no error');
        return;
    }
    await __deleteTuple(InitVals[0], InitVals[1], InitVals[2], InitVals[3], InitVals[4]);
    await __addTuple(vals);
    await emptyUpdateInputs();
    await addExpired();
    await addExpiring();
    await updateSearch();
    let update = document.getElementById("-update-wrapper");
    let main = document.getElementById("main-wrapper");
    main.classList.remove("wrapper-blur");
    update.classList.remove("update-wrapper");
}


async function searchString(event) {
    const string = event.target.value;
    const products = await __fetch_searched_products(string);
    const search_sec = document.getElementById('search-content');
    deleteChildrenExceptFirst(search_sec);
    for (let i = 0; i < products.length; i++) {
        const productArray = Object.values(products[i]);
        const row = createRow(productArray, 'search');  // Create the row directly
        search_sec.appendChild(row);  // Append the row to the container
    }
}


async function updateSearch() {
    const string = document.getElementById('search-input').value;
    const products = await __fetch_searched_products(string);
    const search_sec = document.getElementById('search-content');
    deleteChildrenExceptFirst(search_sec);
    for (let i = 0; i < products.length; i++) {
        const productArray = Object.values(products[i]);
        const row = createRow(productArray, 'search');  // Create the row directly
        search_sec.appendChild(row);  // Append the row to the container
    }
}





document.getElementById('search-input').addEventListener('input', searchString)
document.addEventListener('DOMContentLoaded', async () => {
    await addExpiring(); // Ensure this runs after the DOM is loaded
    await addExpired(); // Ensure this runs after the DOM is loaded
});