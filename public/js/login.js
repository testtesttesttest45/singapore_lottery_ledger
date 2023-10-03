document.addEventListener('DOMContentLoaded', function () {

    // Logic for toggling forms
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

    const userList = document.querySelector('.user-list');
    const loginInput = document.querySelector('.login-input');
    const backButton = document.getElementById('back-btn');
    const loginButton = document.getElementById('login-btn');
    const loginHeading = document.getElementById('login-heading');

    // Logic for user button actions
    fetch('/users')
        .then(response => response.json())
        .then(users => {
            users.forEach(user => {
                const userButton = document.createElement('button');
                userButton.classList.add('user-button');
                userButton.innerHTML = `<span class="user-name" data-full-name="${user.full_name}">${user.username}</span>`;
                userList.appendChild(userButton);
            });
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });

        document.addEventListener('click', function (event) {
            if (event.target && (event.target.classList.contains('user-button') || event.target.classList.contains('user-name'))) {
                
                // Determine the relevant element to fetch data from:
                const userNameElement = event.target.classList.contains('user-name') ? event.target : event.target.querySelector('.user-name');
                
                if (!userNameElement) return; // In case there's no such element, exit.
        
                const userName = userNameElement.textContent;
                const fullName = userNameElement.getAttribute('data-full-name');
                loginHeading.textContent = `Login as ${fullName}`;
        
                // Set the username input's value to the clicked username
                document.getElementById('login-username').value = userName;
        
                userList.style.display = 'none';
                loginInput.style.display = 'block';
                backButton.style.display = 'block';
            }
        });
        

    backButton.addEventListener('click', function () {
        loginHeading.textContent = 'Login as';
        userList.style.display = 'grid';
        loginInput.style.display = 'none';
        backButton.style.display = 'none';
    });

    // Redirect to index.html on login button click
    loginButton.addEventListener('click', function () {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Logged in successfully.') {
                    setTimeout(() => {
                        showSuccessEffect('Logged in successfully.');
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 1500);
                    });
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error logging in:', error);
                alert('Error logging in. Please try again.');
            });
    });

    const registerButton = document.getElementById('register-btn');
    registerButton.addEventListener('click', function () {
        const fullName = document.getElementById('register-fullname').value;
        const firstDayBetting = document.getElementById('first-day-betting').value;
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        const userData = {
            full_name: fullName,
            username: username,
            password: password,
            first_day_betting: firstDayBetting,
        };

        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);  // Removed extra argument
                location.reload();
            })
            .catch(err => {
                console.error('Error:', err);
                alert('There was an error. Please try again later.');
            });
    });
});

let isAnimating = false;
let timeouts = [];

function clearExistingTimeouts() {
    for (let timeout of timeouts) {
        clearTimeout(timeout);
    }
    timeouts = [];
}

function showSuccessEffect(message) {
    if (isAnimating) return;

    isAnimating = true;
    clearExistingTimeouts();

    const successElement = document.getElementById('success-message');
    const tickElement = successElement.querySelector('.tick-wrapper');
    const successTextElement = successElement.querySelector('.success-text');

    successElement.classList.remove('hidden');
    timeouts.push(setTimeout(() => {
        tickElement.style.transform = 'scale(1)';
        successTextElement.style.opacity = '1';
        successTextElement.innerText = message;
    }, 100));

    document.body.classList.add('effect-active');
    timeouts.push(setTimeout(() => {
        document.body.classList.remove('effect-active');
    }, 500));

    timeouts.push(setTimeout(() => {
        tickElement.style.transform = 'scale(0)';
        successTextElement.style.opacity = '0';
        timeouts.push(setTimeout(() => {
            successElement.classList.add('hidden');
            isAnimating = false;
        }, 700));
    }, 1000));
}
