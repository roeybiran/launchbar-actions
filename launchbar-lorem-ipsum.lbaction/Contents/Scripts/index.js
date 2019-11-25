"use strict";

// https://cdn.rawgit.com/Marak/faker.js/master/examples/browser/index.html#lorem
// https://github.com/Marak/Faker.js

let input = process.argv[2];

if (!input || input === "0") {
  input = "1";
}

if (input.match(/\W|[a-zA-Z]/)) {
  console.log(
    JSON.stringify([
      {
        title: "Invalid input",
        subtitle: "Must consist of numbers only",
        url: "x-launchbar:hide",
        icon: "font-awesome:warning"
      }
    ])
  );
  process.exit();
}

const fakerDataTypes = [
  { title: "Full Name(s)", args: ["name", "findName"] },
  { title: "First Name(s)", args: ["name", "firstName"] },
  { title: "Sentence(s)", args: ["lorem", "sentence"] },
  { title: "Paragraph(s)", args: ["lorem", "paragraph"] },
  { title: "Words(s)", args: ["lorem", "word"] },
  { title: "Email Address(es)", args: ["internet", "email"] },
  { title: "Phone Number(s)", args: ["phone", "phoneNumberFormat"] },
  { title: "Product Name(s)", args: ["commerce", "product"] }
];

const output = fakerDataTypes.map(fakeData => {
  return {
    title: `${input} ${fakeData.title}`,
    count: input,
    args: fakeData.args,
    action: "choice.sh"
  };
});

console.log(JSON.stringify(output));
