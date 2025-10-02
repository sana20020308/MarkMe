import React, { useState, useEffect } from 'react';
import { Calendar, Filter, X, TrendingUp } from 'lucide-react';
import { storage } from '../../utils/storage';

const MyAttendance = ({ student }) => {
  const [records, setRecords] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stats, setStats] = useState({
    percentage: 0,
    presentDays: 0,
    absentDays: 0,
    totalDays: 0
  });

  useEffect(() => {
    loadRecords();
    calculateStats();
  }, [student]);

  const loadRecords = () => {
    const allRecords = storage.getAttendance()
      .filter(record => record.attendance[student.id])
      .sort((a, b) => b.date.localeCompare(a.date));
    setRecords(allRecords);
  };

  const calculateStats = () => {
    const percentage = storage.calculateAttendancePercentage(student.id);
    const allRecords = storage.getAttendance();
    
    let presentDays = 0;
    let totalDays = 0;

    allRecords.forEach(record => {
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

  const filteredRecords = records.filter(record => {
    const dateMatch =
      (!startDate || record.date >= startDate) &&
      (!endDate || record.date <= endDate);
    return dateMatch;
  });

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  const hasFilters = startDate || endDate;

  // Group records by month
  const groupedRecords = filteredRecords.reduce((groups, record) => {
    const monthYear = new Date(record.date + 'T00:00:00').toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
    
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(record);
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">My Attendance History</h2>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-indigo-50 border-2 border-indigo-200 p-4 rounded-lg">
          <p className="text-indigo-600 text-sm font-medium">Attendance</p>
          <p className="text-2xl font-bold text-indigo-800">{stats.percentage}%</p>
        </div>
        <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg">
          <p className="text-green-600 text-sm font-medium">Present</p>
          <p className="text-2xl font-bold text-green-800">{stats.presentDays}</p>
        </div>
        <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg">
          <p className="text-red-600 text-sm font-medium">Absent</p>
          <p className="text-2xl font-bold text-red-800">{stats.absentDays}</p>
        </div>
        <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg">
          <p className="text-blue-600 text-sm font-medium">Total Days</p>
          <p className="text-2xl font-bold text-blue-800">{stats.totalDays}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filter by Date</h3>
          </div>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
            >
              <X size={16} />
              Clear Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Records */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No attendance records found</p>
          {hasFilters && (
            <p className="text-gray-500 text-sm mt-2">
              Try adjusting your date filters
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedRecords).map(([monthYear, monthRecords]) => (
            <div key={monthYear} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-200">
                {monthYear}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {monthRecords.map((record) => {
                  const status = record.attendance[student.id];
                  return (
                    <div
                      key={record.date}
                      className={`p-4 rounded-lg border-2 ${
                        status === 'present'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          {new Date(record.date + 'T00:00:00').toLocaleDateString('en-US', {
                            weekday: 'short'
                          })}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            status === 'present'
                              ? 'bg-green-200 text-green-800'
                              : 'bg-red-200 text-red-800'
                          }`}
                        >
                          {status === 'present' ? 'P' : 'A'}
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-gray-800">
                        {new Date(record.date + 'T00:00:00').toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAttendance;