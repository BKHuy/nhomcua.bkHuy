$(document).ready(function() {
    let classes = [];

    // Load classes and students from data.json
    function loadClasses() {
        $.ajax({
            url: 'data.json',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                classes = data.classes;
                populateClassSelect();
            },
            error: function() {
                alert('Không thể tải dữ liệu từ file data.json.');
            }
        });
    }

    // Populate the class dropdown list
    function populateClassSelect() {
        $('#classSelect').empty();
        classes.forEach((cls, index) => {
            $('#classSelect').append(`<option value="${index}">${cls.className}</option>`);
        });
        $('#classSelect').trigger('change');
    }

    // Display students in the selected class
    function displayStudents(classIndex) {
        const students = classes[classIndex].students;
        const studentTableBody = $('#studentTableBody');
        studentTableBody.empty();
        students.forEach((student, index) => {
            studentTableBody.append(`
                <tr>
                    <td class="p-2">${student.studentId}</td>
                    <td class="p-2">${student.fullName}</td>
                    <td class="p-2">${student.dateOfBirth}</td>
                    <td class="p-2">
                        <button class="editBtn bg-yellow-500 text-white p-2 rounded mr-2" data-index="${index}" data-class-index="${classIndex}">Sửa</button>
                        <button class="deleteBtn bg-red-500 text-white p-2 rounded" data-index="${index}" data-class-index="${classIndex}">Xóa</button>
                    </td>
                </tr>
            `);
        });
    }

    // Show modal for adding/editing student
    function showStudentModal(isEdit, student = {}, classIndex = -1, studentIndex = -1) {
        $('#modalTitle').text(isEdit ? 'Sửa sinh viên' : 'Thêm sinh viên');
        $('#studentId').val(student.studentId || '');
        $('#fullName').val(student.fullName || '');
        $('#dateOfBirth').val(student.dateOfBirth || '');
        $('#studentModal').data('isEdit', isEdit).data('classIndex', classIndex).data('studentIndex', studentIndex).removeClass('hidden');
    }

    // Hide modal
    function hideStudentModal() {
        $('#studentModal').addClass('hidden');
    }

    // Add or edit student
    $('#studentForm').submit(function(event) {
        event.preventDefault();
        const isEdit = $('#studentModal').data('isEdit');
        const classIndex = $('#studentModal').data('classIndex');
        const studentIndex = $('#studentModal').data('studentIndex');
        const student = {
            studentId: $('#studentId').val(),
            fullName: $('#fullName').val(),
            dateOfBirth: $('#dateOfBirth').val()
        };

        if (validateStudent(student)) {
            if (isEdit) {
                classes[classIndex].students[studentIndex] = student;
            } else {
                classes[classIndex].students.push(student);
            }
            saveData();
            hideStudentModal();
        } else {
            alert('Vui lòng nhập đầy đủ thông tin.');
        }
    });

    // Validate student data
    function validateStudent(student) {
        return student.studentId && student.fullName && student.dateOfBirth;
    }

    // Save data to JSON file (simulated by AJAX)
    function saveData() {
        // In a real-world scenario, you'd send data to the server here
        // For the demo purpose, just update the table
        displayStudents($('#classSelect').val());
        // Simulating AJAX saving data by just console logging the new data
        console.log(JSON.stringify({ classes: classes }));
    }

    // Delete student
    $(document).on('click', '.deleteBtn', function() {
        const classIndex = $(this).data('class-index');
        const studentIndex = $(this).data('index');
        if (confirm('Bạn có chắc muốn xóa sinh viên này?')) {
            classes[classIndex].students.splice(studentIndex, 1);
            saveData();
        }
    });

    // Edit student
    $(document).on('click', '.editBtn', function() {
        const classIndex = $(this).data('class-index');
        const studentIndex = $(this).data('index');
        const student = classes[classIndex].students[studentIndex];
        showStudentModal(true, student, classIndex, studentIndex);
    });

    // Add student button click
    $('#addStudentBtn').click(function() {
        showStudentModal(false, {}, $('#classSelect').val());
    });

    // Cancel button click
    $('#cancelBtn').click(function() {
        hideStudentModal();
    });

    // Class select change event
    $('#classSelect').change(function() {
        displayStudents($(this).val());
    });

    // Initial load
    loadClasses();
});
