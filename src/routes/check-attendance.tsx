import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { convex, handleConvexError, isConvexOfflineError } from '../lib/convex';
import { api } from '../../convex/_generated/api';

export const Route = createFileRoute('/check-attendance')({
  component: CheckAttendance,
});

interface Student {
  _id: string;
  name: string;
  email: string;
  prn: string;
}

interface AttendanceRecord {
  attendance: {
    status: 'present' | 'absent';
    markedAt: number;
    isEdited: boolean;
    editedAt?: number;
  };
  session: {
    lectureDate: string;
    startTime: string;
    uniqueCode: string;
  };
  class: {
    name: string;
    code: string;
  };
}

function CheckAttendance() {
  const [formData, setFormData] = useState({ prn: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStudent(null);
    setAttendanceRecords([]);

    try {
      // Find student by PRN and email
      const foundStudent = await convex.query(api.student.findStudentByCredentials, {
        prn: formData.prn,
        email: formData.email,
      });

      if (!foundStudent) {
        setError('Student not found. Please check your PRN and email address.');
        return;
      }

      setStudent(foundStudent);

      // Get attendance records for the student
      const records = await convex.query(api.student.getStudentAttendance, {
        studentId: foundStudent._id,
      });

      // Transform records to match expected interface
      const transformedRecords = records
        .filter((record): record is NonNullable<typeof record> => record !== null)
        .map((record) => ({
          attendance: {
            status: record.attendance.status,
            markedAt: record.attendance.markedAt,
            isEdited: record.attendance.isEdited,
            editedAt: record.attendance.editedAt,
          },
          session: {
            lectureDate: record.session.lectureDate,
            startTime: record.session.startTime,
            uniqueCode: record.session.uniqueCode,
          },
          class: {
            name: record.class.name,
            code: record.class.code,
          },
        }));

      setAttendanceRecords(transformedRecords);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError('An error occurred while fetching attendance data.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Calculate attendance statistics
  const totalSessions = attendanceRecords.length;
  const presentSessions = attendanceRecords.filter(record => record.attendance.status === 'present').length;
  const attendancePercentage = totalSessions > 0 ? Math.round((presentSessions / totalSessions) * 100) : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen hero-solid flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Check Your Attendance
          </h1>
          <p className="text-accent-warm text-lg max-w-lg mx-auto">
            View your attendance records across all classes. Enter your details below to get started.
          </p>
        </div>

        {/* Form Card */}
        <div className="matte-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Student Information
              </h2>
              
              <div>
                <label htmlFor="prn" className="block text-sm font-medium text-foreground mb-2">
                  PRN Number
                </label>
                <input
                  type="text"
                  id="prn"
                  name="prn"
                  required
                  placeholder="Enter your PRN number"
                  value={formData.prn}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="matte-button w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Checking...' : 'Check My Attendance'}
            </button>
          </form>
        </div>

        {/* Information Cards */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="matte-card-accent p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">View Records</h3>
              <p className="text-accent-warm text-sm">
                See your attendance history across all enrolled classes
              </p>
            </div>
          </div>

          <div className="matte-card-warm p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Quick Access</h3>
              <p className="text-accent-cool text-sm">
                Instant access to your attendance data anytime
              </p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            Don't have your PRN? Contact your department office for assistance.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 matte-card p-4 border-l-4 border-red-500 bg-red-500/10">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {student && (
          <div className="mt-8 space-y-6">
            {/* Student Info Card */}
            <div className="matte-card-accent p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Student Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">Name</p>
                  <p className="text-foreground font-medium">{student.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">PRN</p>
                  <p className="text-foreground font-medium">{student.prn}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Email</p>
                  <p className="text-foreground font-medium">{student.email}</p>
                </div>
              </div>
            </div>

            {/* Attendance Summary */}
            <div className="matte-card p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Attendance Summary</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{totalSessions}</div>
                  <p className="text-muted-foreground">Total Sessions</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500 mb-2">{presentSessions}</div>
                  <p className="text-muted-foreground">Present</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-cyan mb-2">{attendancePercentage}%</div>
                  <p className="text-muted-foreground">Attendance Rate</p>
                </div>
              </div>
            </div>

            {/* Attendance Records */}
            {attendanceRecords.length > 0 && (
              <div className="matte-card p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Recent Attendance Records</h3>
                <div className="space-y-3">
                  {attendanceRecords.slice(0, 10).map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          record.attendance.status === 'present' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <p className="text-foreground font-medium">{record.class.name} ({record.class.code})</p>
                          <p className="text-muted-foreground text-sm">
                            {formatDate(record.session.lectureDate)} at {formatTime(record.session.startTime)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          record.attendance.status === 'present' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {record.attendance.status === 'present' ? 'Present' : 'Absent'}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {formatDateTime(record.attendance.markedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {attendanceRecords.length > 10 && (
                  <div className="mt-4 text-center">
                    <p className="text-muted-foreground text-sm">
                      Showing 10 of {attendanceRecords.length} records
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* No Records Message */}
            {attendanceRecords.length === 0 && (
              <div className="matte-card p-6 text-center">
                <p className="text-muted-foreground">No attendance records found for this student.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}