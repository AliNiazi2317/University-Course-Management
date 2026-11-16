
const adminToken = localStorage.getItem('token');

if (!adminToken) {
    window.location.href = 'index.html';
}

// Check admin access
$.ajax({
    url: '/api/auth/me',
    method: 'GET',
    headers: {
        Authorization: 'Bearer ' + adminToken
    },

    success: function(user) {
        if (user.role !== 'admin') {
            alert('Admin access only!');
            window.location.href = 'student.html';
            return;
        }

        $('#adminEmail').text(user.email);
        loadCourses();
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
            Authorization: 'Bearer ' + adminToken
        },

        success: function(courses) {
            $('#courseList').empty();

            courses.forEach(function(course) {
                const name = $('<div>').text(course.course_name).html();
                const code = $('<div>').text(course.course_code).html();
                const instructor = $('<div>').text(course.instructor).html();
                const description = $('<div>').text(course.description || '').html();

                $('#courseList').append(`
                    <div class="course-card">
                        <h3>${name}</h3>
                        <p>Code: ${code}</p>
                        <p>Instructor: ${instructor}</p>
                        <p>Credit Hours: ${course.credit_hours}</p>
                        <p>${description}</p>

                        <button onclick="editCourse(${course.id})">
                            Edit
                        </button>

                        <button onclick="deleteCourse(${course.id})">
                            Delete
                        </button>
                    </div>
                `);
            });
        }
    });
}

// Add course
$('#courseForm').on('submit', function(e) {
    e.preventDefault();

    const course = {
        course_name: $('#course_name').val().trim(),
        course_code: $('#course_code').val().trim(),
        instructor: $('#instructor').val().trim(),
        credit_hours: Number($('#credit_hours').val()),
        description: $('#description').val().trim()
    };

    $.ajax({
        url: '/api/courses',
        method: 'POST',
        contentType: 'application/json',
        headers: {
            Authorization: 'Bearer ' + adminToken
        },
        data: JSON.stringify(course),

        success: function(response) {
            $('#message').text(response.message).css('color', 'green');
            $('#courseForm')[0].reset();
            loadCourses();
        },

        error: function(xhr) {
            $('#message').text(
                xhr.responseJSON?.message || 'Unable to add course'
            ).css('color', 'red');
        }
    });
});

// Edit course
function editCourse(id) {
    $.ajax({
        url: '/api/courses',
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + adminToken
        },

        success: function(courses) {
            const course = courses.find(c => c.id === id);

            if (!course) return;

            const name = prompt('Course Name:', course.course_name);
            if (name === null) return;

            const code = prompt('Course Code:', course.course_code);
            if (code === null) return;

            const instructor = prompt('Instructor:', course.instructor);
            if (instructor === null) return;

            const hours = prompt('Credit Hours (1-6):', course.credit_hours);
            if (hours === null) return;

            const description = prompt('Description:', course.description || '');
            if (description === null) return;

            const updatedCourse = {
                course_name: name.trim(),
                course_code: code.trim(),
                instructor: instructor.trim(),
                credit_hours: Number(hours),
                description: description.trim()
            };

            $.ajax({
                url: '/api/courses/' + id,
                method: 'PUT',
                contentType: 'application/json',
                headers: {
                    Authorization: 'Bearer ' + adminToken
                },
                data: JSON.stringify(updatedCourse),

                success: function(response) {
                    alert(response.message);
                    loadCourses();
                },

                error: function(xhr) {
                    alert(xhr.responseJSON?.message || 'Update failed');
                }
            });
        }
    });
}

// Delete course
function deleteCourse(id) {
    if (!confirm('Are you sure you want to delete this course?')) {
        return;
    }

    $.ajax({
        url: '/api/courses/' + id,
        method: 'DELETE',
        headers: {
            Authorization: 'Bearer ' + adminToken
        },

        success: function(response) {
            alert(response.message);
            loadCourses();
        },

        error: function(xhr) {
            alert(xhr.responseJSON?.message || 'Delete failed');
        }
    });
}

// Logout
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}
