import React, { useState, useEffect } from 'react';
import { Users, Calendar, BarChart3, Home } from 'lucide-react';

// Auth
import Login from './components/auth/Login';

// Shared
import Navbar from './components/shared/Navbar';
import Layout from './components/shared/Layout';
import Modal from './components/shared/Modal';

// Admin
import StudentList from './components/admin/StudentList';
import AddEditStudent from './components/admin/AddEditStudent';
import MarkAttendance from './components/admin/MarkAttendance';
import AttendanceHistory from './components/admin/AttendanceHistory';
import Reports from './components/admin/Reports';

// Student
import StudentDashboard from './components/student/StudentDashboard';
import MyAttendance from './components/student/MyAttendance';

// Utils
import { storage } from './utils/storage';

function App() {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    setStudents(storage.getStudents());
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('dashboard');
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setModalOpen(true);
  };

  const handleSaveStudent = (studentData) => {
    if (editingStudent) {
      storage.updateStudent(editingStudent.id, studentData);
    } else {
      const existingStudent = students.find(s => s.id === studentData.id);
      if (existingStudent) {
        alert('Student ID already exists!');
        return;
      }
      storage.addStudent(studentData);
    }
    loadStudents();
    setModalOpen(false);
    setEditingStudent(null);
  };

  const handleDeleteStudent = (studentId) => {
    storage.deleteStudent(studentId);
    loadStudents();
  };

  // If not logged in, show login page
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Admin Navigation
  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'students', label: 'Students', icon: <Users size={20} /> },
    { id: 'attendance', label: 'Mark Attendance', icon: <Calendar size={20} /> },
    { id: 'history', label: 'History', icon: <Calendar size={20} /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 size={20} /> }
  ];

  // Student Navigation
  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'myattendance', label: 'My Attendance', icon: <Calendar size={20} /> }
  ];

  const navItems = user.role === 'admin' ? adminNavItems : studentNavItems;

  // Render current page content
  const renderContent = () => {
    if (user.role === 'admin') {
      switch (currentPage) {
        case 'dashboard':
          return (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Users className="text-indigo-600" size={24} />
                    </div>
                    <h3 className="text-gray-600 font-medium">Total Students</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{students.length}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Calendar className="text-green-600" size={24} />
                    </div>
                    <h3 className="text-gray-600 font-medium">Attendance Records</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">
                    {storage.getAttendance().length}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BarChart3 className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-gray-600 font-medium">Average Attendance</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">
                    {students.length > 0
                      ? Math.round(
                          students.reduce(
                            (sum, s) => sum + storage.calculateAttendancePercentage(s.id),
                            0
                          ) / students.length
                        )
                      : 0}
                    %
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="text-purple-600" size={24} />
                    </div>
                    <h3 className="text-gray-600 font-medium">Today's Date</h3>
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    {new Date().toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-2">Welcome to MarkMe!</h3>
                <p className="text-indigo-100 mb-4">
                  Manage your students and track attendance efficiently. Use the navigation menu to get started.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setCurrentPage('students')}
                    className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-indigo-50 transition"
                  >
                    Manage Students
                  </button>
                  <button
                    onClick={() => setCurrentPage('attendance')}
                    className="bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-800 transition"
                  >
                    Mark Attendance
                  </button>
                </div>
              </div>
            </div>
          );
        case 'students':
          return (
            <StudentList
              students={students}
              onAdd={handleAddStudent}
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
            />
          );
        case 'attendance':
          return <MarkAttendance students={students} />;
        case 'history':
          return <AttendanceHistory students={students} />;
        case 'reports':
          return <Reports students={students} />;
        default:
          return <div>Page not found</div>;
      }
    } else {
      // Student views
      switch (currentPage) {
        case 'dashboard':
          return <StudentDashboard student={user} />;
        case 'myattendance':
          return <MyAttendance student={user} />;
        default:
          return <div>Page not found</div>;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />
      
      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition whitespace-nowrap ${
                  currentPage === item.id
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Layout>{renderContent()}</Layout>

      {/* Add/Edit Student Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingStudent(null);
        }}
        title={editingStudent ? 'Edit Student' : 'Add New Student'}
      >
        <AddEditStudent
          student={editingStudent}
          onSave={handleSaveStudent}
          onCancel={() => {
            setModalOpen(false);
            setEditingStudent(null);
          }}
        />
      </Modal>
    </div>
  );
}

export default App;