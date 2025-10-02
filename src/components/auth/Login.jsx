import React, { useState } from 'react';
import { storage } from '../../utils/storage';

const Login = ({ onLogin }) => {
  const [role, setRole] = useState('admin');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (role === 'admin') {
      onLogin({ role: 'admin' });
    } else {
      const students = storage.getStudents();
      const student = students.find(s => s.id === studentId);
      
      if (student) {
        onLogin({ role: 'student', ...student });
      } else {
        setError('Student ID not found. Please check and try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">MarkMe</h1>
          <p className="text-gray-600">Student Attendance System</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Login As
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 py-3 rounded-lg font-medium transition ${
                  role === 'admin'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 py-3 rounded-lg font-medium transition ${
                  role === 'student'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Student
              </button>
            </div>
          </div>

          {role === 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student ID
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="Enter your Student ID"
                required
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition shadow-md"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;