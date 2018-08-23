const Discord = require("discord.js");
const superagent = require("superagent");

// !utd math 2413.004 fall/spring
module.exports.run = async (bot, message, args) => {
  let subject = args[0].toUpperCase();

  let courseWithSection = args[1];
  courseWithSection = courseWithSection.split(".");

  let course = courseWithSection[0];
  let section = courseWithSection[1];
  let convertedSection = sectionConvert(section);

  let term = args[2];
  if (term.charAt(0) == "f") term = term.replace("f", "F");
  else if (term.charAt(0) == "s") term = term.replace("s", "S");

  let data = await getData(subject, course, section, convertedSection, term);
  message.channel.send(`**TERM** : ${data.term}\n**PROFESSOR** : ${data.prof}\n**COURSE NAME** : ${data.subject} ${data.course}.${data.section}`);
  let gradeData = getGrades(data.grades);

  async function getData(subject, course, section, convertedSection, term) {
    let { body } = await superagent.get(`https://utdgrades.com/static/complete.json`).on("error", err => {
      console.log(err);
    });

    let courseData = await findCourse(body, subject, course, section, convertedSection, term);

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

  function getGrades(grades) {
    let letterGrade = Object.keys(grades);
    let scoreGrade = Object.values(grades);
    for (let i = 0; i < Object.keys(grades).length; i++) {
      message.channel.send(`**${letterGrade[i]}** : ${scoreGrade[i]}`);
    }
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
