const fs = require('fs');
const file = 'src/app/(teacher)/teacher/content/page.tsx';
let data = fs.readFileSync(file, 'utf-8');

data = data.replace(
  `        // Thay mock data bằng thư viện gọi API
        const data = await teacherApi.getManagedContent();
        
        // Cập nhật lại tạm mock nếu content rỗng để user test
        if (data.length === 0) {
           throw new Error("Empty data from server currently. Please implement the generic endpoints.");
        }
        setContents(data);`,
  `        const data = await teacherApi.getManagedContent();
        setContents(data || []);`
);

fs.writeFileSync(file, data);
