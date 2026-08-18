const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware giúp đọc dữ liệu JSON từ req.body
app.use(express.json());

// Kết nối Cơ sở dữ liệu MongoDB (Tự động tạo DB ảo trong bộ nhớ RAM)
async function connectDB() {
  try {
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log("--> Đã kết nối MongoDB thành công!");
  } catch (err) {
    console.error("Lỗi kết nối MongoDB:", err);
  }
}
connectDB();

// ==========================================
// CÂU 35: Tạo Schema và Model Student
// ==========================================
const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true }
});

const Student = mongoose.model("Student", studentSchema);

// ==========================================
// CÂU 36: API GET /api/students (Lấy danh sách sinh viên)
// ==========================================
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// CÂU 37: API POST /api/students (Thêm mới sinh viên)
// ==========================================
app.post("/api/students", async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ==========================================
// CÂU 38: API PUT /api/students/:id (Cập nhật thông tin sinh viên)
// ==========================================
app.put("/api/students/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên" });
    }
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ==========================================
// CÂU 39: API DELETE /api/students/:id (Xóa sinh viên)
// ==========================================
app.delete("/api/students/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên" });
    }
    res.status(200).json({ message: "Xóa sinh viên thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Khởi động server
// Khởi động server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});