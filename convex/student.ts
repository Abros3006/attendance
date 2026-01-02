import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

// Find student by PRN and email
export const findStudentByCredentials = query({
  args: {
    prn: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const student = await ctx.db
      .query('students')
      .withIndex('by_prn')
      .filter((q) => q.eq(q.field('prn'), args.prn))
      .first()

    if (!student || student.email !== args.email) {
      return null
    }

    return student
  },
})

// Get all classes for a student
export const getStudentClasses = query({
  args: {
    studentId: v.id('students'),
  },
  handler: async (ctx, args) => {
    const classEnrollments = await ctx.db
      .query('classStudents')
      .withIndex('by_student')
      .filter((q) => q.eq(q.field('studentId'), args.studentId))
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect()

    // Get class details for each enrollment
    const classes = await Promise.all(
      classEnrollments.map(async (enrollment) => {
        const classData = await ctx.db.get(enrollment.classId)
        if (classData && classData.isActive) {
          return {
            class: classData,
            enrolledAt: enrollment.enrolledAt,
          }
        }
        return null
      })
    )

    return classes.filter(Boolean)
  },
})

// Get attendance records for a student
export const getStudentAttendance = query({
  args: {
    studentId: v.id('students'),
    classId: v.optional(v.id('classes')),
  },
  handler: async (ctx, args) => {
    let attendanceQuery = ctx.db
      .query('attendanceRecords')
      .withIndex('by_student')
      .filter((q) => q.eq(q.field('studentId'), args.studentId))

    if (args.classId) {
      attendanceQuery = attendanceQuery.filter((q) => q.eq(q.field('classId'), args.classId))
    }

    const attendanceRecords = await attendanceQuery.collect()

    // Get session details for each attendance record
    const sessions = await Promise.all(
      attendanceRecords.map(async (record) => {
        const session = await ctx.db.get(record.sessionId)
        const classData = await ctx.db.get(record.classId)
        
        if (session && classData) {
          return {
            attendance: record,
            session,
            class: classData,
          }
        }
        return null
      })
    )

    return sessions.filter(Boolean)
  },
})

// Create or find student by email and PRN
export const createOrFindStudent = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    prn: v.string(),
    year: v.number(),
    department: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if student already exists
    const existingStudent = await ctx.db
      .query('students')
      .withIndex('by_prn')
      .filter((q) => q.eq(q.field('prn'), args.prn))
      .first()

    if (existingStudent) {
      // Update student if needed
      if (existingStudent.email !== args.email || existingStudent.name !== args.name) {
        await ctx.db.patch(existingStudent._id, {
          email: args.email,
          name: args.name,
          updatedAt: Date.now(),
        })
      }
      return existingStudent
    }

    // Create new student
    const newStudent = await ctx.db.insert('students', {
      email: args.email,
      name: args.name,
      prn: args.prn,
      year: args.year,
      department: args.department,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return newStudent
  },
})