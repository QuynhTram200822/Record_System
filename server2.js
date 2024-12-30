const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Cho phép yêu cầu từ frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Các phương thức HTTP được phép
    allowedHeaders: ["Content-Type", "Authorization"], // Các header được phép
  })
);

// Cấu hình kết nối MySQL
const connection = mysql.createConnection({
  host: "brnfk9a0nfhmuhuuir8q-mysql.services.clever-cloud.com",
  user: "u9paw26mlghkgnx0",
  password: "mO7I3ypLSovjEBNRtnt4",
  database: "brnfk9a0nfhmuhuuir8q",
  port: 3306,
});

// Middleware để parse JSON
app.use(bodyParser.json());

// API để lưu thông tin bệnh nhân
app.post("/register-patient", (req, res) => {
  const {
    ic,
    name,
    phone,
    gender,
    dob,
    height,
    weight,
    houseaddr,
    bloodgroup,
    allergies,
    medication,
    emergencyName,
    emergencyContact,
  } = req.body;

  // Query để chèn dữ liệu vào database
  const query = `
    INSERT INTO patients (ic, name, phone, gender, dob, height, weight, houseaddr, bloodgroup, allergies, medication, emergencyName, emergencyContact)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    ic,
    name,
    phone,
    gender,
    dob,
    height,
    weight,
    houseaddr,
    bloodgroup,
    allergies,
    medication,
    emergencyName,
    emergencyContact,
  ];

  connection.execute(query, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error saving patient data");
    }
    res.status(200).send("Patient data saved successfully");
  });
});

// Khởi động server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
