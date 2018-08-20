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
    let results = [];

    //LOGIC ERROR
    if (grade[0] == "A+") {
      results.push(grade[0]);
      results.push(number[0]);
    } else {
      results.push("A+");
      results.push("0");
    }
    if (grade[1] == "A") {
      results.push(grade[1]);
      results.push(number[1]);
    } else {
      results.push("A");
      results.push("0");
    }
    if (grade[2] == "A-") {
      results.push(grade[2]);
      results.push(number[2]);
    } else {
      results.push("A-");
      results.push("0");
    }
    if (grade[3] == "B+") {
      results.push(grade[3]);
      results.push(number[3]);
    } else {
      results.push("B+");
      results.push("0");
    }
    if (grade[4] == "B") {
      results.push(grade[4]);
      results.push(number[4]);
    } else {
      results.push("B");
      results.push("0");
    }
    if (grade[5] == "B-") {
      results.push(grade[5]);
      results.push(number[5]);
    } else {
      results.push("B-");
      results.push("0");
    }
    if (grade[6] == "C+") {
      results.push(grade[6]);
      results.push(number[6]);
    } else {
      results.push("C+");
      results.push("0");
    }
    if (grade[7] == "C") {
      results.push(grade[7]);
      results.push(number[7]);
    } else {
      results.push("C");
      results.push("0");
    }
    if (grade[8] == "C-") {
      results.push(grade[8]);
      results.push(number[8]);
    } else {
      results.push("C-");
      results.push("0");
    }
    if (grade[9] == "D+") {
      results.push(grade[9]);
      results.push(number[9]);
    } else {
      results.push("D+");
      results.push("0");
    }
    if (grade[10] == "D") {
      results.push(grade[10]);
      results.push(number[10]);
    } else {
      results.push("D");
      results.push("0");
    }
    if (grade[11] == "D-") {
      results.push(grade[0]);
      results.push(number[0]);
    } else {
      results.push("A+");
      results.push("0");
    }
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
