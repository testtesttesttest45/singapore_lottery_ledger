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

let currentOrder = [];

document.addEventListener('DOMContentLoaded', function () {
    fetch('/current-user')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Populate user's full name on the page
            const userNameElement = document.getElementById('user-name');
            userNameElement.textContent = data.fullName;
            // Set the section order based on user data
            setOrder(data.sectionsOrder);
            currentOrder.push(data.sectionsOrder);
            // console.log(currentOrder);
        })
        .catch(error => {
            console.error('Error fetching current user:', error);
        });
});

document.getElementById('logout-btn').addEventListener('click', function () {
    fetch('/logout', {
        method: 'POST',
    })
        .then(response => {
            if (response.status === 200) {
                // Redirect the user to the login page after successful logout
                window.location.href = '/login';
            } else {
                return response.json();
            }
        })
        .then(data => {
            if (data && data.message) {
                alert(data.message); // You can notify the user about the error in any other way you prefer
            }
        })
        .catch(error => {
            console.error('Error during logout:', error);
        });
});

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
        updateButtonAppearance(true, '#section-today-entry');
    }
    const nextRowNumber = tableBody.querySelectorAll('tr').length + 1;
    const newRow = `<tr>
        <td>${nextRowNumber}</td>
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
    updateTotals();
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
        updateButtonAppearance(true, '#section-today-entry');
    }
    const nextRowNumber = tableBody.querySelectorAll('tr').length + 1;
    const newRow = `<tr>
        <td>${nextRowNumber}</td>
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
    updateTotals();
});

function updateRowNumbers(tableSelector) {
    const rows = document.querySelectorAll(`${tableSelector} tbody tr:not(.no-entry-row)`);
    rows.forEach((row, index) => {
        row.cells[0].innerText = index + 1;  // Update the first cell with the row number
    });
}

function updateButtonAppearance(hasEntries, sectionSelector) {
    if (hasEntries) {
        saveButton.classList.add('neon-button');
        neonReflection.style.display = 'block';
        // sectionSelecctor will be something like "#section-today-entry", so when used it we will change its background color to #95e495
        document.querySelector(sectionSelector).style.backgroundColor = "#95e495";
    } else {
        saveButton.classList.remove('neon-button');
        neonReflection.style.display = 'none';
        document.querySelector(sectionSelector).style.backgroundColor = "";
    }
}


const saveButton = document.getElementById('save-entries-btn');
const neonReflection = document.querySelector('.neon-reflection');

document.getElementById('save-entries-btn').addEventListener('click', function () {
    const table = document.getElementById('entries-table');
    const rows = table.querySelectorAll('tbody tr');
    const entries = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 7) {
            const entry = {
                lottery_name: cells[1].innerText,
                entry_type: cells[2].innerText,
                pick_type: cells[3].innerText,
                bet_amount: cells[4].innerText,
                outlet: cells[5].innerText,
                number_of_boards: parseInt(cells[6].innerText),
                cost: parseFloat(cells[7].innerText.replace("$", "")),
            };
            entries.push(entry);
        } else {
            console.warn('Row with insufficient cells detected and ignored.');
        }
    });

    if (entries.length) { // means not empty
        saveEntries(entries);
    } else {
        alert('No valid entries to save.');
    }
});

function saveEntries(entries) {
    fetch('/save-entries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entries }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Entries saved successfully!');
                const tableBody = document.querySelector('#entries-table tbody');
                while (tableBody.firstChild) {
                    tableBody.removeChild(tableBody.firstChild);
                }
                checkForNoEntries("#entries-table", 'entry', 'entries added');
                updateTotals();
                fetchPurchaseHistory();
                updateButtonAppearance(false, '#section-today-entry');
            } else {
                alert('Error saving entries: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was a problem saving the entries.');
        });
}

function checkForNoEntries(tableSelector, type, text) {
    const tableBody = document.querySelector(tableSelector + " tbody");
    if (!tableBody.querySelector("tr:not(.no-entry-row)")) {
        const noEntryRow = `<tr class="no-entry-row"><td colspan="9">No ${text}.</td></tr>`;
        tableBody.innerHTML = noEntryRow;
    }
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}
const date = new Date();

document.getElementById('winnings-form-4d').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form from submitting

    const winningEntryType4D = document.getElementById('winnings-entry-type-4d').value;
    const winningPickType4D = document.getElementById('winnings-pick-type-4d').value;
    const winningOutlet4D = document.getElementById('winnings-outlet-4d').value;
    const winningPrize4D = document.getElementById('winnings-prize-4d').value;
    const winningDate4D = document.getElementById('winnings-date-4d').value;
    const tableBody = document.querySelector("#prizes-history-table tbody");
    // Check if the no-entry-row exists and remove it
    const noEntryRow = tableBody.querySelector('.no-entry-row');
    if (noEntryRow) {
        noEntryRow.remove();
    }
    const nextRowNumber = tableBody.querySelectorAll('tr').length + 1;
    const newRow = `<tr>
        <td>${nextRowNumber}</td>
        <td>4D</td>
        <td>${winningEntryType4D}</td>
        <td>${winningPickType4D}</td>
        <td>${winningOutlet4D}</td>
        <td>$${winningPrize4D}</td>
        <td>${winningDate4D}</td>
        <td><button class="delete-btn"><i class="fas fa-trash"></i></button></td>
    </tr>`;
    // tableBody.innerHTML += newRow;
    tableBody.insertAdjacentHTML('afterbegin', newRow);
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach((row, index) => {
        const cell = row.querySelector('td:first-child');
        cell.textContent = index + 1;
    });
    showSuccessEffect('4D');
    updateWinningsTotal();
    const winning = {
        lottery_name: "4D",
        entry_type: winningEntryType4D,
        pick_type: winningPickType4D,
        outlet: winningOutlet4D,
        winning_prize: parseFloat(winningPrize4D),
        date_of_winning: winningDate4D
    };
    saveIndividualWinnings(winning);
});

document.getElementById('winnings-form-toto').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form from submitting

    const winningEntryTypeToto = document.getElementById('winnings-entry-type-toto').value;
    const winningPickTypeToto = document.getElementById('winnings-pick-type-toto').value;
    const winningOutletToto = document.getElementById('winnings-outlet-toto').value;
    const winningPrizeToto = document.getElementById('winnings-prize-toto').value;
    const winningDateToto = document.getElementById('winnings-date-toto').value;
    const tableBody = document.querySelector("#prizes-history-table tbody");
    // Check if the no-entry-row exists and remove it
    const noEntryRow = tableBody.querySelector('.no-entry-row');
    if (noEntryRow) {
        noEntryRow.remove();
    }
    const nextRowNumber = tableBody.querySelectorAll('tr').length + 1;
    const newRow = `<tr>
        <td>${nextRowNumber}</td>
        <td>Toto</td>
        <td>${winningEntryTypeToto}</td>
        <td>${winningPickTypeToto}</td>
        <td>${winningOutletToto}</td>
        <td>$${winningPrizeToto}</td>
        <td>${winningDateToto}</td>
        <td><button class="delete-btn"><i class="fas fa-trash"></i></button></td>
    </tr>`;
    // tableBody.innerHTML += newRow;
    tableBody.insertAdjacentHTML('afterbegin', newRow);
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach((row, index) => {
        const cell = row.querySelector('td:first-child');
        cell.textContent = index + 1;
    });
    showSuccessEffect('Toto');
    updateWinningsTotal();
    const winning = {
        lottery_name: "Toto",
        entry_type: winningEntryTypeToto,
        pick_type: winningPickTypeToto,
        outlet: winningOutletToto,
        winning_prize: parseFloat(winningPrizeToto),
        date_of_winning: winningDateToto
    };
    console.log(winning);
    saveIndividualWinnings(winning);
});

function saveIndividualWinnings(winning) {
    fetch('/save-winnings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ winning }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Winnings saved successfully!');
                const lastRow = document.querySelector("#prizes-history-table tbody tr:last-child");
                lastRow.setAttribute('data-id', 'winning-' + data.id);
            } else {
                alert('Error saving winnings: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was a problem saving the winnings.');
        });
}

function setUpTableListener(tableSelector, options = {}) {
    document.querySelector(tableSelector + " tbody").addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-btn') || event.target.closest('.delete-btn')) {
            const message = options.confirmMessage || 'Are you sure you want to delete this entry?';
            const shouldDelete = confirm(message);
            if (shouldDelete) {
                const row = event.target.closest('tr');
                const tableBody = document.querySelector(tableSelector + " tbody");
                if (options.serverDelete) {
                    // const recordId = row.getAttribute('data-id').replace('purchase-', ''); // need to do for 'winning-' too
                    const rowId = row.getAttribute('data-id').replace(options.rowType + '-', '');
                    options.deleteMethod(rowId).then((success) => {
                        if (success) {
                            row.remove();
                            // Check for empty table after row removal
                            const tableBody = document.querySelector(tableSelector + " tbody");
                            const colspan = options.colspan || 9;
                            if (!tableBody.querySelector("tr:not(.no-entry-row)")) {
                                const noEntryRow = `<tr class="no-entry-row"><td colspan="${colspan}">No ${options.noDataText || 'entries'}.</td></tr>`;
                                tableBody.innerHTML = noEntryRow;
                                if (currentPage > 1) {
                                    currentPage--; // Go back to the previous page if the current one is empty
                                }
                                displayPurchaseHistory(purchaseHistoryData);
                            }
                            updatePurchaseHistoryTotals();
                            updatePaginationControls();
                        } else {
                            alert('Error deleting. Please try again later.');
                        }
                    });
                } else {
                    row.remove();
                    if (options.afterDelete) {
                        options.afterDelete();
                    }
                    const rows = tableBody.querySelectorAll('tr:not(.no-entry-row)');
                    rows.forEach((row, index) => {
                        const firstCell = row.querySelector('td:first-child');
                        firstCell.textContent = index + 1;
                    });
                    const colspan = options.colspan || 8;
                    if (!tableBody.querySelector("tr:not(.no-entry-row)")) {
                        const noEntryRow = `<tr class="no-entry-row"><td colspan="${colspan}">No ${options.noDataText || 'entries'}.</td></tr>`;
                        tableBody.innerHTML = noEntryRow;
                        updateButtonAppearance(false, '#section-today-entry');
                    }
                }
            }
        }
    });
}

setUpTableListener("#entries-table", {
    confirmMessage: 'Are you sure you want to delete this entry?',
    afterDelete: updateTotals,
    noDataText: 'entries added',
    colspan: 9
});

setUpTableListener("#purchase-history-table", {
    rowType: 'purchase',
    confirmMessage: 'Are you sure you want to delete this purchase?',
    serverDelete: true,
    deleteMethod: deletePurchase,
    noDataText: 'purchases found',
    colspan: 10
});

setUpTableListener("#prizes-history-table", {
    rowType: 'winning',
    confirmMessage: 'Are you sure you want to delete this prize entry?',
    serverDelete: true,
    deleteMethod: deleteWinnings,
    afterDelete: updateWinningsTotal,
    noDataText: 'prize entries found',
    colspan: 8
});

let isAnimating = false;  // Flag to check if animation is currently playing
let timeouts = [];  // Store active timeout IDs to clear them if needed

function clearExistingTimeouts() {
    for (let timeout of timeouts) {
        clearTimeout(timeout);
    }
    timeouts = [];
}

document.getElementById('upload4D').addEventListener('click', function () {
    addPlaceholderImage('4d');
});

document.getElementById('uploadToto').addEventListener('click', function () {
    addPlaceholderImage('toto');
});

function addPlaceholderImage(type) {
    const imgContainer = document.getElementById(`${type}-image-container`);
    const divChildrenCount = imgContainer.querySelectorAll('div.image-div').length;

    if (divChildrenCount < 5) {
        const imageDiv = document.createElement('div');
        imageDiv.classList.add('image-div');

        // Create and append a placeholder image
        const placeholderImg = document.createElement('img');
        placeholderImg.src = "https://via.placeholder.com/300x200.png?text=Uploaded+Betslip";
        imageDiv.appendChild(placeholderImg);

        const checkedButton = document.createElement('button');
        checkedButton.innerHTML = `Checked finish <i class="fa-solid fa-check"></i>`;
        checkedButton.classList.add('checked-btn');
        checkedButton.addEventListener('click', function () {
            const confirmDelete = confirm(`Delete this ${type} betslip?`);
            if (confirmDelete) {
                imgContainer.removeChild(imageDiv);
                updateCount(type, imgContainer.children.length);
                if (imgContainer.querySelectorAll('div.image-div').length === 0) {
                    const placeholderText = document.createElement('p');
                    // placeholderText.textContent = `You have not uploaded a ${type} betslip for the upcoming draw!`;
                    // if type =  "toto" use "toto" else "4D"
                    placeholderText.textContent = `You have not uploaded a ${type === "toto" ? "Toto" : "4D"} betslip for the upcoming draw!`;
                    imgContainer.appendChild(placeholderText);
                }
            }
        });
        imageDiv.appendChild(checkedButton);

        imgContainer.appendChild(imageDiv);
        updateCount(type, divChildrenCount + 1);
    } else {
        alert(`Maximum of 5 images allowed for ${type}!`);
    }

    // If there were placeholder text, remove it
    const placeholderText = imgContainer.querySelector('p');
    if (placeholderText) {
        imgContainer.removeChild(placeholderText);
    }
}

function updateCount(type, count) {
    const countElement = document.getElementById(`${type}-count`);
    countElement.textContent = count;
}

function showSuccessEffect(gameType) {
    if (isAnimating) return;  // If animation is playing, ignore button clicks

    isAnimating = true;  // Set the flag to true

    clearExistingTimeouts();  // Clear any existing timeouts

    const successElement = document.getElementById('success-message');
    const tickElement = successElement.querySelector('.tick-wrapper');
    const successTextElement = successElement.querySelector('.success-text');

    successElement.classList.remove('hidden');

    timeouts.push(setTimeout(() => {
        tickElement.style.transform = 'scale(1)';
        successTextElement.style.opacity = '1';
        successTextElement.innerText = `${gameType} entry added!`;
    }, 100));

    // Flash the background
    document.body.classList.add('effect-active');
    timeouts.push(setTimeout(() => {
        document.body.classList.remove('effect-active');
    }, 500));

    // Hide the success message after a short duration
    timeouts.push(setTimeout(() => {
        tickElement.style.transform = 'scale(0)';
        successTextElement.style.opacity = '0';
        timeouts.push(setTimeout(() => {
            successElement.classList.add('hidden');
            isAnimating = false;  // Reset the flag
        }, 700));
    }, 1000));
}

function updateTotals() {
    console.log('updateTotals() called');
    const rows = document.querySelectorAll("#entries-table tbody tr:not(.no-entry-row)");
    let total4D = 0;
    let totalToto = 0;

    rows.forEach(row => {
        const lotteryName = row.children[1].textContent; // the first td
        const costValue = parseFloat(row.children[7].textContent.replace("$", "")); // the 7th td and remove the $ sign

        if (lotteryName === "4D") {
            total4D += costValue;
        } else if (lotteryName === "Toto") {
            totalToto += costValue;
        }
    });

    const totalAll = total4D + totalToto;

    document.getElementById("total-cost-4d").textContent = `$${total4D}`;
    document.getElementById("total-cost-toto").textContent = `$${totalToto}`;
    document.getElementById("total-cost-all").textContent = `$${totalAll}`;
}

function updateWinningsTotal() {
    const rows = document.querySelectorAll("#prizes-history-table tbody tr:not(.no-entry-row)");
    let total4D = 0;
    let totalToto = 0;

    rows.forEach(row => {
        const lotteryName = row.children[1].textContent;
        const costValue = parseFloat(row.children[5].textContent.replace("$", ""));

        if (lotteryName === "4D") {
            total4D += costValue;
        } else if (lotteryName === "Toto") {
            totalToto += costValue;
        }
    });

    const totalAll = total4D + totalToto;

    document.getElementById("total-winnings-4d").textContent = `$${total4D}`;
    document.getElementById("total-winnings-toto").textContent = `$${totalToto}`;
    document.getElementById("total-winnings-all").textContent = `$${totalAll}`;
}

document.addEventListener('DOMContentLoaded', function () {
    const toggleButtons = document.querySelectorAll('.toggle-form');

    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const targetFormId = btn.getAttribute('data-target');
            const targetForm = document.getElementById(targetFormId);

            if (targetForm.style.display === 'none' || !targetForm.style.display) {
                targetForm.style.display = 'block';
                btn.innerHTML = 'Hide Form <i class="fa-solid fa-caret-right"></i>';
            } else {
                targetForm.style.display = 'none';
                btn.innerHTML = 'Show Form <i class="fa-solid fa-caret-right"></i>';
            }
        });
    });
});

function toggleSectionVisibility(sectionId) {
    const section = document.querySelector(sectionId);
    const hidable = section.querySelector('.hidable');
    if (hidable.style.display === 'none') {
        hidable.style.display = ''; // Reset to default display property
        section.querySelector('.toggle-button').textContent = "Hide Contents";
    } else {
        hidable.style.display = 'none';
        section.querySelector('.toggle-button').textContent = "Show Contents";
    }
}

const sections = ['#entry-sections', '#section-today-entry', '#section-total-spendings', '#section-total-winnings', '#notes', '#purchase-history', '#current-betslips'];

sections.forEach(sectionId => {
    const section = document.querySelector(sectionId);
    const btn = section.querySelector('.toggle-button');

    btn.addEventListener('click', function() {
        toggleSectionVisibility(sectionId);
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const editBtn = document.getElementById('edit-note-button');
    const cancelBtn = document.getElementById('cancel-note-button');
    const selfNotes = document.getElementById('self-notes');
    const lockIcon = document.getElementById('lock-icon');
    const editingText = document.getElementById('editing-text');
    let originalContent = selfNotes.value;

    // Hide cancel button initially
    cancelBtn.style.display = 'none';

    fetchNotesAndDisplay();

    editBtn.addEventListener('click', function () {
        if (selfNotes.hasAttribute('readonly')) {
            console.log('here1')
            lockIcon.style.display = 'none';
            editingText.style.display = 'inline';

            // Store the current content
            originalContent = selfNotes.value;

            // Make textarea editable
            selfNotes.removeAttribute('readonly');
            selfNotes.focus();

            editBtn.classList.remove('fa-pen-to-square');
            editBtn.classList.add('fa-regular', 'fa-floppy-disk');
            cancelBtn.style.display = 'inline';
        } else {
            console.log("here2")
            saveNotes(selfNotes.value);

            editingText.style.display = 'none';
            lockIcon.style.display = 'inline';

            selfNotes.setAttribute('readonly', true);

            // Hide the cancel button and change the save button back to edit
            editBtn.classList.remove('fa-regular', 'fa-floppy-disk');
            editBtn.classList.add('fa-pen-to-square');
            cancelBtn.style.display = 'none';
        }
    });

    cancelBtn.addEventListener('click', function () {
        // Restore the original content
        selfNotes.value = originalContent;

        // Hide editing text and show lock icon
        editingText.style.display = 'none';
        lockIcon.style.display = 'inline';

        // Make textarea non-editable
        selfNotes.setAttribute('readonly', true);

        // Hide the cancel button and change the save button back to edit
        editBtn.classList.remove('fa-regular', 'fa-floppy-disk');
        editBtn.classList.add('fa-pen-to-square');
        cancelBtn.style.display = 'none';
    });
});

function fetchNotesAndDisplay() {
    fetch('/get-notes')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const selfNotes = document.getElementById('self-notes');
                // console.log(data); // shows empty string if no notes found
                selfNotes.value = data.notes;
            } else {
                console.error('Error fetching notes:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was a problem fetching the notes.');
        });
}

function saveNotes(notesContent) {
    fetch('/save-notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: notesContent }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Note saved successfully!');
            } else {
                alert('Error saving note: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was a problem saving the note.');
        });
}

function updatePurchaseHistoryTotals() {
    const purchaseTable = document.getElementById('purchase-history-table');
    const rows = purchaseTable.querySelectorAll('tbody tr:not(.no-entry-row)');

    let total4D = 0;
    let totalToto = 0;

    rows.forEach(row => {
        const lotteryName = row.querySelector('td:nth-child(2)').textContent.trim();
        const cost = parseFloat(row.querySelector('td:nth-child(8)').textContent.replace('$', ''));

        if (lotteryName === '4D') {
            total4D += cost;
        } else if (lotteryName === 'Toto') {
            totalToto += cost;
        }
    });

    const totalAll = total4D + totalToto;

    document.getElementById('total-spend-4d').textContent = `$${total4D}`;
    document.getElementById('total-spend-toto').textContent = `$${totalToto}`;
    document.getElementById('total-spend-all').textContent = `$${totalAll}`;
}

const ROWS_PER_PAGE = 5;
let currentPage = 1;
let totalRows = 0;
let purchaseHistoryData = [];
let winningHistoryData = [];
let filteredAndSortedData = [];
let currentFilter = 'All'; // Default
let currentSort = 'latest'; // Default

// Initial data fetch
document.addEventListener('DOMContentLoaded', () => {
    fetchPurchaseHistory();
    fetchWinningHistory();
});

// Bindings for sorting and filtering
bindSortingAndFiltering();

// Bindings for pagination
bindPaginationControls();

function fetchPurchaseHistory() {
    fetch('/get-purchase-history')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                purchaseHistoryData = data.data;
                updateView();
                updatePurchaseHistoryTotals();
            } else {
                console.error('Error retrieving purchase history:', data.message);
            }
        });
}

function fetchWinningHistory() {
    fetch('/get-winnings')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                winningHistoryData = data.data;
                populateWinningTable(winningHistoryData);
                updateWinningsTotal();
            } else {
                console.error('Error retrieving winning history:', data.message);
            }
        });
}

function bindSortingAndFiltering() {
    document.querySelectorAll('#sorting-menu button[data-filter]').forEach(btn => btn.addEventListener('click', handleFilterClick));
    document.querySelectorAll('#sorting-menu button[data-sort]').forEach(btn => btn.addEventListener('click', handleSortClick));
}

function bindPaginationControls() {
    document.querySelector('.prev').addEventListener('click', handlePrevClick);
    document.querySelector('.next').addEventListener('click', handleNextClick);
}

function handleFilterClick() {
    currentFilter = this.getAttribute('data-filter');
    updateButtonSelection('#sorting-menu button[data-filter]', this);
    updateView();
}

function handleSortClick() {
    currentSort = this.getAttribute('data-sort');
    updateButtonSelection('#sorting-menu button[data-sort]', this);
    updateView();
}

function handlePrevClick() {
    if (currentPage > 1) {
        currentPage--;
        displayPurchaseHistoryPaginated();
    }
}

function handleNextClick() {
    if (currentPage * ROWS_PER_PAGE < totalRows) {
        currentPage++;
        displayPurchaseHistoryPaginated();
    }
}

function updateButtonSelection(selector, currentButton) {
    document.querySelectorAll(selector).forEach(btn => btn.classList.remove('selected'));
    currentButton.classList.add('selected');
}

function updateView() {
    filteredAndSortedData = (currentFilter === 'All')
        ? [...purchaseHistoryData]
        : purchaseHistoryData.filter(entry => entry.lottery_name === currentFilter);

    if (currentSort === 'oldest') {
        filteredAndSortedData.sort((a, b) => new Date(a.date_of_entry) - new Date(b.date_of_entry));
    } else { // latest
        filteredAndSortedData.sort((a, b) => new Date(b.date_of_entry) - new Date(a.date_of_entry));
    }

    currentPage = 1;
    totalRows = filteredAndSortedData.length;

    displayPurchaseHistoryPaginated();
}

function displayPurchaseHistoryPaginated() {
    totalRows = filteredAndSortedData.length;
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + ROWS_PER_PAGE);

    displayPurchaseHistory(paginatedData);
    updatePaginationControls();
}

function displayPurchaseHistory(history) {
    const tableBody = document.querySelector('#purchase-history-table tbody');
    tableBody.innerHTML = '';

    if (!history.length) {
        tableBody.innerHTML = '<tr class="no-entry-row"><td colspan="10">No purchases found.</td></tr>';
        return;
    }

    history.forEach((record, index) => {
        const row = document.createElement('tr');
        const rowNumber = (currentPage - 1) * ROWS_PER_PAGE + index + 1;
        row.setAttribute('data-id', 'purchase-' + record.ID);
        row.innerHTML = `
            <td>${rowNumber}</td>
            <td>${record.lottery_name}</td>
            <td>${record.entry_type}</td>
            <td>${record.pick_type}</td>
            <td>${record.bet_amount}</td>
            <td>${record.outlet}</td>
            <td>${record.number_of_boards}</td>
            <td>$${record.cost}</td>
            <td>${formatDateToLocalDateString(record.date_of_entry)}</td>
            <td><button class="delete-btn"><i class="fas fa-trash"></i></button></td>
        `;
        tableBody.appendChild(row);
    });
    updatePurchaseHistoryTotals();
    updatePaginationControls();
}

function populateWinningTable(winnings) {
    const tableBody = document.querySelector('#prizes-history-table tbody');
    tableBody.innerHTML = '';

    if (!winnings.length) {
        tableBody.innerHTML = '<tr class="no-entry-row"><td colspan="8">No prizes found.</td></tr>';
        return;
    }

    winnings.forEach((winning, index) => {
        const row = document.createElement('tr');
        const rowNumber = index + 1;
        row.setAttribute('data-id', 'winning-' + winning.ID); // Assuming winnings have an ID attribute. If not, adjust accordingly.
        row.innerHTML = `
            <td>${rowNumber}</td>
            <td>${winning.lottery_name}</td>
            <td>${winning.entry_type}</td>
            <td>${winning.pick_type}</td>
            <td>${winning.outlet}</td>
            <td>$${winning.winning_prize}</td>
            <td>${formatDateToLocalDateString(winning.date_of_winning)}</td>
            <td><button class="delete-btn"><i class="fas fa-trash"></i></button></td>
        `;
        tableBody.appendChild(row);
    });

    updateWinningsTotal();
}

function formatDateToLocalDateString(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function updatePaginationControls() {
    const totalPages = totalRows === 0 ? 1 : Math.ceil(totalRows / ROWS_PER_PAGE);
    document.querySelector('.prev').disabled = currentPage === 1;
    document.querySelector('.next').disabled = currentPage === totalPages;

    document.querySelector('.page-number').textContent = currentPage;
    document.querySelector('.total-pages').textContent = totalPages;
}

function deletePurchase(recordId) {
    return fetch(`/delete-purchase/${recordId}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (!data.success) throw new Error(data.message);

            purchaseHistoryData = purchaseHistoryData.filter(item => item.ID !== parseInt(recordId));
            filteredAndSortedData = filteredAndSortedData.filter(item => item.ID !== parseInt(recordId));

            totalRows = filteredAndSortedData.length;

            const totalPages = Math.ceil(totalRows / ROWS_PER_PAGE);
            if (currentPage > totalPages) currentPage--;
            if (currentPage < 1) currentPage = 1;
            displayPurchaseHistoryPaginated();

            return true;
        })
        .catch(error => {
            console.error('Error:', error);
            return false;
        });
}

function deleteWinnings(recordId) {
    return fetch(`/delete-winning/${recordId}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (!data.success) throw new Error(data.message);

            winningHistoryData = winningHistoryData.filter(item => item.ID !== parseInt(recordId));
            populateWinningTable(winningHistoryData);
            updateWinningsTotal();
            return true;
        })
        .catch(error => {
            console.error('Error:', error);
            return false;
        });
}

document.getElementById('sorting-btn').addEventListener('click', function () {
    const sortingMenu = document.getElementById('sorting-menu');
    const isHidden = sortingMenu.style.display === 'none';
    sortingMenu.style.display = isHidden ? 'block' : 'none';
    this.textContent = isHidden ? 'Hide Menu' : 'Sort';
});

document.getElementById('sorting-menu').addEventListener('click', function (e) {
    const button = e.target.closest('BUTTON');
    if (button) {
        const siblingButtons = button.closest('.menu-row').querySelectorAll('button');

        siblingButtons.forEach(btn => btn.classList.remove('selected'));

        button.classList.add('selected');
    }
});
document.addEventListener('DOMContentLoaded', function () {
    // Initialize SortableJS
    const sortable = new Sortable(document.getElementById('sortable-container'), {
        animation: 700,
        scroll: false,
        handle: ".move-button", // Only elements with this class will trigger dragging
        onUpdate: function (evt) {
            const newOrder = [];
            const items = document.getElementById('sortable-container').children;
            for (let item of items) {
                newOrder.push(item.id);
            }
            if (!arraysEqual(newOrder, currentOrder)) {
                updateSectionOrderInDatabase(newOrder);

                currentOrder = newOrder.slice(); // Update currentOrder with the new order. Using slice() to make a copy of newOrder.
                // console.log('Order updated!', currentOrder)
            }
        }
    });
});

// Set default order or load from saved preference
function setOrder(order) {
    const container = document.getElementById('sortable-container');
    order.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            container.appendChild(element);
        }
    });
}

// Utility function to check if two arrays are equal
function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
}

function updateSectionOrderInDatabase(newOrder) {
    fetch('/update-section-order', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newOrder: newOrder })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(message => {
            console.log(message);
        })
        .catch(error => {
            console.error('Error updating section order:', error);
            alert('There was a problem updating the section order.');
        });
}

document.getElementById('reset-order-btn').addEventListener('click', function () {
    const defaultOrder = [
        "entry-sections",
        "section-today-entry",
        "section-total-spendings",
        "section-total-winnings",
        "notes",
        "purchase-history",
        "current-betslips"
    ];
    setOrder(defaultOrder);
    if (!arraysEqual(defaultOrder, currentOrder)) {
        updateSectionOrderInDatabase(defaultOrder);
        currentOrder = defaultOrder.slice();
    }
});


