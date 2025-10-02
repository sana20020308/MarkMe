import React, { useEffect, useState } from 'react';
import { Calendar, TrendingUp, Award, AlertCircle } from 'lucide-react';
import { storage } from '../../utils/storage';

const StudentDashboard = ({ student }) => {
  const [stats, setStats] = useState({
    percentage: 0,
    presentDays: 0,
    absentDays: 0,
    totalDays: 0
  });
  const [recentAttendance, setRecentAttendance] = useState([]);

  useEffect(() => {
    calculateStats();
    loadRecentAttendance();
  }, [student]);

  const calculateStats = () => {
    const percentage = storage.calculateAttendancePercentage(student.id);
    const records = storage.getAttendance();
    
    let presentDays = 0;
    let totalDays = 0;

    records.forEach(record => {
      if (record.attendance[student.id]) {
        totalDays++;
        if (record.attendance[student.id] === 'present') {
          presentDays++;
        }
      }
    });

    setStats({
      percentage,
      presentDays,
      absentDays: totalDays - presentDays,
      totalDays
    });
  };

  const loadRecentAttendance = () => {
    const records = storage.getAttendance()
      .filter(record => record.attendance[student.id])
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 7);
    
    setRecentAttendance(records);
  };

  const getStatusMessage = () => {
    if (stats.percentage >= 75) {
      return {
        message: 'Excellent! Keep up the great work!',
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: <Award className="text-green-600" size={24} />
      };
    } else if (stats.percentage >= 50) {
      return {
        message: 'Good, but you can do better!',
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: <TrendingUp className="text-yellow-600" size={24} />
      };
    } else {
      return {
        message: 'Warning: Your attendance is low. Please improve!',
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: <AlertCircle className="text-red-600" size={24} />
      };
    }
  };

  const status = getStatusMessage();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome, {student.name}!
        </h2>
        <p className="text-gray-600 mt-1">Student ID: {student.id}</p>
      </div>

      {/* Status Alert */}
      <div className={`${status.bg} ${status.border} border-2 rounded-lg p-6`}>
        <div className="flex items-center gap-4">
          {status.icon}
          <div>
            <h3 className={`text-lg font-semibold ${status.color}`}>
              {status.message}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Current attendance: {stats.percentage}%
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <TrendingUp className="text-indigo-600" size={24} />
            </div>
            <h3 className="text-gray-600 font-medium">Attendance</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.percentage}%</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="text-green-600" size={24} />
            </div>
            <h3 className="text-gray-600 font-medium">Present Days</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.presentDays}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="text-red-600" size={24} />
            </div>
            <h3 className="text-gray-600 font-medium">Absent Days</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">{stats.absentDays}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="text-blue-600" size={24} />
            </div>
            <h3 className="text-gray-600 font-medium">Total Days</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.totalDays}</p>
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Attendance (Last 7 Days)
        </h3>
        
        {recentAttendance.length === 0 ? (
          <div className="text-center py-8">
            <Calendar size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">No attendance records yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentAttendance.map((record) => (
              <div
                key={record.date}
                className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                  record.attendance[student.id] === 'present'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {new Date(record.date + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-600">{record.date}</p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    record.attendance[student.id] === 'present'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  {record.attendance[student.id] === 'present' ? 'Present' : 'Absent'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;