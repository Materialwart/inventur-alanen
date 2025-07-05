let data = JSON.parse(localStorage.getItem('tablesData')) || {};
let currentTab = Object.keys(data)[0] || "Standard";

if (!data[currentTab]) data[currentTab] = [];

const tabsDiv = document.getElementById('tabs');
const tableBody = document.querySelector('#inventory tbody');
const form = document.getElementById('itemForm');
const searchInput = document.getElementById('search');
const filterCategory = document.getElementById('filterCategory');

function saveData() {
    localStorage.setItem('tablesData', JSON.stringify(data));
}

function renderTabs() {
    tabsDiv.innerHTML = '';
    Object.keys(data).forEach(tab => {
        const btn = document.createElement('button');
        btn.textContent = tab;
        btn.onclick = () => { currentTab = tab; renderTable(); };
        tabsDiv.appendChild(btn);
    });
}

function addTab() {
    const name = prompt("Tab-Name:");
    if (name && !data[name]) {
        data[name] = [];
        currentTab = name;
        saveData();
        renderTabs();
        renderTable();
    }
}

function renderTable() {
    const items = data[currentTab];
    tableBody.innerHTML = '';
    const categories = new Set();

    items.forEach((item, index) => {
        const row = document.createElement('tr');
        const imageHTML = item.bild ? `<img src="${item.bild}">` : '';
        row.innerHTML = `
            <td>${imageHTML}</td>
            <td contenteditable onblur="editItem(${index}, 'artikel', this.textContent)">${item.artikel}</td>
            <td contenteditable onblur="editItem(${index}, 'anzahl', this.textContent)">${item.anzahl}</td>
            <td contenteditable onblur="editItem(${index}, 'zustand', this.textContent)">${item.zustand}</td>
            <td contenteditable onblur="editItem(${index}, 'standort', this.textContent)">${item.standort}</td>
            <td contenteditable onblur="editItem(${index}, 'kategorie', this.textContent)">${item.kategorie}</td>
            <td contenteditable onblur="editItem(${index}, 'kommentar', this.textContent)">${item.kommentar}</td>
            <td>
                <button onclick="deleteItem(${index})">🗑️</button>
            </td>
        `;
        tableBody.appendChild(row);
        if (item.kategorie) categories.add(item.kategorie);
    });

    filterCategory.innerHTML = '<option value="">🔽 Kategorie filtern</option>';
    [...categories].forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        filterCategory.appendChild(opt);
    });
}

function deleteItem(index) {
    data[currentTab].splice(index, 1);
    saveData();
    renderTable();
}

function editItem(index, key, value) {
    data[currentTab][index][key] = value;
    saveData();
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const fileInput = document.getElementById('bild');
    const file = fileInput.files[0];

    reader.onload = function() {
        const bild = file ? reader.result : '';
        const item = {
            bild,
            artikel: form.artikel.value,
            anzahl: form.anzahl.value,
            zustand: form.zustand.value,
            standort: form.standort.value,
            kategorie: form.kategorie.value,
            kommentar: form.kommentar.value
        };
        data[currentTab].push(item);
        saveData();
        renderTable();
        form.reset();
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        reader.onload();
    }
});

searchInput.addEventListener('input', () => {
    const value = searchInput.value.toLowerCase();
    const filtered = data[currentTab].filter(item =>
        Object.values(item).some(val => (val || '').toString().toLowerCase().includes(value))
    );
    tableBody.innerHTML = '';
    filtered.forEach((item, index) => {
        const row = document.createElement('tr');
        const imageHTML = item.bild ? `<img src="${item.bild}">` : '';
        row.innerHTML = `
            <td>${imageHTML}</td>
            <td>${item.artikel}</td>
            <td>${item.anzahl}</td>
            <td>${item.zustand}</td>
            <td>${item.standort}</td>
            <td>${item.kategorie}</td>
            <td>${item.kommentar}</td>
            <td><button onclick="deleteItem(${index})">🗑️</button></td>
        `;
        tableBody.appendChild(row);
    });
});

filterCategory.addEventListener('change', () => {
    const selected = filterCategory.value;
    const filtered = selected
        ? data[currentTab].filter(item => item.kategorie === selected)
        : data[currentTab];
    tableBody.innerHTML = '';
    filtered.forEach((item, index) => {
        const row = document.createElement('tr');
        const imageHTML = item.bild ? `<img src="${item.bild}">` : '';
        row.innerHTML = `
            <td>${imageHTML}</td>
            <td>${item.artikel}</td>
            <td>${item.anzahl}</td>
            <td>${item.zustand}</td>
            <td>${item.standort}</td>
            <td>${item.kategorie}</td>
            <td>${item.kommentar}</td>
            <td><button onclick="deleteItem(${index})">🗑️</button></td>
        `;
        tableBody.appendChild(row);
    });
});

renderTabs();
renderTable();
