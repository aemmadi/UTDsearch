const Discord = require("discord.js");
const superagent = require("superagent");

// !utd math 2413.004 fall/spring
module.exports.run = async (bot, message, args) => {
  let subject = args[0].toUpperCase();

  let courseWithSection = args[1];
  courseWithSection.split(".");

  let course = courseWithSection[0];

  let section = courseWithSection[1];
  let convertedSection = sectionConvert(section);

  let term = args[2];
  if (term.charAt(0) == "f") term = term.replace("f", "F");
  else if (term.charAt(0) == "s") term = term.replace("s", "S");

  let data = await getData(subject, course, section, convertedSection, term);
  let gradeData = await getGrades(data.grades);

  async function getData(subject, course, section, convertedSection, term) {
    let { body } = await superagent.get(`https://utdgrades.com/static/complete.json`).on("error", err => {
      console.log(err);
    });

    let courseData = await findCourse(body, subject, course, section, convertedSection, term);

    let officialTerm = courseData.term;
    let officialSubject = courseData.subj;
    let officialCourse = courseData.num;
    let officialSection = courseData.sect;
    let grades = courseData.grades;

    return {
      term: officialTerm,
      subject: officialSubject,
      course: officialCourse,
      section: officialSection,
      grades: grades
    };
  }

  async function getGrades(grades) {
    //LOGIC FOR GETTING GRADES?
  }

  async function findCourse(body, subject, course, section, convertedSection, term) {
    for (let i = body.length - 1; i >= 0; i++) {
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
