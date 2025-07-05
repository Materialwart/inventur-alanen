const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
const tableBody = document.querySelector('#inventory tbody');
const form = document.getElementById('itemForm');
const searchInput = document.getElementById('search');

function renderTable(items) {
    tableBody.innerHTML = '';
    items.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.artikel}</td>
            <td>${item.anzahl}</td>
            <td>${item.zustand}</td>
            <td>${item.standort}</td>
            <td>${item.kommentar}</td>
            <td><button onclick="deleteItem(${index})">🗑️</button></td>
        `;
        tableBody.appendChild(row);
    });
}

function deleteItem(index) {
    inventory.splice(index, 1);
    localStorage.setItem('inventory', JSON.stringify(inventory));
    renderTable(inventory);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const item = {
        artikel: form.artikel.value,
        anzahl: form.anzahl.value,
        zustand: form.zustand.value,
        standort: form.standort.value,
        kommentar: form.kommentar.value
    };
    inventory.push(item);
    localStorage.setItem('inventory', JSON.stringify(inventory));
    renderTable(inventory);
    form.reset();
});

searchInput.addEventListener('input', () => {
    const filtered = inventory.filter(item =>
        Object.values(item).some(val => val.toLowerCase().includes(searchInput.value.toLowerCase()))
    );
    renderTable(filtered);
});

renderTable(inventory);
