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
    const userButtons = document.querySelectorAll('.user-button');
    const userList = document.querySelector('.user-list');
    const loginInput = document.querySelector('.login-input');
    const backButton = document.getElementById('back-btn');
    const loginButton = document.getElementById('login-btn');
    const loginHeading = document.getElementById('login-heading');

    userButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const userName = btn.querySelector('.user-name').textContent;

            // Update the heading
            loginHeading.textContent = `Login as ${userName}`;

            // Hide the user list
            userList.style.display = 'none';

            // Show the login input
            loginInput.style.display = 'block';

            // Show the back button
            backButton.style.display = 'block';
        });
    });

    // Revert to initial state on back button click
    backButton.addEventListener('click', function () {
        loginHeading.textContent = 'Login as';  // Reset the heading
        userList.style.display = 'block';
        loginInput.style.display = 'none';
        backButton.style.display = 'none';
    });

    // Redirect to index.html on login button click
    loginButton.addEventListener('click', function () {
        window.location.href = 'index.html';
    });
});
