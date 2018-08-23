const Discord = require("discord.js");
const superagent = require("superagent");

// !utd math 2413.004 fall/spring
module.exports.run = async (bot, message, args) => {
  if (!args[0])
    return message.channel.send("Specify a subject!\n`!utd <subject> [course] {fall/spring}`\nFor Example: `!utd math 2413.004 fall`");

  let subject = args[0].toUpperCase();

  if (!args[1])
    return message.channel.send("Specify a course!\n`!utd <subject> [course] {fall/spring}`\nFor Example: `!utd math 2413.004 fall`");

  if (!args[1].includes("."))
    return message.channel.send("Specify course in correct format! Check Example.\n`!utd <subject> [course] {fall/spring}`\nFor Example: `!utd math 2413.004 fall`");

  let courseWithSection = args[1];
  courseWithSection = courseWithSection.split(".");

  let course = courseWithSection[0];
  let section = courseWithSection[1];
  let convertedSection = sectionConvert(section);

  if (!args[2])
    return message.channel.send("Specify a term!\n`!utd <subject> [course] {fall/spring}`\nFor Example: `!utd math 2413.004 fall`");

  let term = args[2];

  if (term.includes("fall") || term.includes("spring")) {
    if (term.charAt(0) == "f") term = term.replace("f", "F");
    else if (term.charAt(0) == "s") term = term.replace("s", "S");
  }
  else {
    return message.channel.send("Specify a valid term! Check Example.\n`!utd <subject> [course] {fall/spring}`\nFor Example: `!utd math 2413.004 fall`");
  }

  let data = await getData(subject, course, section, convertedSection, term);

  message.channel.send(`**TERM** : ${data.term}\n**PROFESSOR** : ${data.prof}\n**COURSE NAME** : ${data.subject} ${data.course}.${data.section}`);

  let gradeData = getGrades(data.grades);
  return message.channel.send(gradeData);

  async function getData(subject, course, section, convertedSection, term) {
    let { body } = await superagent.get(`https://utdgrades.com/static/complete.json`).on("error", err => {
      return message.channel.send("**Whoops**, Error retrieving grades! Try again. If the problem still continues report the issue [here](https://github.com/KannaDev/UTDsearch/issues) command or type `@.kanna#9908` and explain your issue.");
    });

    let courseData = await findCourse(body, subject, course, section, convertedSection, term);
    if (typeof courseData == 'undefined') {
      return message.channel.send("Check your syntax! Make sure you follow the example. `!utd math 2413.004 fall`");
    }
    else {
      let officialTerm = courseData.term;
      let officialSubject = courseData.subj;
      let officialCourse = courseData.num;
      let officialSection = courseData.sect;
      let officialProf = courseData.prof;
      let grades = courseData.grades;

      return {
        term: officialTerm,
        subject: officialSubject,
        course: officialCourse,
        section: officialSection,
        prof: officialProf,
        grades: grades
      };
    }
  }

  function getGrades(grades) {
    let letterGrade = Object.keys(grades);
    let scoreGrade = Object.values(grades);
    let grade = [];
    for (let i = 0; i < Object.keys(grades).length; i++) {
      grade.push(`**${letterGrade[i]}** : ${scoreGrade[i]}`);
    }
    return grade;
  }

  async function findCourse(body, subject, course, section, convertedSection, term) {
    for (let i = body.length - 1; i >= 0; i--) {
      if (body[i].term.includes(term)) {
        if (body[i].subj == subject) {
          if (body[i].num == course) {
            if (body[i].sect == section) {
              return body[i];
            }
            else if (body[i].sect == convertedSection) {
              return body[i];
            }
          }
        }
      }
    }
  }

  function sectionConvert(num) {
    return num.replace(/^0*(.*)$/, "$1");
  }
};

module.exports.help = {
  name: "utd"
};
