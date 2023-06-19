class Form {
  constructor(onSubmit) {
    this.onSubmit = onSubmit;
  }

  validate(input) {
    const errors = {};
    if (!input.subAccountName) {
      errors.subAccountName = 'Sub-account name is required';
    }
    if (!input.courseName) {
      errors.courseName = 'Course name is required';
    }
    if (!input.teacherFullName) {
      errors.teacherFullName = 'Teacher full name is required';
    }
    if (!input.teacherEmail) {
      errors.teacherEmail = 'Teacher email is required';
    }
    if (!input.studentFullName) {
      errors.studentFullName = 'Student full name is required';
    }
    if (!input.studentEmail) {
      errors.studentEmail = 'Student email is required';
    }
    return errors;
  }

  async submit(input) {
    const canvasAPI = new CanvasAPI(process.env.CANVAS_API_TOKEN);
    const dinopassAPI = new DinoPassAPI();

    const subAccount = await canvasAPI.createSubAccount(input.subAccountName);
    const course = await canvasAPI.createCourse(input.courseName, subAccount.id);

    const teacherPassword = await dinopassAPI.generatePassword();
    const teacher = await canvasAPI.createUser(input.teacherFullName, input.teacherEmail, teacherPassword);
    await canvasAPI.enrollUser(course.id, teacher.id, 'teacher');

    const studentPassword = await dinopassAPI.generatePassword();
    const student = await canvasAPI.createUser(input.studentFullName, input.studentEmail, studentPassword);
    await canvasAPI.enrollUser(course.id, student.id, 'student');

    this.onSubmit({
      subAccount,
      course,
      teacher: {
        fullName: input.teacherFullName,
        email: input.teacherEmail,
        password: teacherPassword,
      },
      student: {
        fullName: input.studentFullName,
        email: input.studentEmail,
        password: studentPassword,
      },
    });
  }
}

module.exports = Form;
