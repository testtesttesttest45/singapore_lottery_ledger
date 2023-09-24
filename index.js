document.addEventListener('DOMContentLoaded', () => {
    // Handle 4D form submission
    const form4D = document.getElementById('4d-form');
    form4D.addEventListener('submit', (e) => {
        e.preventDefault();
        const number = document.getElementById('4d-number').value;
        const type = document.getElementById('4d-type').value;
        const amount = document.getElementById('4d-amount').value;
        
        if (number.length !== 4 || isNaN(number)) {
            alert("Please enter a valid 4D number.");
            return;
        }
        
        addEntryToTable('4D', number, type, amount);
    });

    // Handle Toto form submission
    const formToto = document.getElementById('toto-form');
    formToto.addEventListener('submit', (e) => {
        e.preventDefault();
        const number = document.getElementById('toto-number').value;
        const type = document.getElementById('toto-type').value;
        const boards = document.getElementById('toto-boards').value;
        
        const numbers = number.split(',').map(num => num.trim());
        if (numbers.length !== 6 || numbers.some(num => isNaN(num))) {
            alert("Please enter 6 valid Toto numbers.");
            return;
        }
        
        addEntryToTable('Toto', numbers.join(', '), type, boards);
    });
});

// Utility function to add entries to the table
function addEntryToTable(type, numbers, entryType, amount) {
    const table = document.getElementById('entries-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow(table.rows.length);

    const typeCell = newRow.insertCell(0);
    const numberCell = newRow.insertCell(1);
    const amountCell = newRow.insertCell(2);

    typeCell.innerHTML = `${type} - ${entryType}`;
    numberCell.innerHTML = numbers;
    amountCell.innerHTML = `$${amount}`;
}
