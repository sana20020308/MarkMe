import React, { useState, useEffect } from 'react';
import { Calendar, Trash2, Filter, X } from 'lucide-react';
import { storage } from '../../utils/storage';

const AttendanceHistory = ({ students }) => {
  const [records, setRecords] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    setRecords(storage.getAttendance());
  };

  const filteredRecords = records
    .filter(record => {
      const dateMatch =
        (!startDate || record.date >= startDate) &&
        (!endDate || record.date <= endDate);
      return dateMatch;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const handleDelete = (date) => {
    if (window.confirm(`Are you sure you want to delete attendance record for ${date}?`)) {
      storage.deleteAttendanceByDate(date);
      loadRecords();
    }
  };

  const clearFilters = () => {
    setSelectedStudent('all');
    setStartDate('');
    setEndDate('');
  };

  const hasFilters = selectedStudent !== 'all' || startDate || endDate;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Attendance History</h2>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="all">All Students</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

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
              Try adjusting your filters
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => {
            const displayStudents = students.filter(
              s => selectedStudent === 'all' || s.id === selectedStudent
            );

            return (
              <div key={record.date} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {new Date(record.date + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {Object.values(record.attendance).filter(s => s === 'present').length} / {Object.keys(record.attendance).length} Present
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(record.date)}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {displayStudents.map(student => {
                    const status = record.attendance[student.id];
                    return (
                      <div
                        key={student.id}
                        className={`p-3 rounded-lg border-2 ${
                          status === 'present'
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-700">
                            {student.name}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              status === 'present'
                                ? 'bg-green-200 text-green-800'
                                : 'bg-red-200 text-red-800'
                            }`}
                          >
                            {status === 'present' ? 'Present' : 'Absent'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <p className="text-indigo-800">
          <span className="font-semibold">Total Records:</span> {filteredRecords.length}
        </p>
      </div>
    </div>
  );
};

export default AttendanceHistory;