// Calculate Cost
function calculateCost(entryType, boards) {
    let costPerBoard = 1;

    switch (entryType) {
        case "System 7":
            costPerBoard = 7;
            break;
        case "System 8":
            costPerBoard = 28;
            break;
        case "System 9":
            costPerBoard = 84;
            break;
        case "System 10":
            costPerBoard = 210;
            break;
        case "System 11":
            costPerBoard = 462;
            break;
        case "System 12":
            costPerBoard = 924;
            break;
        default:
            break;
    }

    return costPerBoard * boards;
}

// Add 4D Entry to Table
document.getElementById('4d-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form from submitting

    const bigBet = parseInt(document.getElementById('4d-bet-big').value || 0);
    const smallBet = parseInt(document.getElementById('4d-bet-small').value || 0);
    const numberOfBoards = document.getElementById('4d-boards').value;
    const entryType4D = document.getElementById('4d-entry-type').value;
    const pickType4D = document.getElementById('4d-pick-type').value;
    const outlet4D = document.getElementById('4d-outlet').value;

    if (!bigBet && !smallBet) {
        alert('At least one of Big Bet or Small Bet must have a value.');
        return;
    }

    const tableBody = document.querySelector("#entries-table tbody");
    // Check if the no-entry-row exists and remove it
    const noEntryRow = tableBody.querySelector('.no-entry-row');
    if (noEntryRow) {
        noEntryRow.remove();
    }
    const newRow = `<tr>
        <td>4D</td>
        <td>${entryType4D}</td>
        <td>${pickType4D}</td>
        <td>$${bigBet}(Big), $${smallBet}(Small)</td>
        <td>${outlet4D}</td>
        <td>${numberOfBoards}</td>
        <td>$${parseInt(bigBet || 0) * numberOfBoards + parseInt(smallBet || 0) * numberOfBoards}</td>
        <td><button class="delete-btn"><i class="fas fa-trash"></i></button></td>
    </tr>`;
    tableBody.innerHTML += newRow;
    showSuccessEffect('4D');
});

// Add Toto Entry to Table
document.getElementById('toto-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const entryType = document.getElementById('toto-entry-type').value;
    const numberOfBoards = document.getElementById('toto-boards').value;
    const entryTypeToto = document.getElementById('toto-entry-type').value;
    const pickTypeToto = document.getElementById('toto-pick-type').value;
    const outletToto = document.getElementById('toto-outlet').value;
    const cost = calculateCost(entryType, numberOfBoards);

    const tableBody = document.querySelector("#entries-table tbody");
    const noEntryRow = tableBody.querySelector('.no-entry-row');
    if (noEntryRow) {
        noEntryRow.remove();
    }
    const newRow = `<tr>
        <td>Toto</td>
        <td>${entryTypeToto}</td>
        <td>${pickTypeToto}</td>
        <td style="text-align: center">-</td>
        <td>${outletToto}</td>
        <td>${numberOfBoards}</td>
        <td>$${cost}</td>
        <td><button class="delete-btn"><i class="fas fa-trash"></i></button></td>
    </tr>`;
    tableBody.innerHTML += newRow;
    showSuccessEffect('Toto');
});

document.querySelector("#entries-table tbody").addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-btn') || event.target.closest('.delete-btn')) {
        const shouldDelete = confirm('Are you sure you want to delete this entry?');
        if (shouldDelete) {
            event.target.closest('tr').remove();
        }
    }

    const tableBody = document.querySelector("#entries-table tbody");
    if (!tableBody.querySelector("tr:not(.no-entry-row)")) {
        const noEntryRow = `<tr class="no-entry-row"><td colspan="8">No entries added today!</td></tr>`;
        tableBody.innerHTML = noEntryRow;
    }
});

function showSuccessEffect(gameType) {
    const successElement = document.getElementById('success-message');
    const tickElement = successElement.querySelector('.tick-wrapper');
    const successTextElement = successElement.querySelector('.success-text');
    
    successElement.classList.remove('hidden');
    
    setTimeout(() => {
        tickElement.style.transform = 'scale(1)';
        successTextElement.style.opacity = '1';
        successTextElement.innerText = `${gameType} entry added!`
    }, 100);

    // Flash the background
    document.body.classList.add('effect-active');
    setTimeout(() => {
        document.body.classList.remove('effect-active');
    }, 500);

    // Hide the success message after a short duration
    setTimeout(() => {
        tickElement.style.transform = 'scale(0)';
        successTextElement.style.opacity = '0';
        setTimeout(() => {
            successElement.classList.add('hidden');
        }, 700);
    }, 1000);
}
