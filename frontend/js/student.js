
const token = localStorage.getItem('token');

if (!token) {
    window.location.href = 'index.html';
}

// Load student profile
$.ajax({
    url: '/api/auth/me',
    method: 'GET',
    headers: {
        Authorization: 'Bearer ' + token
    },

    success: function(user) {
        if (user.role !== 'student') {
            window.location.href = 'admin.html';
            return;
        }

        $('#studentName').text(user.full_name);
        $('#studentEmail').text(user.email);
    },

    error: function() {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    }
});

// Load courses
function loadCourses() {
    $.ajax({
        url: '/api/courses',
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + token
        },

        success: function(courses) {
            $('#courseList').empty();

            courses.forEach(function(course) {
                $('#courseList').append(`
                    <div class="course-card">
                        <h3>${$('<div>').text(course.course_name).html()}</h3>
                        <p><b>Code:</b> ${$('<div>').text(course.course_code).html()}</p>
                        <p><b>Instructor:</b> ${$('<div>').text(course.instructor).html()}</p>
                        <p><b>Credit Hours:</b> ${course.credit_hours}</p>
                        <p>${$('<div>').text(course.description || '').html()}</p>
                    </div>
                `);
            });
        },

        error: function() {
            alert('Unable to load courses. Please login again.');
        }
    });
}

loadCourses();

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}
