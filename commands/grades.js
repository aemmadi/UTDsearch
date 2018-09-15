const Discord = require("discord.js");
const superagent = require("superagent");

// !math 2413.004 fall/spring
module.exports.run = async (bot, message, args) => {
  //Checks if subject is provided
  if (!args[0])
    return message.channel.send("Specify a subject!\n`!<subject> [course] {fall/spring/summer}`\nFor Example: `!math 2413.004 fall`");

  let subject = args[0].slice(1).toUpperCase(); //uppercases the subject for API. math --> MATH

  //Checks if course is provided
  if (!args[1])
    return message.channel.send("Specify a course!\n`!<subject> [course] {fall/spring/summer}`\nFor Example: `!math 2413.004 fall`");

  //Checks id section is provided
  if (!args[1].includes("."))
    return message.channel.send("Specify course in correct format! Check Example.\n`!<subject> [course] {fall/spring/summer}`\nFor Example: `!math 2413.004 fall`");

  let courseWithSection = args[1];
  courseWithSection = courseWithSection.split("."); //Splits course number and section

  let course = courseWithSection[0]; //Course
  let section = courseWithSection[1]; //Section

  let convertedSection = sectionConvert(section); //Formats the section number for API

  //Checks if term is provided
  if (!args[2])
    return message.channel.send("Specify a term!\n`!<subject> [course] {fall/spring/summer}`\nFor Example: `!math 2413.004 fall`");

  let term = args[2].toLowerCase(); //Term

  //Capitalizes the first letter in the term for API
  if (term.includes("fall") || term.includes("spring") || term.includes("summer")) {
    if (term.charAt(0) == "f") term = term.replace("f", "F");
    else if (term.charAt(0) == "s") term = term.replace("s", "S");
  }
  else {
    return message.channel.send("Specify a valid term! Check Example.\n`!<subject> [course] {fall/spring/summer}`\nFor Example: `!math 2413.004 fall`");
  }

  // console.log(subject)
  // console.log(course)
  // console.log(section)
  // console.log(convertedSection)
  // console.log(term)
  let data = await getData(subject, course, section, convertedSection, term); //Calls API

  message.channel.send(`**TERM** : ${data.term}\n**PROFESSOR** : ${data.prof}\n**COURSE NAME** : ${data.subject} ${data.course}.${data.section}`); //Sends course stats

  let gradeData = getGrades(data.grades); //Gets grades for course
  return message.channel.send(gradeData); //Sends grades

  async function getData(subject, course, section, convertedSection, term) {
    //API Calling
    let { body } = await superagent.get(`https://utdgrades.com/static/complete.json`).on("error", err => {
      return message.channel.send("**Whoops**, Error retrieving grades! Try again. If the problem still continues report the issue [here](https://github.com/KannaDev/UTDsearch/issues).");
    });

    let courseData = await findCourse(body, subject, course, section, convertedSection, term); //Searches the API for the required course

    if (typeof courseData == 'undefined') {
      return message.channel.send("Check your syntax! Make sure you follow the example. `!math 2413.004 fall`");
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
    let letterGrade = Object.keys(grades); //A+, A, A-, B+, B, .....
    let scoreGrade = Object.values(grades); //44, 10, 9, 14, 8, ....
    let grade = [];

    for (let i = 0; i < Object.keys(grades).length; i++) {
      grade.push(`**${letterGrade[i]}** : ${scoreGrade[i]}`); //Gets grades and adds to array
    }
    return grade;
  }

  async function findCourse(body, subject, course, section, convertedSection, term) {
    for (let i = body.length - 1; i >= 0; i--) {
      //Checks for correct term
      if (body[i].term.includes(term)) {
        //Checks for correct subject
        if (body[i].subj == subject) {
          //Checks for correct course number
          if (body[i].num == course) {
            //Checks for correct section number
            if (body[i].sect == section) {
              return body[i]; //Send found course
            }
            else if (body[i].sect == convertedSection) {
              return body[i]; //Send found course
            }
          }
        }
      }
    }
  }

  function sectionConvert(num) {
    return num.replace(/^0*(.*)$/, "$1"); //Replaces 0's before numbers. EX: 040 --> 40 or 004 --> 4
  }
};

module.exports.help = {
  subject: ['ap',
    'arab',
    'arts',
    'chin',
    'crwt',
    'danc',
    'film',
    'fren',
    'germ',
    'hist',
    'huma',
    'lit',
    'phil',
    'rhet',
    'span',
    'musi',
    'japn',
    'ahst',
    'huhi',
    'comm',
    'husl',
    'huas',
    'arhm',
    'cldp',
    'nsc',
    'psy',
    'spau',
    'acn',
    'aud',
    'comd',
    'hcs',
    'hdcd',
    'psyc',
    'cgs',
    'msen',
    'ee',
    'ce',
    'eeop',
    'eerf',
    'eegr',
    'eemf',
    'eesc',
    'eect',
    'engr',
    'cs',
    'se',
    'ecs',
    'mech',
    'eedg',
    'eepe',
    'bmen',
    'eecs',
    'te',
    'sysm',
    'ecsc',
    'crim',
    'econ',
    'pa',
    'geog',
    'soc',
    'gisc',
    'psci',
    'epps',
    'govt',
    'ipec',
    'envr',
    'pppe',
    'ams',
    'bis',
    'ed',
    'gst',
    'hlth',
    'phin',
    'isis',
    'mais',
    'hons',
    'mis',
    'bps',
    'entp',
    'fin',
    'hmgt',
    'meco',
    'mkt',
    'ob',
    'opre',
    'ims',
    'acct',
    'blaw',
    'obhr',
    'real',
    'bcom',
    'mas',
    'itss',
    'rmis',
    'buan',
    'engy',
    'chem',
    'biol',
    'geos',
    'math',
    'stat',
    'phys',
    'nats',
    'sci',
    'smed',
    'acts',
    'isns',
    'univ',
    'ba',
    'thea',
    'atcm',
    'mthe']
};
