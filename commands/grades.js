const Discord = require("discord.js");
const superagent = require("superagent");

// !utd math 2413.004 fall
module.exports.run = async (bot, message, args) => {
  if (!args[0])
    return message.channel.send(
      "Error, enter subject name! `!utd <subject-name> <course-number>.<section> [fall/summer]`\nI know that is a long command here is an example\n`!utd math 2413.4 fall\n**NOTE**: For section numbers don't type '0' if it is in front. Ex: `004` should be `4`."
    );
  let subject = args[0];
  if (subject.length > 4)
    return message.channel.send(
      "Error, enter **VALID** subject! `!utd <subject-name> <course-number>.<section> [fall/summer]`\nI know that is a long command here is an example\n`!utd math 2413.4 fall\n**NOTE**: For section numbers don't type '0' if it is in front. Ex: `004` should be `4`."
    );
  subject = subject.toUpperCase();

  if (!args[1])
    return message.channel.send(
      "Error, enter course number and section! `!utd <subject-name> <course-number>.<section> [fall/summer]`\nI know that is a long command here is an example\n`!utd math 2413.4 fall\n**NOTE**: For section numbers don't type '0' if it is in front. Ex: `004` should be `4`."
    );
  let course = args[1];
  let courseCheck = checkCourse(course);
  if (!courseCheck)
    return message.channel.send(
      "Error, enter **VALID** course number and section! `!utd <subject-name> <course-number>.<section> [fall/summer]`\nI know that is a long command here is an example\n`!utd math 2413.4 fall\n**NOTE**: For section numbers don't type '0' if it is in front. Ex: `004` should be `4`."
    );
  course = course.split(".");
  if (!args[2])
    return message.channel.send(
      "Error, enter term! `!utd <subject-name> <course-number>.<section> [fall/summer]`\nI know that is a long command here is an example\n`!utd math 2413.4 fall\n**NOTE**: For section numbers don't type '0' if it is in front. Ex: `004` should be `4`."
    );
  let term = args[2].toLowerCase();

  if (term.charAt(0) == "f") term = term.replace("f", "F");
  else if (term.charAt(0) == "s") term = term.replace("s", "S");

  let data = await getData(subject, course, term);
  let gradeData = getGrades(data.grades);
  //prettier-ignore
  return message.channel.send(`**TERM** : ${data.term}\n**PROFESSOR** : ${data.prof}\n**COURSE NAME** : ${data.subject} ${data.course}.${data.section}\n\n${data.grades}`);

  async function getData(subject, course, term) {
    let { body } = await superagent
      .get(`https://utdgrades.com/static/complete.json`)
      .on("Error", err => {
        return message.channel.send(
          "Error occurred while retrieving grades. Try again. If this continues to occur, use the `!issue` command to report the problem."
        );
      });
    let courseData = await getCourseData(body, subject, course, term);
    let realTerm = courseData.term;
    let prof = courseData.prof;
    let realSubject = courseData.subj;
    let realCourse = courseData.num;
    let section = courseData.sect;
    let grades = courseData.grades;

    return {
      term: realTerm,
      prof: prof,
      subject: realSubject,
      course: realCourse,
      section: section,
      grades: grades
    };
  }

  async function getCourseData(body, subject, course, term) {
    console.log(term);
    let section = course[1];
    for (let i = body.length - 1; i >= 0; i--) {
      // console.log(i);
      if (body[i].term.includes(term)) {
        if (body[i].subj == subject) {
          if (body[i].num == course[0]) {
            if (body[i].sect == section) {
              return body[i];
            }
          }
        }
      }
    }
  }

  function getGrades(grades) {
    let grade = Object.keys(grades);
    let number = Object.values(grades);
  }

  function checkCourse(course) {
    let result = false;
    for (let i = 0; i < course.length; i++) {
      if (course.charAt(i) == ".") {
        result = true;
      }
    }
    return result;
  }
};

module.exports.help = {
  name: "utd"
};
