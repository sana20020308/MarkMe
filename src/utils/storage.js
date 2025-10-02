// Utility functions for localStorage operations

export const storage = {
  // Students
  getStudents: () => {
    try {
      return JSON.parse(localStorage.getItem('students') || '[]');
    } catch {
      return [];
    }
  },
  
  setStudents: (students) => {
    localStorage.setItem('students', JSON.stringify(students));
  },
  
  addStudent: (student) => {
    const students = storage.getStudents();
    students.push(student);
    storage.setStudents(students);
  },
  
  updateStudent: (id, updatedStudent) => {
    const students = storage.getStudents();
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
      students[index] = updatedStudent;
      storage.setStudents(students);
    }
  },
  
  deleteStudent: (id) => {
    const students = storage.getStudents().filter(s => s.id !== id);
    storage.setStudents(students);
  },
  
  // Attendance
  getAttendance: () => {
    try {
      return JSON.parse(localStorage.getItem('attendance') || '[]');
    } catch {
      return [];
    }
  },
  
  setAttendance: (attendance) => {
    localStorage.setItem('attendance', JSON.stringify(attendance));
  },
  
  getAttendanceByDate: (date) => {
    const records = storage.getAttendance();
    return records.find(r => r.date === date);
  },
  
  saveAttendanceForDate: (date, attendanceData) => {
    const records = storage.getAttendance();
    const filtered = records.filter(r => r.date !== date);
    filtered.push({ date, attendance: attendanceData });
    storage.setAttendance(filtered);
  },
  
  deleteAttendanceByDate: (date) => {
    const records = storage.getAttendance().filter(r => r.date !== date);
    storage.setAttendance(records);
  },
  
  // Calculate attendance percentage for a student
  calculateAttendancePercentage: (studentId) => {
    const records = storage.getAttendance();
    if (records.length === 0) return 0;
    
    let present = 0;
    let total = 0;
    
    records.forEach(record => {
      if (record.attendance[studentId]) {
        total++;
        if (record.attendance[studentId] === 'present') {
          present++;
        }
      }
    });
    
    return total === 0 ? 0 : Math.round((present / total) * 100);
  }
};