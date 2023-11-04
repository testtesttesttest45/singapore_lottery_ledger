let currentOrder = [];
const date = new Date();
let isAnimating = false;  // Flag to check if animation is currently playing
let timeouts = [];  // Store active timeout IDs to clear them if needed
const ROWS_PER_PAGE = 10;
let currentPage = 1;
let totalRows = 0;
let purchaseHistoryData = [];
let winningHistoryData = [];
let filteredAndSortedData = [];
let currentFilter = 'All'; // Default
let currentSort = 'latest'; // Default
const lotteryTypes = ['4d', 'toto', 'sg-sweep'];

document.addEventListener('DOMContentLoaded', function () {

    // get 'tokenExpiration' cookie to handle session expiration
    const tokenExpiration = parseInt(getCookie('tokenExpiration')) * 1000; // convert to milliseconds
    console.log('Session token will expire at', new Date(tokenExpiration));
    const delay = tokenExpiration - Date.now();

    setTimeout(() => {
        alert('Your session has expired. Please log in again.');
        window.location.href = '/login';
    }, delay);
    fetch('/current-user')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const userNameElement = document.getElementById('user-name');
            const firstBettingElement = document.getElementById('first-betting');

            const dateObj = new Date(data.firstDayBetting);
            const formattedDate = `${dateObj.toLocaleString('default', { month: 'long' })} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;

            userNameElement.textContent = data.fullName;
            firstBettingElement.textContent = formattedDate;

            // Set the section order based on user data
            setOrder(data.sectionsOrder);
            currentOrder.push(data.sectionsOrder);
            // console.log(currentOrder);
        })
        .catch(error => {
            console.error('Error fetching current user:', error);
        });
    fetch('/get-announcements')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(announcements => {
            const announcementContainer = document.getElementById('announcement-container');

            if (!announcements.length) {
                announcementContainer.innerHTML = `
                    <div class="announcement-banner" style="background: linear-gradient(45deg, #675757, #d4bebe);">
                        <p class="announcement-text">There is no new announcements</p>
                    </div>
                `;
                return;
            }

            announcements.forEach(announcement => {
                const announcementDiv = document.createElement('div');
                announcementDiv.className = 'announcement-banner';

                const announcementText = document.createElement('p');
                announcementText.className = 'announcement-text';
                announcementText.textContent = announcement.announcement_content;

                announcementDiv.appendChild(announcementText);
                announcementContainer.appendChild(announcementDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching announcements:', error);
        });
    fetchPurchaseHistory();
    fetchWinningHistory();
    fetchBetslips();
    fetchNotesAndDisplay();

    const sections = ['#section-new-entry', '#section-today-entry', '#section-total-spendings', '#section-total-winnings', '#section-notes', '#section-purchase-history', '#section-current-betslips'];
    sections.forEach(sectionId => { // for the Show contents and Hide contents buttons in each section
        const section = document.querySelector(sectionId);
        const btn = section.querySelector('.toggle-button');

        btn.addEventListener('click', function () {
            toggleSectionVisibility(sectionId);
        });
    });

    const refreshButton = document.getElementById('refresh-btn');
    refreshButton.addEventListener('click', function () {
        location.reload();
    });

    document.getElementById('logout-btn').addEventListener('click', function () {
        fetch('/logout', {
            method: 'POST',
            credentials: 'include'
        })
            .then(response => {
                if (response.status === 200) {
                    window.location.href = '/login';
                } else {
                    return response.json();
                }
            })
            .then(data => {
                if (data && data.message) {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error during logout:', error);
            });
    });

    document.querySelectorAll('.outlet-select').forEach(dropdown => {
        dropdown.addEventListener('change', function () { // attach event listener to each dropdown with class 'outlet-select'
            const customOutletRow = this.parentElement.nextElementSibling; // gets the .customOutletRow
            if (this.value === 'Others') {
                customOutletRow.style.display = 'grid';
            } else {
                customOutletRow.style.display = 'none';
            }
        });
    });

    // Today Entry section, Add 4D Entry to Table
    document.getElementById('4d-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const bigBet = parseInt(document.getElementById('4d-bet-big').value || 0);
        const smallBet = parseInt(document.getElementById('4d-bet-small').value || 0);
        const numberOfBoards = document.getElementById('4d-boards').value;
        const entryType4D = document.getElementById('4d-entry-type').value;
        const pickType4D = document.getElementById('4d-pick-type').value;
        let outlet = this.querySelector('.outlet-select').value;

        if (outlet === 'Others') {
            outlet = this.querySelector('.customOutlet').value;
            if (!outlet.trim()) {
                alert('Please specify the custom outlet.');
                return;
            }
        }

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
        updateButtonNeon(true, '#section-today-entry');
        const nextRowNumber = tableBody.querySelectorAll('tr').length + 1;
        const newRow = `
            <tr>
                <td>${nextRowNumber}</td>
                <td>4D</td>
                <td>${entryType4D}</td>
                <td>${pickType4D}</td>
                <td>$${bigBet}(Big), $${smallBet}(Small)</td>
                <td>${outlet}</td>
                <td>${numberOfBoards}</td>
                <td>$${parseInt(bigBet || 0) * numberOfBoards + parseInt(smallBet || 0) * numberOfBoards}</td>
                <td>
                    <button class="delete-btn" title="Remove this entry">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += newRow;
        showSuccessEffect('4D entry added!');
        updateTotals();
    });

    // Add Toto Entry to Table
    document.getElementById('toto-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const entryType = document.getElementById('toto-entry-type').value;
        const numberOfBoards = document.getElementById('toto-boards').value;
        const entryTypeToto = document.getElementById('toto-entry-type').value;
        const pickTypeToto = document.getElementById('toto-pick-type').value;
        // const outletToto = document.getElementById('toto-outlet').value;
        const draws = document.getElementById('toto-draws').value;
        let cost = calculateCost(entryType, numberOfBoards);
        if (draws !== "0") {
            cost = cost * draws;  
        }
        let outlet = this.querySelector('.outlet-select').value;
        if (outlet === 'Others') {
            outlet = this.querySelector('.customOutlet').value;
            if (!outlet.trim()) {
                alert('Please specify the custom outlet.');
                return;
            }
        }

        const tableBody = document.querySelector("#entries-table tbody");
        const noEntryRow = tableBody.querySelector('.no-entry-row');
        if (noEntryRow) {
            noEntryRow.remove();
        }
        updateButtonNeon(true, '#section-today-entry');
        const nextRowNumber = tableBody.querySelectorAll('tr').length + 1;
        const newRow = `
            <tr>
                <td>${nextRowNumber}</td>
                <td>Toto</td>
                <td>${entryTypeToto}</td>
                <td>${pickTypeToto}</td>
                <td style="text-align: center">-</td>
                <td>${outlet}</td>
                <td>${numberOfBoards}</td>
                <td>$${cost}</td>
                <td>
                    <button class="delete-btn" title="Remove this entry">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += newRow;
        showSuccessEffect('Toto entry added!');
        updateTotals();
    });

    // Add Singapore Sweep Entry to Table
    document.getElementById('sg-sweep-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const numberOfBoards = document.getElementById('sg-sweep-boards').value;
        const pickTypeSgSweep = document.getElementById('sg-sweep-pick-type').value;
        // const outletSgSweep = document.getElementById('sg-sweep-outlet').value;
        const cost = numberOfBoards * 3;
        let outlet = this.querySelector('.outlet-select').value;

        if (outlet === 'Others') {
            outlet = this.querySelector('.customOutlet').value;
            if (!outlet.trim()) {
                alert('Please specify the custom outlet.');
                return;
            }
        }
        const tableBody = document.querySelector("#entries-table tbody");
        const noEntryRow = tableBody.querySelector('.no-entry-row');
        if (noEntryRow) {
            noEntryRow.remove();
        }
        updateButtonNeon(true, '#section-today-entry');
        const nextRowNumber = tableBody.querySelectorAll('tr').length + 1;
        const newRow = `
            <tr>
                <td>${nextRowNumber}</td>
                <td>Singapore Sweep</td>
                <td style="text-align: center">-</td>
                <td>${pickTypeSgSweep}</td>
                <td style="text-align: center">-</td>
                <td>${outlet}</td>
                <td>${numberOfBoards}</td>
                <td>$${cost}</td>
                <td>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += newRow;
        showSuccessEffect('Singapore Sweep entry added!');
        updateTotals();
    });

    document.getElementById('save-entries-btn').addEventListener('click', function () {
        const table = document.getElementById('entries-table');
        const rows = table.querySelectorAll('tbody tr');
        const entries = [];

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 9) {
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

        if (entries.length) { // means there are entries to save
            saveEntries(entries);
        } else {
            alert('No valid entries to save.');
        }
    });

    // Total Winnings section
    document.getElementById('winnings-form-4d').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form from submitting

        const winningEntryType4D = document.getElementById('winnings-entry-type-4d').value;
        const winningPickType4D = document.getElementById('winnings-pick-type-4d').value;
        // const winningOutlet4D = document.getElementById('winnings-outlet-4d').value;
        const winningPrize4D = document.getElementById('winnings-prize-4d').value;
        const winningDate4D = document.getElementById('winnings-date-4d').value;
        const tableBody = document.querySelector("#winnings-history-table tbody");
        let outlet = this.querySelector('.outlet-select').value;

        if (outlet === 'Others') {
            outlet = this.querySelector('.customOutlet').value;
            if (!outlet.trim()) {
                alert('Please specify the custom outlet.');
                return;
            }
        }

        // Check if the no-entry-row exists and remove it
        const noEntryRow = tableBody.querySelector('.no-entry-row');
        if (noEntryRow) {
            noEntryRow.remove();
        }
        const nextRowNumber = tableBody.querySelectorAll('tr').length + 1;
        const newRow = `
            <tr>
                <td>${nextRowNumber}</td>
                <td>4D</td>
                <td>${winningEntryType4D}</td>
                <td>${winningPickType4D}</td>
                <td>${outlet}</td>
                <td>$${winningPrize4D}</td>
                <td>${winningDate4D}</td>
                <td>
                    <button class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        // tableBody.innerHTML += newRow;
        tableBody.insertAdjacentHTML('afterbegin', newRow);
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            const cell = row.querySelector('td:first-child');
            cell.textContent = index + 1;
        });
        const winning = {
            lottery_name: "4D",
            entry_type: winningEntryType4D,
            pick_type: winningPickType4D,
            outlet: outlet,
            winning_prize: parseFloat(winningPrize4D),
            date_of_winning: winningDate4D
        };
        // console.log(winning);
        saveIndividualWinnings(winning, '4D');
        updateWinningsTotal();
    });

    document.getElementById('winnings-form-toto').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form from submitting

        const winningEntryTypeToto = document.getElementById('winnings-entry-type-toto').value;
        const winningPickTypeToto = document.getElementById('winnings-pick-type-toto').value;
        // const winningOutletToto = document.getElementById('winnings-outlet-toto').value;
        const winningPrizeToto = document.getElementById('winnings-prize-toto').value;
        const winningDateToto = document.getElementById('winnings-date-toto').value;
        const tableBody = document.querySelector("#winnings-history-table tbody");
        let outlet = this.querySelector('.outlet-select').value;

        if (outlet === 'Others') {
            outlet = this.querySelector('.customOutlet').value;
            if (!outlet.trim()) {
                alert('Please specify the custom outlet.');
                return;
            }
        }

        // Check if the no-entry-row exists and remove it
        const noEntryRow = tableBody.querySelector('.no-entry-row');
        if (noEntryRow) {
            noEntryRow.remove();
        }
        const nextRowNumber = tableBody.querySelectorAll('tr').length + 1;
        const newRow = `
            <tr>
                <td>${nextRowNumber}</td>
                <td>Toto</td>
                <td>${winningEntryTypeToto}</td>
                <td>${winningPickTypeToto}</td>
                <td>${outlet}</td>
                <td>$${winningPrizeToto}</td>
                <td>${winningDateToto}</td>
                <td>
                    <button class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        // tableBody.innerHTML += newRow;
        tableBody.insertAdjacentHTML('afterbegin', newRow);
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            const cell = row.querySelector('td:first-child');
            cell.textContent = index + 1;
        });
        const winning = {
            lottery_name: "Toto",
            entry_type: winningEntryTypeToto,
            pick_type: winningPickTypeToto,
            outlet: outlet,
            winning_prize: parseFloat(winningPrizeToto),
            date_of_winning: winningDateToto
        };
        saveIndividualWinnings(winning, 'Toto');
        updateWinningsTotal();
    });

    document.getElementById('winnings-form-sg-sweep').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form from submitting

        const winningPickTypeSgSweep = document.getElementById('winnings-pick-type-sg-sweep').value;
        // const winningOutletSgSweep = document.getElementById('winnings-outlet-sg-sweep').value;
        const winningPrizeSgSweep = document.getElementById('winnings-prize-sg-sweep').value;
        const winningDateSgSweep = document.getElementById('winnings-date-sg-sweep').value;
        const tableBody = document.querySelector("#winnings-history-table tbody");
        let outlet = this.querySelector('.outlet-select').value;

        if (outlet === 'Others') {
            outlet = this.querySelector('.customOutlet').value;
            if (!outlet.trim()) {
                alert('Please specify the custom outlet.');
                return;
            }
        }

        // Check if the no-entry-row exists and remove it
        const noEntryRow = tableBody.querySelector('.no-entry-row');
        if (noEntryRow) {
            noEntryRow.remove();
        }
        const nextRowNumber = tableBody.querySelectorAll('tr').length + 1;
        const newRow = `
            <tr>
                <td>${nextRowNumber}</td>
                <td>Singapore Sweep</td>
                <td>-</td>
                <td>${winningPickTypeSgSweep}</td>
                <td>${outlet}</td>
                <td>$${winningPrizeSgSweep}</td>
                <td>${winningDateSgSweep}</td>
                <td>
                    <button class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        // tableBody.innerHTML += newRow;
        tableBody.insertAdjacentHTML('afterbegin', newRow);
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            const cell = row.querySelector('td:first-child');
            cell.textContent = index + 1;
        });
        const winning = {
            lottery_name: "Singapore Sweep",
            entry_type: "-",
            pick_type: winningPickTypeSgSweep,
            outlet: outlet,
            winning_prize: parseFloat(winningPrizeSgSweep),
            date_of_winning: winningDateSgSweep
        };
        saveIndividualWinnings(winning, 'Singapore Sweep');
        updateWinningsTotal();
    });

    const toggleButtons = document.querySelectorAll('.toggle-form'); // for the Show form and Hide form buttons in Total Winnings section

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

    setUpTableListener("#entries-table", {
        confirmMessage: 'Are you sure you want to delete this entry?',
        afterDelete: updateTotals,
        noDataText: 'entries added', // "No entries added."
        colspan: 9
    });

    setUpTableListener("#purchase-history-table", {
        rowType: 'purchase',
        confirmMessage: 'Are you sure you want to delete this purchase?',
        serverDelete: true,
        deleteMethod: deletePurchase,
        editMethod: editPurchase,
        noDataText: 'purchases found',
        colspan: 10
    });

    setUpTableListener("#winnings-history-table", {
        rowType: 'winning',
        confirmMessage: 'Are you sure you want to delete this winning?',
        serverDelete: true,
        deleteMethod: deleteWinnings,
        afterDelete: updateWinningsTotal,
        noDataText: 'winnings added',
        colspan: 8
    });

    // Current Betslips section
    document.getElementById('upload4D').addEventListener('click', function () {
        document.getElementById('input4D').click(); // it is a hidden input for file upload
    });

    document.getElementById('uploadToto').addEventListener('click', function () {
        document.getElementById('inputToto').click();
    });

    document.getElementById('uploadSgSweep').addEventListener('click', function () {
        document.getElementById('inputSgSweep').click();
    });

    document.getElementById('input4D').addEventListener('change', function () {
        handleImageUpload('4d', this);
    });

    document.getElementById('inputToto').addEventListener('change', function () {
        handleImageUpload('toto', this);
    });

    document.getElementById('inputSgSweep').addEventListener('change', function () {
        handleImageUpload('sg-sweep', this);
    });

    // Notes section
    const editBtn = document.getElementById('edit-note-button');
    const cancelBtn = document.getElementById('cancel-note-button');
    const selfNotes = document.getElementById('self-notes'); // main content of the notes section
    const lockIcon = document.getElementById('lock-icon'); // just an icon to show when notes are not editable
    const editingText = document.getElementById('editing-text'); // just a text to show when notes are editable
    let originalContent = selfNotes.value; // either empty or fetched from database

    cancelBtn.style.display = 'none';

    editBtn.addEventListener('click', function () {
        if (selfNotes.hasAttribute('readonly')) {
            lockIcon.style.display = 'none';
            editingText.style.display = 'inline';

            // Store the current content
            originalContent = selfNotes.value;

            // Make textarea editable
            selfNotes.removeAttribute('readonly');
            selfNotes.focus(); // bring user focus to the textarea

            editBtn.classList.remove('fa-pen-to-square');
            editBtn.classList.add('fa-regular', 'fa-floppy-disk');
            cancelBtn.style.display = 'inline';
        } else {
            saveNotes(selfNotes.value);

            editingText.style.display = 'none';
            lockIcon.style.display = 'inline';

            selfNotes.setAttribute('readonly', true);

            editBtn.classList.remove('fa-regular', 'fa-floppy-disk');
            editBtn.classList.add('fa-pen-to-square');
            cancelBtn.style.display = 'none';
        }
    });

    cancelBtn.addEventListener('click', function () {
        selfNotes.value = originalContent; // Restore the original content

        editingText.style.display = 'none';
        lockIcon.style.display = 'inline';

        selfNotes.setAttribute('readonly', true);

        editBtn.classList.remove('fa-regular', 'fa-floppy-disk');
        editBtn.classList.add('fa-pen-to-square');
        cancelBtn.style.display = 'none';
    });

    bindSortingAndFiltering(); // sorting and filtering for purchase history table
    bindPaginationControls(); // pagination for purchase history table

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
            siblingButtons.forEach(btn => btn.classList.remove('selected')); // ensures for Sorting, only one button can be selected at a time, same for Filtering
            button.classList.add('selected');
        }
    });

    // Sortable divs functionality
    const sortable = new Sortable(document.getElementById('sortable-container'), {
        animation: 700,
        scroll: true,
        direction: 'vertical',
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
            }
        }
    });

    document.getElementById('reset-order-btn').addEventListener('click', function () {
        const defaultOrder = [
            "section-new-entry",
            "section-today-entry",
            "section-total-spendings",
            "section-total-winnings",
            "section-notes",
            "section-purchase-history",
            "section-current-betslips"
        ];
        setOrder(defaultOrder);
        if (!arraysEqual(defaultOrder, currentOrder)) {
            updateSectionOrderInDatabase(defaultOrder);
            currentOrder = defaultOrder.slice();
        }
    });

    // Contact Admin section
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();
        document.getElementById('loadingSpinner').classList.remove('hidden');

        const messageType = document.getElementById('messageType').value;
        const messageContent = document.getElementById('messageContent').value;
        const senderEmail = document.getElementById('senderEmail').value;

        // Create POST request payload
        const payload = {
            messageType: messageType,
            messageContent: messageContent,
            senderEmail: senderEmail
        };

        fetch('/contact-admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                if (!data.success) throw new Error(data.message);
                document.getElementById('loadingSpinner').classList.add('hidden');
                contactForm.reset();
                showSuccessEffect(`${data.message}`);
            })
            .catch(error => {
                setTimeout(() => {
                    document.getElementById('loadingSpinner').classList.add('hidden');
                    alert(error.message);
                }, 1000);
            });
    });

    // const lotteryTypes = ['4d', 'toto', 'sg-sweep'];
    // Betslip pagination and smooth scrolling behaviours
    for (const type of lotteryTypes) {
        const container = document.getElementById(`image-container-${type}`);
        const prevBtn = document.getElementById(`prevBtn-${type}`);
        const nextBtn = document.getElementById(`nextBtn-${type}`);

        prevBtn.addEventListener('click', function () {
            checkButtonVisibility(type);
            container.scrollBy({ left: -container.clientWidth, behavior: 'smooth' });

        });

        nextBtn.addEventListener('click', function () {
            checkButtonVisibility(type);
            container.scrollBy({ left: container.clientWidth, behavior: 'smooth' });

        });

        container.addEventListener('scroll', () => checkButtonVisibility(type));
    }

    function calculateCost(entryType, boards) {
        let costPerBoard = 1; // ordinary and default cost per board

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

    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    function updateRowNumbers(tableSelector) {
        const rows = document.querySelectorAll(`${tableSelector} tbody tr:not(.no-entry-row)`);
        rows.forEach((row, index) => {
            row.cells[0].innerText = index + 1;  // Update the first cell with the row number
        });
    }

    function updateButtonNeon(hasEntries, sectionSelector) {
        const neonReflection = document.querySelector('.neon-reflection');
        const saveButton = document.getElementById('save-entries-btn');
        if (hasEntries) {
            saveButton.classList.add('neon-button');
            neonReflection.style.display = 'block';
            // sectionSelecctor will be "#section-today-entry", so when used it we will change its background color to #95e495
            document.querySelector(sectionSelector).style.backgroundColor = "#95e495";
        } else {
            saveButton.classList.remove('neon-button');
            neonReflection.style.display = 'none';
            document.querySelector(sectionSelector).style.backgroundColor = "";
        }
    }

    function saveEntries(entries) {
        const previousPurchaseIds = Array.from(document.querySelectorAll('#purchase-history-table tbody tr:not(.no-entry-row)'))
            .map(row => parseInt(row.getAttribute('data-id').replace('purchase-', '')));

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
                    console.log('Entries saved successfully!');
                    showSuccessEffect('Entries saved!');
                    const tableBody = document.querySelector('#entries-table tbody');
                    while (tableBody.firstChild) {
                        tableBody.removeChild(tableBody.firstChild);
                    }
                    // checkForNoEntries("#entries-table", 'entry', 'entries added');
                    updateTotals();
                    fetchPurchaseHistory(() => {
                        const currentPurchaseIds = Array.from(document.querySelectorAll('#purchase-history-table tbody tr:not(.no-entry-row)'))
                            .map(row => parseInt(row.getAttribute('data-id').replace('purchase-', '')));
                        const newIds = currentPurchaseIds.filter(id => !previousPurchaseIds.includes(id));
                        newIds.forEach(id => {
                            const row = document.querySelector(`#purchase-history-table tbody tr:not(.no-entry-row)[data-id="purchase-${id}"]`);
                            if (row) {
                                row.classList.add('gradient-highlight')
                                setTimeout(() => {
                                    row.classList.remove('gradient-highlight');
                                }, 1400);
                            }
                        });
                    });
                    updateButtonNeon(false, '#section-today-entry');
                    const purchaseHistorySection = document.querySelector('#section-purchase-history');
                    if (purchaseHistorySection) {
                        purchaseHistorySection.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                } else {
                    alert('Error saving entries: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was a problem saving the entries.');
            });
    }

    function saveIndividualWinnings(winning, lottery_name) {
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
                    console.log('Winnings saved successfully!');
                    showSuccessEffect(`${lottery_name} winnings saved!`);
                    // const lastRow = document.querySelector("#winnings-history-table tbody tr:last-child");
                    // lastRow.setAttribute('data-id', 'winning-' + data.id);
                    fetchWinningHistory(() => {
                        const newRow = document.querySelector(`#winnings-history-table tbody tr[data-id="winning-${data.id}"]`);
                        if (newRow) {
                            newRow.classList.add('gradient-highlight');
                            setTimeout(() => {
                                newRow.classList.remove('gradient-highlight');
                            }, 1400);
                            // scroll to the new row
                            newRow.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center'
                            });
                        }
                    });
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
        const tbody = document.querySelector(tableSelector + " tbody");

        function toggleEditMode(td, isEditing) {
            const dateText = td.querySelector('.date-text');
            const dateInput = td.querySelector('.date-input');
            const confirmBtn = td.querySelector('.confirm-btn');
            const cancelBtn = td.querySelector('.cancel-btn');
            const editBtn = td.querySelector('.edit-btn');

            if (isEditing) {
                dateText.style.display = 'none';
                dateInput.style.display = 'block';
                confirmBtn.style.display = 'inline-block';
                cancelBtn.style.display = 'inline-block';
                editBtn.style.display = 'none';
            } else {
                dateText.style.display = 'block';
                dateInput.style.display = 'none';
                confirmBtn.style.display = 'none';
                cancelBtn.style.display = 'none';
                editBtn.style.display = 'flex';
            }
        }

        function handleEdit(td) {
            toggleEditMode(td, true);
        }

        function handleConfirm(td, rowId, rowIndex) {
            const dateText = td.querySelector('.date-text');
            const dateInput = td.querySelector('.date-input');
            const newDate = dateInput.value;
            const rowDate = purchaseHistoryData[rowIndex].date_of_entry;
            if (newDate === formatDateToLocalDateString(rowDate)) {
                alert('Date unchanged.');
                toggleEditMode(td, false);
                return;
            }
            editPurchase(rowId, dateInput.value).then((success) => {
                if (success) {
                    dateText.textContent = dateInput.value;
                    toggleEditMode(td, false);
                } else {
                    alert('Error updating. Please try again later.');
                }
            });
        }

        function handleCancel(td) {
            const dateText = td.querySelector('.date-text');
            const dateInput = td.querySelector('.date-input');

            dateInput.value = dateText.textContent;
            toggleEditMode(td, false);
        }

        tbody.addEventListener('click', function (event) {
            const td = event.target.closest('td');
            const row = event.target.closest('tr');
            const rowIndex = Array.from(row.parentNode.children).indexOf(row);
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
                            updateButtonNeon(false, '#section-today-entry');
                        }
                    }
                }
            }
            else if (event.target.classList.contains('edit-btn') || event.target.closest('.edit-btn')) {
                handleEdit(td);
            }
            else if (event.target.classList.contains('confirm-btn') || event.target.closest('.confirm-btn')) {
                const rowId = row.getAttribute('data-id').replace('purchase-', '');
                handleConfirm(td, rowId, rowIndex);
                fetchPurchaseHistory();
            }
            else if (event.target.classList.contains('cancel-btn') || event.target.closest('.cancel-btn')) {
                handleCancel(td);
            }
        });
    }

    function handleImageUpload(type, input) {
        const file = input.files[0];
        if (!file) return;
        document.getElementById('loadingSpinner').classList.remove('hidden');
        const reader = new FileReader();

        reader.readAsDataURL(file);

        uploadToServer(type, file, function (success, cloudinaryUrl, betslipId) {
            document.getElementById('loadingSpinner').classList.add('hidden');
            if (success) {
                // If upload was successful, display the image using Cloudinary URL and set its ID
                addUploadedBetslipImage(type, cloudinaryUrl, betslipId);
                showSuccessEffect(`${type} betslip uploaded!`);
            } else {
                alert('Error uploading image. Please try again later.');
            }
        });

        // Clear the input to ensure the change event is triggered next time, even for the same file.
        input.value = "";
    }

    function fetchBetslips() {
        fetch('/retrieve-betslips')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    for (let betslip of data.data) {
                        addUploadedBetslipImage(betslip.lottery_name.toLowerCase(), betslip.image_url, betslip.betslip_id);
                    }

                    for (const type of lotteryTypes) {
                        checkButtonVisibility(type);
                    }
                } else {
                    console.error('Error retrieving betslips:', data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching the betslips:', error);
            });
    }

    function addUploadedBetslipImage(type, imgSrc, betslipId) {
        const imgContainer = document.getElementById(`image-container-${type}`);
        const divChildrenCount = imgContainer.querySelectorAll('div.image-div').length;

        if (divChildrenCount < 5) {
            const imageDiv = document.createElement('div');
            imageDiv.classList.add('image-div');

            const uploadedImg = document.createElement('img');
            uploadedImg.src = imgSrc;
            uploadedImg.alt = `${type} betslip`;
            imageDiv.appendChild(uploadedImg);
            imageDiv.setAttribute('data-id', `betslip-${betslipId}`);

            const checkedButton = document.createElement('button');
            checkedButton.innerHTML = `Checked finish <i class="fa-solid fa-check"></i>`;
            checkedButton.classList.add('checked-btn');
            checkedButton.addEventListener('click', function () {
                const displayNames = {
                    '4d': '4D',
                    'toto': 'Toto',
                    'sg-sweep': 'Singapore Sweep'
                };
                const currentType = displayNames[type] || type; // Fallback to the original type if not found in the map
                const confirmDelete = confirm(`Done checking this ${currentType} betslip?`);
                if (confirmDelete) {
                    const betslipId = imageDiv.getAttribute('data-id').replace('betslip-', '');
                    fetch(`/check-betslip/${betslipId}`, {
                        method: 'DELETE',
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                showSuccessEffect(`${currentType} betslip checked!`);
                                imgContainer.removeChild(imageDiv);
                                updateCount(type, imgContainer.children.length);
                                for (const type of lotteryTypes) {
                                    checkButtonVisibility(type);
                                }
                                if (imgContainer.querySelectorAll('div.image-div').length === 0) {
                                    const placeholderText = document.createElement('p');
                                    placeholderText.textContent = `You have not uploaded a ${type === "toto" ? "Toto" :
                                        type === "4d" ? "4D" :
                                            type === "Singapore Sweep" ? "Singapore Sweep" : ""
                                        } betslip for the upcoming draw!`;
                                    imgContainer.appendChild(placeholderText);
                                }
                            } else {
                                alert('Error checking the betslip. Please try again later.');
                            }
                        })
                        .catch(error => {
                            console.error('Error checking the betslip:', error);
                        });
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

    function uploadToServer(type, file, callback) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('lotteryName', type);
        fetch('/upload-image', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const betslipId = data.ID;
                    callback(true, data.imgUrl, betslipId);
                    for (const type of lotteryTypes) {
                        checkButtonVisibility(type);
                    }
                } else {
                    callback(false);
                }
            })
            .catch(error => {
                console.error('Error uploading the image:', error);
                callback(false);
            });
    }

    function updateCount(type, count) {
        const countElement = document.getElementById(`${type}-count`);
        countElement.textContent = count;
    }

    function showSuccessEffect(message) {
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
            successTextElement.innerText = `${message}`;
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
        let totalSgSweep = 0;

        rows.forEach(row => {
            const lotteryName = row.children[1].textContent; // the first td
            const costValue = parseFloat(row.children[7].textContent.replace("$", "")); // the 7th td and remove the $ sign

            if (lotteryName === "4D") {
                total4D += costValue;
            } else if (lotteryName === "Toto") {
                totalToto += costValue;
            } else if (lotteryName === "Singapore Sweep") {
                totalSgSweep += costValue;
            }
        });

        const totalAll = total4D + totalToto + totalSgSweep;

        document.getElementById("total-cost-4d").textContent = `$${total4D}`;
        document.getElementById("total-cost-toto").textContent = `$${totalToto}`;
        document.getElementById("total-cost-sg-sweep").textContent = `$${totalSgSweep}`;
        document.getElementById("total-cost-all").textContent = `$${totalAll}`;
    }

    function updateWinningsTotal() {
        const rows = document.querySelectorAll("#winnings-history-table tbody tr:not(.no-entry-row)");
        let total4D = 0;
        let totalToto = 0;
        let totalSgSweep = 0;

        rows.forEach(row => {
            const lotteryName = row.children[1].textContent;
            const costValue = parseFloat(row.children[5].textContent.replace("$", ""));

            if (lotteryName === "4D") {
                total4D += costValue;
            } else if (lotteryName === "Toto") {
                totalToto += costValue;
            } else if (lotteryName === "Singapore Sweep") {
                totalSgSweep += costValue;
            }
        });

        const totalAll = total4D + totalToto + totalSgSweep;

        document.getElementById("total-winnings-4d").textContent = `$${total4D}`;
        document.getElementById("total-winnings-toto").textContent = `$${totalToto}`;
        document.getElementById("total-winnings-sg-sweep").textContent = `$${totalSgSweep}`;
        document.getElementById("total-winnings-all").textContent = `$${totalAll}`;
    }

    function clearExistingTimeouts() {
        for (let timeout of timeouts) {
            clearTimeout(timeout);
        }
        timeouts = [];
    }

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
                    console.log('Note saved successfully!');
                    showSuccessEffect('Notes saved successfully!');
                } else {
                    alert('Error saving note: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was a problem saving the note.');
            });
    }

    // function updatePurchaseHistoryTotals() {
    //     const purchaseTable = document.getElementById('purchase-history-table');
    //     const rows = purchaseTable.querySelectorAll('tbody tr:not(.no-entry-row)');

    //     let total4D = 0;
    //     let totalToto = 0;

    //     rows.forEach(row => {
    //         const lotteryName = row.querySelector('td:nth-child(2)').textContent.trim();
    //         const cost = parseFloat(row.querySelector('td:nth-child(8)').textContent.replace('$', ''));

    //         if (lotteryName === '4D') {
    //             total4D += cost;
    //         } else if (lotteryName === 'Toto') {
    //             totalToto += cost;
    //         }
    //     });

    //     const totalAll = total4D + totalToto;

    //     document.getElementById('total-spend-4d').textContent = `$${total4D}`;
    //     document.getElementById('total-spend-toto').textContent = `$${totalToto}`;
    //     document.getElementById('total-spend-all').textContent = `$${totalAll}`;
    // }

    function updatePurchaseHistoryTotals() { // this version calculates the entire dataset instead of just the table
        let total4D = 0;
        let totalToto = 0;
        let totalSgSweep = 0;

        purchaseHistoryData.forEach(purchase => {
            const lotteryName = purchase.lottery_name;
            const cost = purchase.cost;

            if (lotteryName === '4D') {
                total4D += cost;
            } else if (lotteryName === 'Toto') {
                totalToto += cost;
            } else if (lotteryName === 'Singapore Sweep') {
                totalSgSweep += cost;
            }
        });

        const totalAll = total4D + totalToto + totalSgSweep;

        document.getElementById('total-spend-4d').textContent = `$${total4D}`;
        document.getElementById('total-spend-toto').textContent = `$${totalToto}`;
        document.getElementById('total-spend-sg-sweep').textContent = `$${totalSgSweep}`;
        document.getElementById('total-spend-all').textContent = `$${totalAll}`;
    }

    function fetchPurchaseHistory(callback) {
        fetch('/get-purchase-history')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    purchaseHistoryData = data.data;
                    updateView();
                    updatePurchaseHistoryTotals();
                    if (callback) callback();
                } else {
                    console.error('Error retrieving purchase history:', data.message);
                }
            });
    }

    function fetchWinningHistory(callback) {
        fetch('/get-winnings')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    winningHistoryData = data.data;
                    populateWinningTable(winningHistoryData);
                    updateWinningsTotal();

                    if (callback) callback();
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
        updateButtonSelection('#sorting-menu button[data-filter]', this); // this = the button that was clicked
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
            row.setAttribute('data-id', 'purchase-' + record.record_id);
            row.innerHTML = `
                <td>${rowNumber}</td>
                <td>${record.lottery_name}</td>
                <td>${record.entry_type}</td>
                <td>${record.pick_type}</td>
                <td>${record.bet_amount}</td>
                <td>${record.outlet}</td>
                <td>${record.number_of_boards}</td>
                <td>$${record.cost}</td>
                <td class="date-with-edit">
                    <div class="table-date-cell" style="display: flex; justify-content: space-evenly">
                        <span class="date-text">${formatDateToLocalDateString(record.date_of_entry)}</span>
                        <button class="edit-btn" title="Edit this entry">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                    <input type="date" class="date-input" value="${formatDateToLocalDateString(record.date_of_entry)}" style="display:none; width:100%">
                    <div style="display: flex; justify-content: space-evenly">
                        <button class="confirm-btn" style="display:none;">Save</button>
                        <button class="cancel-btn" style="display:none;">Cancel</button>
                    </div>
                </td>
                <td>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        updatePurchaseHistoryTotals();
        updatePaginationControls();
    }

    function populateWinningTable(winnings) {
        const tableBody = document.querySelector('#winnings-history-table tbody');
        tableBody.innerHTML = '';

        if (!winnings.length) {
            tableBody.innerHTML = '<tr class="no-entry-row"><td colspan="8">No winnings added.</td></tr>';
            return;
        }

        winnings.forEach((winning, index) => {
            const row = document.createElement('tr');
            const rowNumber = index + 1;
            row.setAttribute('data-id', 'winning-' + winning.winning_id); // Assuming winnings have an ID attribute. If not, adjust accordingly.
            row.innerHTML = `
                <td>${rowNumber}</td>
                <td>${winning.lottery_name}</td>
                <td>${winning.entry_type}</td>
                <td>${winning.pick_type}</td>
                <td>${winning.outlet}</td>
                <td>$${winning.winning_prize}</td>
                <td>${formatDateToLocalDateString(winning.date_of_winning)}</td>
                <td>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        updateWinningsTotal();
    }

    function formatDateToLocalDateString(dateString) {
        const date = new Date(dateString);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
        const day = String(date.getUTCDate()).padStart(2, '0');
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
                showSuccessEffect('Purchase deleted!');
                purchaseHistoryData = purchaseHistoryData.filter(item => item.record_id !== parseInt(recordId));
                filteredAndSortedData = filteredAndSortedData.filter(item => item.record_id !== parseInt(recordId));

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

                winningHistoryData = winningHistoryData.filter(item => item.winning_id !== parseInt(recordId));
                populateWinningTable(winningHistoryData);
                updateWinningsTotal();
                return true;
            })
            .catch(error => {
                console.error('Error:', error);
                return false;
            });
    }

    function editPurchase(recordId, newDate) {
        return fetch(`/edit-purchase/${recordId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date_of_entry: newDate })
        })
            .then(response => response.json())
            .then(data => {
                if (!data.success) throw new Error(data.message);
                showSuccessEffect('Purchase edited!');
                return true;
            })
            .catch(error => {
                console.error('Error:', error);
                return false;
            });
    }
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

    function checkButtonVisibility(type) {
        const container = document.getElementById(`image-container-${type}`);
        const prevBtn = document.getElementById(`prevBtn-${type}`);
        const nextBtn = document.getElementById(`nextBtn-${type}`);

        // Hide the "previous" button if we're at the start
        if (container.scrollLeft <= 0) {
            prevBtn.style.visibility = 'hidden';
        } else {
            prevBtn.style.visibility = 'visible';
        }

        // Hide the "next" button if we're at the end
        // if (container.scrollWidth - container.scrollLeft <= container.clientWidth) {
        const buffer = 5; // You can adjust this value based on your needs

        if (container.scrollWidth - container.scrollLeft - buffer <= container.clientWidth) {
            nextBtn.style.visibility = 'hidden';
        } else {
            nextBtn.style.visibility = 'visible';
        }
    }

    function getCookie(name) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

});


// function setUpTableListener(tableSelector, options = {}) {
//     document.querySelector(tableSelector + " tbody").addEventListener('click', function (event) {
//         if (event.target.classList.contains('delete-btn') || event.target.closest('.delete-btn')) {
//             const message = options.confirmMessage || 'Are you sure you want to delete this entry?';
//             const shouldDelete = confirm(message);
//             if (shouldDelete) {
//                 const row = event.target.closest('tr');
//                 const tableBody = document.querySelector(tableSelector + " tbody");
//                 if (options.serverDelete) {
//                     // const recordId = row.getAttribute('data-id').replace('purchase-', ''); // need to do for 'winning-' too
//                     const rowId = row.getAttribute('data-id').replace(options.rowType + '-', '');
//                     options.deleteMethod(rowId).then((success) => {
//                         if (success) {
//                             row.remove();
//                             // Check for empty table after row removal
//                             const tableBody = document.querySelector(tableSelector + " tbody");
//                             const colspan = options.colspan || 9;
//                             if (!tableBody.querySelector("tr:not(.no-entry-row)")) {
//                                 const noEntryRow = `<tr class="no-entry-row"><td colspan="${colspan}">No ${options.noDataText || 'entries'}.</td></tr>`;
//                                 tableBody.innerHTML = noEntryRow;
//                                 if (currentPage > 1) {
//                                     currentPage--; // Go back to the previous page if the current one is empty
//                                 }
//                                 displayPurchaseHistory(purchaseHistoryData);
//                             }
//                             updatePurchaseHistoryTotals();
//                             updatePaginationControls();
//                         } else {
//                             alert('Error deleting. Please try again later.');
//                         }
//                     });
//                 } else {
//                     row.remove();
//                     if (options.afterDelete) {
//                         options.afterDelete();
//                     }
//                     const rows = tableBody.querySelectorAll('tr:not(.no-entry-row)');
//                     rows.forEach((row, index) => {
//                         const firstCell = row.querySelector('td:first-child');
//                         firstCell.textContent = index + 1;
//                     });
//                     const colspan = options.colspan || 8;
//                     if (!tableBody.querySelector("tr:not(.no-entry-row)")) {
//                         const noEntryRow = `<tr class="no-entry-row"><td colspan="${colspan}">No ${options.noDataText || 'entries'}.</td></tr>`;
//                         tableBody.innerHTML = noEntryRow;
//                         updateButtonNeon(false, '#section-today-entry');
//                     }
//                 }
//             }
//         } else if (event.target.classList.contains('edit-btn') || event.target.closest('.edit-btn')) {
//             console.log('edit');
//             const td = event.target.closest('td');
//             const dateText = td.querySelector('.date-text');
//             const dateInput = td.querySelector('.date-input');
//             const confirmBtn = td.querySelector('.confirm-btn');
//             const cancelBtn = td.querySelector('.cancel-btn');

//             // Hide date text and show input and buttons
//             dateText.style.display = 'none';
//             dateInput.style.display = 'block';
//             confirmBtn.style.display = 'inline-block';
//             cancelBtn.style.display = 'inline-block';
//         }
//         else if (event.target.classList.contains('confirm-btn') || event.target.closest('.confirm-btn')) {
//             console.log('confirm');
//             const td = event.target.closest('td');
//             const dateText = td.querySelector('.date-text');
//             const dateInput = td.querySelector('.date-input');
//             const row = event.target.closest('tr');
//             const rowId = row.getAttribute('data-id').replace('purchase-', '');

//             // Update the date on the server
//             editPurchase(rowId, dateInput.value).then((success) => {
//                 if (success) {
//                     // Update the date text and hide input and buttons
//                     dateText.textContent = dateInput.value;
//                     dateText.style.display = 'block';
//                     dateInput.style.display = 'none';
//                     td.querySelector('.confirm-btn').style.display = 'none';
//                     td.querySelector('.cancel-btn').style.display = 'none';
//                 } else {
//                     alert('Error updating. Please try again later.');
//                 }
//             });
//         }
//         else if (event.target.classList.contains('cancel-btn') || event.target.closest('.cancel-btn')) {
//             console.log('cancel');
//             const td = event.target.closest('td');
//             const dateText = td.querySelector('.date-text');
//             const dateInput = td.querySelector('.date-input');

//             // Reset input value and hide input and buttons
//             dateInput.value = dateText.textContent;
//             dateText.style.display = 'block';
//             dateInput.style.display = 'none';
//             td.querySelector('.confirm-btn').style.display = 'none';
//             td.querySelector('.cancel-btn').style.display = 'none';
//         }
//     });
// }

// function checkForNoEntries(tableSelector, type, text) {
//     const tableBody = document.querySelector(tableSelector + " tbody");
//     if (!tableBody.querySelector("tr:not(.no-entry-row)")) {
//         const noEntryRow = `<tr class="no-entry-row"><td colspan="9">No ${text}.</td></tr>`;
//         tableBody.innerHTML = noEntryRow;
//     }
// }
