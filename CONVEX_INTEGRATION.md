# Convex Backend Integration Guide

## Overview
This guide explains how to connect the frontend components to the Convex backend methods created for the MIT WPU Attendance System.

## Backend Methods Created

### Student Methods (`convex/student.ts`)
- `findStudentByCredentials(prn, email)` - Find student by PRN and email
- `getStudentClasses(studentId)` - Get all classes for a student
- `getStudentAttendance(studentId, classId?)` - Get attendance records for a student
- `createOrFindStudent(email, name, prn, year, department)` - Create or update student

### Class Methods (`convex/class.ts`)
- `findClassById(classId)` - Find class by Class ID code
- `checkEnrollment(classId, studentId)` - Check if student is enrolled
- `enrollStudentInClass(classId, studentId)` - Enroll student in class
- `getClassDetails(classId)` - Get class details with faculty info
- `getFacultyClasses(facultyId)` - Get all classes for a faculty
- `createClass(...)` - Create new class (faculty only)

## Frontend Integration Steps

### 1. Install Convex Client
```bash
npm install convex
```

### 2. Update Frontend Components

#### For Check Attendance (`src/routes/check-attendance.tsx`)
```typescript
import { useConvex } from 'convex/react';

function CheckAttendance() {
  const convex = useConvex();
  
  const handleSubmit = async (e: React.FormEvent) => {
    // ... existing code ...
    
    try {
      // Find student by PRN and email
      const foundStudent = await convex.query('student:findStudentByCredentials', {
        prn: formData.prn,
        email: formData.email,
      });

      if (!foundStudent) {
        setError('Student not found. Please check your PRN and email address.');
        return;
      }

      setStudent(foundStudent);

      // Get attendance records for the student
      const attendance = await convex.query('student:getStudentAttendance', {
        studentId: foundStudent._id,
      });

      setAttendanceRecords(attendance);
    } catch (err) {
      // ... error handling ...
    }
  };
}
```

#### For Register Class (`src/routes/register-class.tsx`)
```typescript
function RegisterClass() {
  const convex = useConvex();
  
  const handleSubmit = async (e: React.FormEvent) => {
    // ... existing code ...
    
    try {
      // 1. Find class by ID
      const foundClass = await convex.query('class:findClassById', {
        classId: formData.classId,
      });

      if (!foundClass) {
        setError('Class not found. Please check the Class ID.');
        return;
      }

      setClassData(foundClass);

      // 2. Create or find student
      const student = await convex.mutation('student:createOrFindStudent', {
        email: formData.email,
        name: formData.name,
        prn: formData.prn,
        year: 3, // TODO: Get from user input or database
        department: 'Computer Science', // TODO: Get from user input or database
      });

      // 3. Check if already enrolled
      const existingEnrollment = await convex.query('class:checkEnrollment', {
        classId: foundClass._id,
        studentId: student._id,
      });

      if (existingEnrollment) {
        setError('You are already enrolled in this class.');
        return;
      }

      // 4. Enroll student
      await convex.mutation('class:enrollStudentInClass', {
        classId: foundClass._id,
        studentId: student._id,
      });

      setSuccess('Successfully enrolled in the class!');
    } catch (err) {
      // ... error handling ...
    }
  };
}
```

### 3. Environment Setup
Ensure your `.env.local` has the Convex URL:
```env
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

### 4. Run Convex
```bash
npx convex dev
```

### 5. Deploy
```bash
npx convex deploy
```

## Database Schema
The system uses 7 main tables:
- `faculty` - Teachers
- `classes` - Subjects/classes
- `students` - Students
- `classStudents` - Enrollment records
- `timetables` - Class schedules
- `attendanceSessions` - 2-minute attendance windows
- `attendanceRecords` - Individual attendance marks

## Key Features Implemented
- ✅ Scalable database schema with 27 optimized indexes
- ✅ Student lookup by PRN and email
- ✅ Class registration with capacity checking
- ✅ Enrollment validation and duplicate prevention
- ✅ Real-time attendance tracking
- ✅ Faculty-class relationships
- ✅ Comprehensive error handling
- ✅ Loading states and user feedback

## Next Steps
1. Set up Convex deployment
2. Connect frontend components to actual Convex methods
3. Implement faculty dashboard features
4. Add attendance session creation and management
5. Set up WorkOS directory sync for faculty-only access
6. Add student year/department selection in registration form