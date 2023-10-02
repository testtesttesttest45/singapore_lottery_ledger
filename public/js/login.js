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

    // Logic for user button actions
    const userButtons = document.querySelectorAll('.user-button');
    const userList = document.querySelector('.user-list');
    const loginInput = document.querySelector('.login-input');
    const backButton = document.getElementById('back-btn');
    const loginButton = document.getElementById('login-btn');
    const loginHeading = document.getElementById('login-heading');

    userButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const userName = btn.querySelector('.user-name').textContent;

            loginHeading.textContent = `Login as ${userName}`;

            userList.style.display = 'none';

            loginInput.style.display = 'block';

            backButton.style.display = 'block';
        });
    });

    backButton.addEventListener('click', function () {
        loginHeading.textContent = 'Login as';
        userList.style.display = 'block';
        loginInput.style.display = 'none';
        backButton.style.display = 'none';
    });

    // Redirect to index.html on login button click
    loginButton.addEventListener('click', function () {
        window.location.href = 'index.html';
    });

    const registerButton = document.getElementById('register-btn');

    registerButton.addEventListener('click', function() {
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

        fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message, 'Please login to continue.');
            location.reload();
        })
        .catch(err => {
            console.error('Error:', err);
            alert('There was an error. Please try again later.');
        });
    });
});
