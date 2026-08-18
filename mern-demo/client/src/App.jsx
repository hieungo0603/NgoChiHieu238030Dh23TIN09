import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });

  // Câu 47: Lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Lỗi:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Câu 49: Thêm sinh viên mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.name || !form.email) return alert("Vui lòng nhập đủ thông tin!");

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        alert("Thêm sinh viên thành công!");
        setForm({ studentId: '', name: '', email: '' });
        fetchStudents();
      }
    } catch (err) {
      console.error("Lỗi:", err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px' }}>
      <h2>Quản Lý Sinh Viên</h2>

      {/* Câu 48: Form nhập thông tin */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <input name="studentId" placeholder="MSSV" value={form.studentId} onChange={handleChange} required />
        <input name="name" placeholder="Họ và tên" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <button type="submit">Thêm Sinh Viên</button>
      </form>

      {/* Câu 47: Hiển thị danh sách */}
      <h3>Danh Sách Sinh Viên</h3>
      <ul>
        {students.map((sv) => (
          <li key={sv._id || sv.studentId}>
            {sv.studentId} - {sv.name} ({sv.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;