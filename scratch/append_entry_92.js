const fs = require('fs');
const filePath = 'c:/Users/mahen/OneDrive/Desktop/rd/MODIFIED_FILES.txt';
let content = fs.readFileSync(filePath, 'utf8');

const entry92 = `92. [Project Proposals Management (ProjectPi) & Backend Server (src/)]
   Absolute Paths:
     - c:\\Users\\mahen\\OneDrive\\Desktop\\rd\\src\\config\\db.js
     - c:\\Users\\mahen\\OneDrive\\Desktop\\rd\\src\\app.js
     - c:\\Users\\mahen\\OneDrive\\Desktop\\rd\\src\\models\\proposal.model.js
     - c:\\Users\\mahen\\OneDrive\\Desktop\\rd\\src\\services\\proposal.service.js
     - c:\\Users\\mahen\\OneDrive\\Desktop\\rd\\src\\controllers\\proposal.controller.js
     - c:\\Users\\mahen\\OneDrive\\Desktop\\rd\\src\\routes\\proposal.routes.js
     - c:\\Users\\mahen\\OneDrive\\Desktop\\rd\\ProjectPi\\public\\index.html
     - c:\\Users\\mahen\\OneDrive\\Desktop\\rd\\ProjectPi\\public\\styles.css
     - c:\\Users\\mahen\\OneDrive\\Desktop\\rd\\ProjectPi\\public\\app.js
   Status: MODIFIED
   Summary of Modifications:
     - "Implemented comprehensive status proof document upload and database storage system:"
     - "Database Schema: Added proof_file_name (VARCHAR 255), proof_file_type (VARCHAR 100), and proof_file_data (LONGTEXT base64) columns to the proposals table in MySQL vignan_rd database, with self-healing migration in db.js."
     - "Backend Architecture: Configured Express 50MB body-parser limits in src/app.js; updated ProposalModel and ProposalService to persist and format proof metadata and data; created GET /api/proposals/:id/proof binary streaming endpoint in ProposalController with automatic Base64 decoding, MIME headers, and inline Content-Disposition."
     - "Dean / Admin UI: Integrated interactive drag-and-drop file upload zone into the Dean Status Update form supporting PDF (.pdf), Word (.doc, .docx), and Image (.jpg, .jpeg, .png) formats up to 50MB with instant preview, file size/type badges, and remove button."
     - "Investigation & Admin Portals: Added dedicated proof badges ('📎 Proof') with quick-view and download actions across Admin Proposals table, Investigator Dashboard, and Detailed View Modal."
     - "Word Application Document: Updated exported .doc file to record attached status proof filename in Section 4 (Project Status)."

`;

const target1 = '===============================================================================\r\nEnd of Modified Files Audit Record.';
const target2 = '===============================================================================\nEnd of Modified Files Audit Record.';

if (content.includes(target1)) {
  content = content.replace(target1, entry92 + target1);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully added Entry 92 (CRLF)');
} else if (content.includes(target2)) {
  content = content.replace(target2, entry92 + target2);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully added Entry 92 (LF)');
} else {
  console.error('Target footer string not found!');
}
