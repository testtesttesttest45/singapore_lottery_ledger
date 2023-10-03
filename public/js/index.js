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
        if(response.status === 200) {
            // Redirect the user to the login page after successful logout
            window.location.href = '/login';
        } else {
            return response.json();
        }
    })
    .then(data => {
        if(data && data.message) {
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
    updateTotals();
});

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
    const winningDate4D = formatDate(date);
    const tableBody = document.querySelector("#prizes-history-table tbody");
    // Check if the no-entry-row exists and remove it
    const noEntryRow = tableBody.querySelector('.no-entry-row');
    if (noEntryRow) {
        noEntryRow.remove();
    }
    const newRow = `<tr>
        <td>4D</td>
        <td>${winningEntryType4D}</td>
        <td>${winningPickType4D}</td>
        <td>${winningOutlet4D}</td>
        <td>$${winningPrize4D}</td>
        <td>${winningDate4D}</td>
        <td><button class="delete-btn"><i class="fas fa-trash"></i></button></td>
    </tr>`;
    tableBody.innerHTML += newRow;
    showSuccessEffect('4D');
    updateWinnings();
});

document.getElementById('winnings-form-toto').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form from submitting

    const winningEntryTypeToto = document.getElementById('winnings-entry-type-toto').value;
    const winningPickTypeToto = document.getElementById('winnings-pick-type-toto').value;
    const winningOutletToto = document.getElementById('winnings-outlet-toto').value;
    const winningPrizeToto = document.getElementById('winnings-prize-toto').value;
    const winningDateToto = formatDate(date);
    const tableBody = document.querySelector("#prizes-history-table tbody");
    // Check if the no-entry-row exists and remove it
    const noEntryRow = tableBody.querySelector('.no-entry-row');
    if (noEntryRow) {
        noEntryRow.remove();
    }
    const newRow = `<tr>
        <td>Toto</td>
        <td>${winningEntryTypeToto}</td>
        <td>${winningPickTypeToto}</td>
        <td>${winningOutletToto}</td>
        <td>$${winningPrizeToto}</td>
        <td>${winningDateToto}</td>
        <td><button class="delete-btn"><i class="fas fa-trash"></i></button></td>
    </tr>`;
    tableBody.innerHTML += newRow;
    showSuccessEffect('Toto');
    updateWinnings();
});

function setUpTableListener(tableSelector, type = 'entry', text) {
    document.querySelector(tableSelector + " tbody").addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-btn') || event.target.closest('.delete-btn')) {
            const message = (type === 'winning') ?
                'Are you sure you want to delete this winning?' :
                'Are you sure you want to delete this entry?';
            const shouldDelete = confirm(message);
            if (shouldDelete) {
                event.target.closest('tr').remove();
                updateTotals();
            }
        }

        const tableBody = document.querySelector(tableSelector + " tbody");
        if (!tableBody.querySelector("tr:not(.no-entry-row)")) {
            const noEntryRow = `<tr class="no-entry-row"><td colspan="8">No ${text}.</td></tr>`;
            tableBody.innerHTML = noEntryRow;
        }
    });
}
setUpTableListener("#entries-table", 'entry', 'entries added today');
setUpTableListener("#prizes-history-table", 'winning', 'prizes won');
// document.querySelector("#entries-table tbody").addEventListener('click', function (event) {
//     if (event.target.classList.contains('delete-btn') || event.target.closest('.delete-btn')) {
//         const shouldDelete = confirm('Are you sure you want to delete this entry?');
//         if (shouldDelete) {
//             event.target.closest('tr').remove();
//             updateTotals();
//         }
//     }

//     const tableBody = document.querySelector("#entries-table tbody");
//     if (!tableBody.querySelector("tr:not(.no-entry-row)")) {
//         const noEntryRow = `<tr class="no-entry-row"><td colspan="8">No entries added today!</td></tr>`;
//         tableBody.innerHTML = noEntryRow;
//     }
// });


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
    const rows = document.querySelectorAll("#entries-table tbody tr:not(.no-entry-row)");
    let total4D = 0;
    let totalToto = 0;

    rows.forEach(row => {
        const lotteryName = row.children[0].textContent; // the first td
        const costValue = parseFloat(row.children[6].textContent.replace("$", "")); // the 7th td and remove the $ sign

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

function updateWinnings() {
    const rows = document.querySelectorAll("#prizes-history-table tbody tr:not(.no-entry-row)");
    let total4D = 0;
    let totalToto = 0;

    rows.forEach(row => {
        const lotteryName = row.children[0].textContent; // the first td
        const costValue = parseFloat(row.children[4].textContent.replace("$", "")); // the 5th td and remove the $ sign

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

document.addEventListener('DOMContentLoaded', function () {
    const editBtn = document.getElementById('edit-note-button');
    const cancelBtn = document.getElementById('cancel-note-button');
    const selfNotes = document.getElementById('self-notes');
    const lockIcon = document.getElementById('lock-icon');
    const editingText = document.getElementById('editing-text');
    let originalContent = selfNotes.value;

    // Hide cancel button initially
    cancelBtn.style.display = 'none';

    editBtn.addEventListener('click', function () {
        if (selfNotes.hasAttribute('readonly')) {
            // Show editing text and hide lock icon
            lockIcon.style.display = 'none';
            editingText.style.display = 'inline';

            // Store the current content
            originalContent = selfNotes.value;

            // Make textarea editable
            selfNotes.removeAttribute('readonly');
            selfNotes.focus();

            // Show the cancel button and change the edit button to save (floppy disk)
            editBtn.classList.remove('fa-pen-to-square');
            editBtn.classList.add('fa-regular', 'fa-floppy-disk');
            cancelBtn.style.display = 'inline';
        } else {
            // Hide editing text and show lock icon
            editingText.style.display = 'none';
            lockIcon.style.display = 'inline';

            // Make textarea non-editable
            selfNotes.setAttribute('readonly', true);

            // Show saved alert
            alert('Saved!');

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

const defaultOrder = [
    "entry-sections",
    "section-today-entry",
    "section-total-spendings",
    "section-total-winnings",
    "notes",
    "purchase-history",
    "current-betslips"
];

// Initialize SortableJS
const sortable = new Sortable(document.getElementById('sortable-container'), {
    animation: 700,
    onUpdate: function (evt) {
        const newOrder = [];
        const items = document.getElementById('sortable-container').children;
        for (let item of items) {
            newOrder.push(item.id);
        }
        localStorage.setItem('sectionOrder', JSON.stringify(newOrder));
    }
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

document.getElementById('reset-order-btn').addEventListener('click', function () {
    setOrder(defaultOrder);
    localStorage.removeItem('sectionOrder'); // reset the saved order as well
});

// Check for saved order or use default
const savedOrder = JSON.parse(localStorage.getItem('sectionOrder'));
if (savedOrder) {
    setOrder(savedOrder);
} else {
    setOrder(defaultOrder);
}

