const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work!```

// This function will ask the user about their team members
function askQuestions() {
    let teams = [];

    inquirer
        .prompt([
            {
                name: "role",
                message: "What is your role?",
                type: "list",
                choices: ["Manager", "Intern", "Engineer"],
            },
            {
                name: "name",
                message: "What is your name?",
                type: "input",
            },
            {
                name: "id",
                message: "What is your id?",
                type: "input",
            },
            {
                name: "email",
                message: "What is your email?",
                type: "input",
            },
        ])
        .then((answers) => {
            let role = answers.role;

            let questions = [];

            if (role === "Manager") {
                // ask manager qs
                questions.push({
                    name: "office_number",
                    message: "What is your office number?",
                    type: "input",
                });
            }

            if (role === "Intern") {
                questions.push({
                    name: "school",
                    message: "What is your school?",
                    type: "input",
                });
            }

            if (role === "Engineer") {
                questions.push({
                    name: "github",
                    message: "What is your github username?",
                    type: "input",
                });
            }

            return { answers, questions };
        })
        .then(async ({ answers, questions }) => {
            await inquirer.prompt(questions).then((response) => {
                let role = answers.role;
                if (role === "Manager") {
                    teams.push(
                        new Manager(
                            answers.name,
                            answers.id,
                            answers.email,
                            response.office_number
                        )
                    );
                    console.log(teams);
                }

                if (role === "Intern") {
                    teams.push(
                        new Intern(
                            answers.name,
                            answers.id,
                            answers.email,
                            response.school
                        )
                    );
                }

                if (role === "Engineer") {
                    teams.push(
                        new Engineer(
                            answers.name,
                            answers.id,
                            answers.email,
                            response.github
                        )
                    );
                }
            });

            await inquirer.prompt([
                {
                    name: 'add_again',
                    message: 'Do you want to add more?',
                    type: 'confirm',
                }
            ]).then(answer => {
                if(answer.add_again){
                    askQuestions()
                }else{
                    let html = render(teams)

                    fs.writeFileSync('./output/team.html', html)
                }
            })
        });
}


askQuestions()