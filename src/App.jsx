import React, { useState, useEffect } from 'react';
import { Users, Calendar, ChartBar as BarChart3, Hop as Home } from 'lucide-react';

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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:scale-105">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                      <Users className="text-white" size={24} />
                    </div>
                    <h3 className="text-gray-600 font-medium text-sm">Total Students</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{students.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Registered</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:scale-105">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                      <Calendar className="text-white" size={24} />
                    </div>
                    <h3 className="text-gray-600 font-medium text-sm">Attendance Records</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">
                    {storage.getAttendance().length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Total entries</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:scale-105">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl">
                      <BarChart3 className="text-white" size={24} />
                    </div>
                    <h3 className="text-gray-600 font-medium text-sm">Average Attendance</h3>
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
                  <p className="text-xs text-gray-500 mt-1">Overall rate</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:scale-105">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl">
                      <Calendar className="text-white" size={24} />
                    </div>
                    <h3 className="text-gray-600 font-medium text-sm">Today's Date</h3>
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    {new Date().toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Current session</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 text-white p-8 rounded-xl shadow-2xl border border-blue-400/20">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">Welcome to MarkMe!</h3>
                    <p className="text-blue-100 mb-4">
                      Manage your students and track attendance efficiently. Use the navigation menu to get started.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setCurrentPage('students')}
                        className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Manage Students
                      </button>
                      <button
                        onClick={() => setCurrentPage('attendance')}
                        className="bg-blue-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-900 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Mark Attendance
                      </button>
                    </div>
                  </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/30">
      <Navbar user={user} onLogout={handleLogout} />
      
      {/* Navigation Tabs */}
      <div className="bg-white shadow-md border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap relative ${
                  currentPage === item.id
                    ? 'text-blue-600 border-b-3 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                {item.label}
                {currentPage === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-emerald-600"></div>
                )}
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