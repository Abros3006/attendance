import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  // Faculty table - teachers who manage classes
  faculty: defineTable({
    userId: v.string(), // WorkOS user ID for authentication
    email: v.string(),
    name: v.string(),
    department: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_email', ['email'])
    .index('by_active', ['isActive']),

  // Classes table - different subjects taught by faculty
  classes: defineTable({
    facultyId: v.id('faculty'),
    name: v.string(), // Class name (e.g., "Data Structures", "Database Systems")
    code: v.string(), // Class code (e.g., "CS301", "IT201")
    description: v.optional(v.string()),
    maxCapacity: v.number(),
    currentEnrollment: v.number(),
    semester: v.string(), // e.g., "Fall 2024", "Spring 2025"
    year: v.number(), // Academic year
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_faculty', ['facultyId'])
    .index('by_code', ['code'])
    .index('by_semester_year', ['semester', 'year'])
    .index('by_active', ['isActive']),

  // Students table - all students in the system
  students: defineTable({
    email: v.string(),
    name: v.string(),
    prn: v.string(), // PRN number - unique identifier
    year: v.number(), // Current year of study
    department: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_email', ['email'])
    .index('by_prn', ['prn'])
    .index('by_year_department', ['year', 'department'])
    .index('by_active', ['isActive']),

  // Class students junction table - enrollment records
  classStudents: defineTable({
    classId: v.id('classes'),
    studentId: v.id('students'),
    enrolledAt: v.number(),
    isActive: v.boolean(),
  })
    .index('by_class', ['classId'])
    .index('by_student', ['studentId'])
    .index('by_class_student', ['classId', 'studentId'])
    .index('by_active', ['isActive']),

  // Timetables table - schedule information for classes
  timetables: defineTable({
    classId: v.id('classes'),
    dayOfWeek: v.number(), // 0-6 (Sunday-Saturday)
    startTime: v.string(), // "HH:MM" format
    endTime: v.string(), // "HH:MM" format
    room: v.optional(v.string()),
    semester: v.string(),
    year: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_class', ['classId'])
    .index('by_day_time', ['dayOfWeek', 'startTime'])
    .index('by_semester_year', ['semester', 'year'])
    .index('by_active', ['isActive']),

  // Attendance sessions table - 2-minute attendance windows
  attendanceSessions: defineTable({
    classId: v.id('classes'),
    facultyId: v.id('faculty'),
    lectureDate: v.string(), // "YYYY-MM-DD" format
    startTime: v.string(), // "HH:MM" format when session started
    endTime: v.string(), // "HH:MM" format (startTime + 2 minutes)
    uniqueCode: v.string(), // Generated code for student verification
    lectureNumber: v.number(), // Position in timetable for this day
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index('by_class', ['classId'])
    .index('by_faculty', ['facultyId'])
    .index('by_class_date', ['classId', 'lectureDate'])
    .index('by_active', ['isActive'])
    .index('by_code', ['uniqueCode']),

  // Attendance records table - individual student attendance marks
  attendanceRecords: defineTable({
    sessionId: v.id('attendanceSessions'),
    studentId: v.id('students'),
    classId: v.id('classes'),
    status: v.union(v.literal('present'), v.literal('absent')),
    markedAt: v.number(), // Timestamp when attendance was marked
    ipAddress: v.optional(v.string()), // For audit trail
    userAgent: v.optional(v.string()), // For audit trail
    isEdited: v.boolean(), // Whether attendance was manually edited
    editedAt: v.optional(v.number()),
    editedBy: v.optional(v.id('faculty')), // Faculty who edited the record
  })
    .index('by_session', ['sessionId'])
    .index('by_student', ['studentId'])
    .index('by_class', ['classId'])
    .index('by_student_class', ['studentId', 'classId'])
    .index('by_session_student', ['sessionId', 'studentId'])
    .index('by_status', ['status']),
})
