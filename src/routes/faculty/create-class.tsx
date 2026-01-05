import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { convex, handleConvexError, isConvexAvailable } from '../../lib/convex';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { getAuth } from '@/authkit/serverFunctions';

import { redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/faculty/create-class')({
  component: CreateClass,
  loader: async () => {
    const { user } = await getAuth();

    if (!user) {
      throw redirect({
        to: '/',
      });
    }

    return {
      user: {
        id: user.id,
        email: user.email,
      },
    };
  },
});


interface TimetableEntry {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
}

function CreateClass() {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    maxCapacity: 50,
    semester: 'Fall 2025',
    year: new Date().getFullYear(),
    department: 'Computer Science',
  });

  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>([
    { dayOfWeek: 1, startTime: '09:00', endTime: '10:30', room: '' }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const dayOptions = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxCapacity' || name === 'year' ? parseInt(value) || 0 : value
    }));
  };

  const handleTimetableEntryChange = (index: number, field: keyof TimetableEntry, value: string | number) => {
    const newEntries = [...timetableEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setTimetableEntries(newEntries);
  };

  const addTimetableEntry = () => {
    setTimetableEntries(prev => [...prev, {
      dayOfWeek: 1,
      startTime: '11:00',
      endTime: '12:30',
      room: ''
    }]);
  };

  const removeTimetableEntry = (index: number) => {
    setTimetableEntries(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Class name is required';
    if (!formData.code.trim()) return 'Class code is required';
    if (formData.maxCapacity < 1) return 'Maximum capacity must be at least 1';
    if (timetableEntries.length === 0) return 'At least one timetable entry is required';
    
    // Validate timetable entries
    for (let i = 0; i < timetableEntries.length; i++) {
      const entry = timetableEntries[i];
      if (!entry.startTime || !entry.endTime) {
        return `Timetable entry ${i + 1}: Start time and end time are required`;
      }
      if (entry.startTime >= entry.endTime) {
        return `Timetable entry ${i + 1}: Start time must be before end time`;
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Check if Convex is available
      if (!isConvexAvailable()) {
        setError('Database service is not available. Please check your configuration.');
        return;
      }

      // First, get or create faculty member (this would normally come from auth)
      // For now, we'll assume faculty is already created
      const facultyId = 'dummy-faculty-id'; // TODO: Get from auth context

      // Create the class
      const classId = await convex!.mutation(api.class.createClass, {
        facultyId: facultyId as Id<'faculty'>,
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim() || undefined,
        maxCapacity: formData.maxCapacity,
        semester: formData.semester,
        year: formData.year,
      });

      // Create timetable entries
      if (timetableEntries.length > 0) {
        await convex!.mutation(api.timetable.createOrUpdateClassTimetable, {
          classId: classId as Id<'classes'>,
          entries: timetableEntries.map(entry => ({
            dayOfWeek: entry.dayOfWeek,
            startTime: entry.startTime,
            endTime: entry.endTime,
            room: entry.room.trim() || undefined,
          })),
        });
      }

      setSuccess(`Class "${formData.name}" created successfully!`);
      
      // Reset form
      setFormData({
        name: '',
        code: '',
        description: '',
        maxCapacity: 50,
        semester: 'Fall 2025',
        year: new Date().getFullYear(),
        department: 'Computer Science',
      });
      setTimetableEntries([
        { dayOfWeek: 1, startTime: '09:00', endTime: '10:30', room: '' }
      ]);
      
    } catch (err) {
      console.error('Error creating class:', err);
      setError(handleConvexError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Create New Class
          </h1>
          <p className="text-accent-warm text-lg max-w-2xl mx-auto">
            Create a new class with timetable schedule. This will make the class available for student enrollment.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-xl border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Class Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Class Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Class Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="e.g., Data Structures, Database Systems"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-foreground mb-2">
                    Class Code *
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    required
                    placeholder="e.g., CS301, IT201"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="maxCapacity" className="block text-sm font-medium text-foreground mb-2">
                    Maximum Capacity *
                  </label>
                  <input
                    type="number"
                    id="maxCapacity"
                    name="maxCapacity"
                    min="1"
                    max="200"
                    required
                    value={formData.maxCapacity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="semester" className="block text-sm font-medium text-foreground mb-2">
                    Semester *
                  </label>
                  <select
                    id="semester"
                    name="semester"
                    required
                    value={formData.semester}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="Spring 2025">Spring 2025</option>
                    <option value="Fall 2025">Fall 2025</option>
                    <option value="Spring 2026">Spring 2026</option>
                    <option value="Fall 2026">Fall 2026</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-foreground mb-2">
                    Academic Year *
                  </label>
                  <select
                    id="year"
                    name="year"
                    required
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                    <option value={2027}>2027</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-foreground mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    placeholder="e.g., Computer Science, Information Technology"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Optional class description..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                />
              </div>
            </div>

            {/* Timetable Schedule */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-foreground">
                  Class Schedule
                </h2>
                <button
                  type="button"
                  onClick={addTimetableEntry}
                  className="matte-button-secondary px-4 py-2"
                >
                  Add Time Slot
                </button>
              </div>

              <div className="space-y-4">
                {timetableEntries.map((entry, index) => (
                  <div key={index} className="bg-card rounded-xl border border-border p-4">
                    <div className="grid md:grid-cols-5 gap-4 items-end">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Day
                        </label>
                        <select
                          value={entry.dayOfWeek}
                          onChange={(e) => handleTimetableEntryChange(index, 'dayOfWeek', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          {dayOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={entry.startTime}
                          onChange={(e) => handleTimetableEntryChange(index, 'startTime', e.target.value)}
                          className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={entry.endTime}
                          onChange={(e) => handleTimetableEntryChange(index, 'endTime', e.target.value)}
                          className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Room (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Room 101"
                          value={entry.room}
                          onChange={(e) => handleTimetableEntryChange(index, 'room', e.target.value)}
                          className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        {timetableEntries.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTimetableEntry(index)}
                            className="matte-button-danger w-full py-2"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="matte-button-secondary px-6 py-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="matte-button w-32 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Class'}
              </button>
            </div>
          </form>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mt-6 bg-card rounded-xl border border-border p-4 border-l-4 border-l-red-500 bg-red-500/10">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mt-6 bg-card rounded-xl border border-border p-4 border-l-4 border-l-green-500 bg-green-500/10">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-500">{success}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}