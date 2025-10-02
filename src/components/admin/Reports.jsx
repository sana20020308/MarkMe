import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { storage } from '../../utils/storage';

const Reports = ({ students }) => {
  const [reportData, setReportData] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterPercentage, setFilterPercentage] = useState('all');

  useEffect(() => {
    calculateReports();
  }, [students]);

  const calculateReports = () => {
    const data = students.map(student => {
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

      return {
        ...student,
        percentage,
        presentDays,
        totalDays,
        absentDays: totalDays - presentDays
      };
    });

    setReportData(data);
  };

  const filteredAndSortedData = reportData
    .filter(student => {
      if (filterPercentage === 'all') return true;
      if (filterPercentage === 'high') return student.percentage >= 75;
      if (filterPercentage === 'medium') return student.percentage >= 50 && student.percentage < 75;
      if (filterPercentage === 'low') return student.percentage < 50;
      return true;
    })
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'name') {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  const averageAttendance = reportData.length > 0
    ? Math.round(reportData.reduce((sum, s) => sum + s.percentage, 0) / reportData.length)
    : 0;

  const getStatusColor = (percentage) => {
    if (percentage >= 75) return 'text-green-600 bg-green-100';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusIcon = (percentage) => {
    if (percentage >= 75) return <TrendingUp size={18} />;
    return <TrendingDown size={18} />;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Attendance Reports</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-indigo-600" size={24} />
            <h3 className="text-gray-600 font-medium">Total Students</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">{students.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="text-green-600" size={24} />
            <h3 className="text-gray-600 font-medium">Average Attendance</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">{averageAttendance}%</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="text-blue-600" size={24} />
            <h3 className="text-gray-600 font-medium">Total Records</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {storage.getAttendance().length}
          </p>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="name">Name</option>
              <option value="percentage">Attendance %</option>
              <option value="presentDays">Present Days</option>
              <option value="absentDays">Absent Days</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Percentage
            </label>
            <select
              value={filterPercentage}
              onChange={(e) => setFilterPercentage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="all">All Students</option>
              <option value="high">High (≥75%)</option>
              <option value="medium">Medium (50-74%)</option>
              <option value="low">Low (&lt;50%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Table */}
      {filteredAndSortedData.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No report data available</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Student Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Student ID
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Present Days
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Absent Days
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Total Days
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Attendance %
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedData.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {student.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-green-600 font-semibold">
                      {student.presentDays}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-red-600 font-semibold">
                      {student.absentDays}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600 font-semibold">
                      {student.totalDays}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(student.percentage)}`}>
                        {student.percentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 ${getStatusColor(student.percentage)}`}>
                        {getStatusIcon(student.percentage)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;