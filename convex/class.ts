import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

// Find class by ID (used for class registration)
export const findClassById = query({
  args: {
    classId: v.string(),
  },
  handler: async (ctx, args) => {
    const classData = await ctx.db
      .query('classes')
      .withIndex('by_code')
      .filter((q) => q.eq(q.field('code'), args.classId))
      .filter((q) => q.eq(q.field('isActive'), true))
      .first()

    return classData
  },
})

// Check if student is already enrolled in class
export const checkEnrollment = query({
  args: {
    classId: v.id('classes'),
    studentId: v.id('students'),
  },
  handler: async (ctx, args) => {
    const enrollment = await ctx.db
      .query('classStudents')
      .withIndex('by_class_student')
      .filter((q) => q.eq(q.field('classId'), args.classId))
      .filter((q) => q.eq(q.field('studentId'), args.studentId))
      .filter((q) => q.eq(q.field('isActive'), true))
      .first()

    return enrollment
  },
})

// Enroll student in class
export const enrollStudentInClass = mutation({
  args: {
    classId: v.id('classes'),
    studentId: v.id('students'),
  },
  handler: async (ctx, args) => {
    // Check if student is already enrolled
    const existingEnrollment = await ctx.db
      .query('classStudents')
      .withIndex('by_class_student')
      .filter((q) => q.eq(q.field('classId'), args.classId))
      .filter((q) => q.eq(q.field('studentId'), args.studentId))
      .first()

    if (existingEnrollment) {
      // Reactivate if previously inactive
      if (!existingEnrollment.isActive) {
        await ctx.db.patch(existingEnrollment._id, {
          isActive: true,
        })
        return existingEnrollment._id
      }
      throw new Error('Student is already enrolled in this class')
    }

    // Check class capacity
    const classData = await ctx.db.get(args.classId)
    if (!classData) {
      throw new Error('Class not found')
    }

    if (classData.currentEnrollment >= classData.maxCapacity) {
      throw new Error('Class is at full capacity')
    }

    // Create enrollment
    const enrollmentId = await ctx.db.insert('classStudents', {
      classId: args.classId,
      studentId: args.studentId,
      enrolledAt: Date.now(),
      isActive: true,
    })

    // Update class enrollment count
    await ctx.db.patch(args.classId, {
      currentEnrollment: classData.currentEnrollment + 1,
      updatedAt: Date.now(),
    })

    return enrollmentId
  },
})

// Get class details with enrollment count
export const getClassDetails = query({
  args: {
    classId: v.id('classes'),
  },
  handler: async (ctx, args) => {
    const classData = await ctx.db.get(args.classId)
    
    if (!classData) {
      return null
    }

    // Get faculty info
    const faculty = await ctx.db.get(classData.facultyId)

    return {
      ...classData,
      faculty: faculty ? {
        name: faculty.name,
        email: faculty.email,
        department: faculty.department,
      } : null,
    }
  },
})

// Get all active classes for a faculty
export const getFacultyClasses = query({
  args: {
    facultyId: v.id('faculty'),
  },
  handler: async (ctx, args) => {
    const classes = await ctx.db
      .query('classes')
      .withIndex('by_faculty')
      .filter((q) => q.eq(q.field('facultyId'), args.facultyId))
      .filter((q) => q.eq(q.field('isActive'), true))
      .order('desc')
      .collect()

    return classes
  },
})

// Create new class
export const createClass = mutation({
  args: {
    facultyId: v.id('faculty'),
    name: v.string(),
    code: v.string(),
    description: v.optional(v.string()),
    maxCapacity: v.number(),
    semester: v.string(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if class code already exists
    const existingClass = await ctx.db
      .query('classes')
      .withIndex('by_code')
      .filter((q) => q.eq(q.field('code'), args.code))
      .first()

    if (existingClass) {
      throw new Error('Class code already exists')
    }

    // Verify faculty exists
    const faculty = await ctx.db.get(args.facultyId)
    if (!faculty) {
      throw new Error('Faculty member not found')
    }

    const classId = await ctx.db.insert('classes', {
      facultyId: args.facultyId,
      name: args.name,
      code: args.code,
      description: args.description,
      maxCapacity: args.maxCapacity,
      currentEnrollment: 0,
      semester: args.semester,
      year: args.year,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return classId
  },
})