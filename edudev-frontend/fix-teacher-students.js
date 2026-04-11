const fs = require('fs');
const file = 'src/app/(teacher)/teacher/students/page.tsx';
let data = fs.readFileSync(file, 'utf-8');

data = data.replace(
  /const displayStudents = students \|\| mockStudents;/,
  'const displayStudents = students || [];'
);

data = data.replace(/const mockStudents = \[[\s\S]*?\];/g, '');

fs.writeFileSync(file, data);
