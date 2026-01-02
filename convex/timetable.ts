import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

// Get timetable for a specific class entries
export const getClassTimetable = query({
  args: {
    classId: v.id('classes'),
  },
  handler: async (ctx, args) => {
    const timetableEntries = await ctx.db
      .query('timetables')
      .withIndex('by_class')
      .filter((q) => q.eq(q.field('classId'), args.classId))
      .filter((q) => q.eq(q.field('isActive'), true))
      .order('asc')
      .collect()

    return timetableEntries
  },
})

// Get timetable entries for a faculty member
export const getFacultyTimetable = query({
  args: {
    facultyId: v.id('faculty'),
  },
  handler: async (ctx, args) => {
    // First get all classes for this faculty
    const classes = await ctx.db
      .query('classes')
      .withIndex('by_faculty')
      .filter((q) => q.eq(q.field('facultyId'), args.facultyId))
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect()

    const classIds = classes.map(c => c._id)

    // Get timetable entries for all these classes
    const timetableEntries = await Promise.all(
      classIds.map(async (classId) => {
        const entries = await ctx.db
          .query('timetables')
          .withIndex('by_class')
          .filter((q) => q.eq(q.field('classId'), classId))
          .filter((q) => q.eq(q.field('isActive'), true))
          .collect()
        
        return entries.map(entry => ({
          ...entry,
          class: classes.find(c => c._id === classId),
        }))
      })
    )

    return timetableEntries.flat().sort((a, b) => {
      if (a.dayOfWeek !== b.dayOfWeek) {
        return a.dayOfWeek - b.dayOfWeek
      }
      return a.startTime.localeCompare(b.startTime)
    })
  },
})

// Create or update timetable entries for a class
export const createOrUpdateClassTimetable = mutation({
  args: {
    classId: v.id('classes'),
    entries: v.array(v.object({
      dayOfWeek: v.number(), // 0-6 (Sunday-Saturday)
      startTime: v.string(), // "HH:MM" format
      endTime: v.string(),   // "HH:MM" format
      room: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const { classId, entries } = args

    // Verify class exists
    const classData = await ctx.db.get(classId)
    if (!classData) {
      throw new Error('Class not found')
    }

    // Deactivate existing timetable entries for this class
    const existingEntries = await ctx.db
      .query('timetables')
      .withIndex('by_class')
      .filter((q) => q.eq(q.field('classId'), classId))
      .collect()

    for (const entry of existingEntries) {
      await ctx.db.patch(entry._id, { isActive: false })
    }

    // Create new timetable entries
    const createdEntries = []
    for (const entry of entries) {
      // Check for scheduling conflicts
      const conflict = await ctx.db
        .query('timetables')
        .withIndex('by_day_time')
        .filter((q) => q.eq(q.field('dayOfWeek'), entry.dayOfWeek))
        .filter((q) => q.eq(q.field('startTime'), entry.startTime))
        .filter((q) => q.eq(q.field('isActive'), true))
        .first()

      if (conflict) {
        throw new Error(`Time conflict: Another class is already scheduled at ${entry.startTime} on this day`)
      }

      const newEntry = await ctx.db.insert('timetables', {
        classId,
        dayOfWeek: entry.dayOfWeek,
        startTime: entry.startTime,
        endTime: entry.endTime,
        room: entry.room,
        semester: classData.semester,
        year: classData.year,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })

      createdEntries.push(newEntry)
    }

    return createdEntries
  },
})

// Delete timetable entry
export const deleteTimetableEntry = mutation({
  args: {
    timetableId: v.id('timetables'),
  },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.timetableId)
    if (!entry) {
      throw new Error('Timetable entry not found')
    }

    await ctx.db.patch(args.timetableId, {
      isActive: false,
      updatedAt: Date.now(),
    })

    return args.timetableId
  },
})