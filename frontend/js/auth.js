
const API = '/api';

// REGISTRATION
$('#registerForm').on('submit', function(e) {
    e.preventDefault();

    const userData = {
        full_name: $('#full_name').val().trim(),
        email: $('#reg_email').val().trim(),
        password: $('#reg_password').val()
    };

    $.ajax({
        url: API + '/auth/register',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(userData),

        success: function(response) {
            $('#message').text(response.message).css('color', 'green');

            setTimeout(function() {
                window.location.href = 'index.html';
            }, 1500);
        },

        error: function(xhr) {
            $('#message').text(
                xhr.responseJSON?.message || 'Registration failed'
            ).css('color', 'red');
        }
    });
});

// LOGIN
$('#loginForm').on('submit', function(e) {
    e.preventDefault();

    const loginData = {
        email: $('#email').val().trim(),
        password: $('#password').val()
    };

    $.ajax({
        url: API + '/auth/login',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(loginData),

        success: function(response) {
            localStorage.setItem('token', response.token);

            if (response.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'student.html';
            }
        },

        error: function(xhr) {
            $('#message').text(
                xhr.responseJSON?.message || 'Login failed'
            ).css('color', 'red');
        }
    });
});
