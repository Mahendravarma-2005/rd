const fs = require('fs');
const filePath = 'c:/Users/mahen/OneDrive/Desktop/rd/MODIFIED_FILES.txt';
let content = fs.readFileSync(filePath, 'utf8');

const entry93 = `93. [Project Proposals Management (ProjectPi)\\public\\ (index.html, styles.css, app.js)]
   Absolute Paths:
     - c:\\Users\\mahen\\OneDrive\\Desktop\\rd\\ProjectPi\\public\\index.html
     - c:\\Users\\mahen\\OneDrive\\Desktop\\rd\\ProjectPi\\public\\styles.css
     - c:\\Users\\mahen\\OneDrive\\Desktop\\rd\\ProjectPi\\public\\app.js
   Status: MODIFIED
   Summary of Modifications:
     - "Task 1 (Remove Switch PI Button): Removed the 'Switch PI Profile' button from the Investigator Dashboard header; updated active investigator session banner logout button to 'Logout'."
     - "Task 2 (User Panel Project Details Form Status Dropdown & Proof Upload):"
     - "Restored Project Status dropdown (<select id=\\"projectStatus\\">) in Section 4 of the user panel Project Details Form with options: Submitted, Invite for Presentation, Not Recommended, and Sanctioned."
     - "For 'Submitted': Removed Scientist Name, Section Number, and Project Tracking Number fields."
     - "For 'Invite for Presentation': Removed Date of Presentation field."
     - "For 'Not Recommended': Added required Comments / Review Feedback textarea (Reviewer Comments / Reasons for Not Recommended)."
     - "For 'Sanctioned': Removed Sanctioned Amount and Sanction Order Number fields."
     - "Added interactive Status Proof Document drag-and-drop upload zone in the user panel proposal form for all dropdown options, supporting PDF, Word (.doc, .docx), and Images (.jpg, .jpeg, .png) up to 50MB, saving the files directly into MySQL database (proof_file_name, proof_file_type, proof_file_data) on proposal creation."

`;

const target1 = '===============================================================================\r\nEnd of Modified Files Audit Record.';
const target2 = '===============================================================================\nEnd of Modified Files Audit Record.';

if (content.includes(target1)) {
  content = content.replace(target1, entry93 + target1);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully added Entry 93 (CRLF)');
} else if (content.includes(target2)) {
  content = content.replace(target2, entry93 + target2);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully added Entry 93 (LF)');
} else {
  console.error('Target footer string not found!');
}
