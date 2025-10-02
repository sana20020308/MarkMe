import React, { useState, useEffect } from 'react';
import { Calendar, Check, Users } from 'lucide-react';
import { storage } from '../../utils/storage';

const MarkAttendance = ({ students }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [attendanceData, setAttendanceData] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existingRecord = storage.getAttendanceByDate(selectedDate);
    if (existingRecord) {
      setAttendanceData(existingRecord.attendance);
    } else {
      const initial = {};
      students.forEach(s => initial[s.id] = 'present');
      setAttendanceData(initial);
    }
  }, [selectedDate, students]);

  const handleToggle = (studentId, status) => {
    setAttendanceData({
      ...attendanceData,
      [studentId]: status
    });
  };

  const handleSave = () => {
    storage.saveAttendanceForDate(selectedDate, attendanceData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const presentCount = Object.values(attendanceData).filter(
    status => status === 'present'
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Mark Attendance</h2>
        <div className="flex items-center gap-3">
          <Calendar size={20} className="text-gray-600" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <Check size={20} />
          Attendance saved successfully for {selectedDate}!
        </div>
      )}

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <p className="text-indigo-800">
          <span className="font-semibold">Present:</span> {presentCount} / {students.length}
        </p>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No students available</p>
          <p className="text-gray-500 text-sm mt-2">Add students first to mark attendance</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {student.name}
                  </h3>
                  <p className="text-gray-600">ID: {student.id}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleToggle(student.id, 'present')}
                    className={`px-6 py-3 rounded-lg font-medium transition ${
                      attendanceData[student.id] === 'present'
                        ? 'bg-green-500 text-white shadow-md'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    Present
                  </button>
                  <button
                    onClick={() => handleToggle(student.id, 'absent')}
                    className={`px-6 py-3 rounded-lg font-medium transition ${
                      attendanceData[student.id] === 'absent'
                        ? 'bg-red-500 text-white shadow-md'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    Absent
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {students.length > 0 && (
        <button
          onClick={handleSave}
          className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition text-lg font-medium shadow-md"
        >
          Save Attendance for {selectedDate}
        </button>
      )}
    </div>
  );
};

export default MarkAttendance;