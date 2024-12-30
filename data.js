const mysql = require('mysql2');

// Thiết lập cấu hình kết nối
const connection = mysql.createConnection({
  host: 'brnfk9a0nfhmuhuuir8q-mysql.services.clever-cloud.com',
  user: 'u9paw26mlghkgnx0',
  password: 'mO7I3ypLSovjEBNRtnt4',
  database: 'brnfk9a0nfhmuhuuir8q',
  port: 3306
});

// Kết nối đến cơ sở dữ liệu
connection.connect((err) => {
    if (err) {
      console.error('Lỗi kết nối:', err);
      return;
    }
    console.log('Kết nối thành công đến MySQL Database!');
  
    // Tạo bảng
    const createTable = `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100)
    )`;
  
    connection.query(createTable, (err, result) => {
      if (err) throw err;
      console.log('Bảng được tạo thành công hoặc đã tồn tại.');
  
      // Thêm dữ liệu vào bảng
      const insertData = `INSERT INTO users (name, email) VALUES ?`;
      const values = [
        ['Nguyen Van A', 'nguyenvana@example.com'],
        ['Tran Thi B', 'tranthib@example.com']
      ];
  
      connection.query(insertData, [values], (err, result) => {
        if (err) throw err;
        console.log(`${result.affectedRows} bản ghi đã được thêm vào.`);
      });
  
      // Lấy dữ liệu
      connection.query('SELECT * FROM users', (error, results) => {
        if (error) throw error;
        console.log('Dữ liệu nhận được:', results);
      });
    });
  
    // Đóng kết nối sau khi thực hiện xong
    connection.end();
  });
  
