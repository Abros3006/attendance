# Database Schema Rule

## Overview
This rule defines the database schema for the MIT WPU Attendance System, designed for scalability to handle thousands of documents with efficient querying and proper indexing.

## Technology Stack
- **Database**: Convex (Real-time database with built-in indexing)
- **Schema Definition**: TypeScript with Convex schema syntax
- **Storage**: Cloud-based with automatic scaling

## Schema Structure

### Core Entities

#### 1. Faculty Table
**Purpose**: Store faculty/teachers information  
**Scalability**: Linked to WorkOS user authentication

```typescript
faculty: {
  userId: string,        // WorkOS user ID for authentication
  email: string,         // Faculty email
  name: string,          // Full name
  department: string?,   // Optional department
  isActive: boolean,     // Active status
  createdAt: number,     // Timestamp
  updatedAt: number      // Timestamp
}
```

**Indexes**:
- `by_userId`: Fast lookup by WorkOS ID
- `by_email`: Email-based queries
- `by_active`: Filter active faculty

#### 2. Classes Table
**Purpose**: Store class/subject information  
**Scalability**: Supports multiple classes per faculty

```typescript
classes: {
  facultyId: id,         // Reference to faculty
  name: string,          // Class name (e.g., "Data Structures")
  code: string,          // Class code (e.g., "CS301")
  description: string?,  // Optional description
  maxCapacity: number,   // Maximum students allowed
  currentEnrollment: number, // Current enrollment count
  semester: string,      // "Fall 2024", "Spring 2025"
  year: number,          // Academic year
  isActive: boolean,     // Active status
  createdAt: number,     // Timestamp
  updatedAt: number      // Timestamp
}
```

**Indexes**:
- `by_faculty`: Find classes by faculty
- `by_code`: Quick class lookup by code
- `by_semester_year`: Filter by academic period
- `by_active`: Active class filtering

#### 3. Students Table
**Purpose**: Store all student information  
**Scalability**: System-wide student registry

```typescript
students: {
  email: string,         // Student email
  name: string,          // Full name
  prn: string,           // PRN number (unique identifier)
  year: number,          // Current year of study
  department: string,    // Department
  isActive: boolean,     // Active status
  createdAt: number,     // Timestamp
  updatedAt: number      // Timestamp
}
```

**Indexes**:
- `by_email`: Email lookup
- `by_prn`: PRN-based queries (unique)
- `by_year_department`: Student filtering
- `by_active`: Active student filtering

#### 4. Class Students Junction Table
**Purpose**: Manage student enrollment in classes  
**Scalability**: Many-to-many relationship management

```typescript
classStudents: {
  classId: id,           // Reference to classes
  studentId: id,         // Reference to students
  enrolledAt: number,    // Enrollment timestamp
  isActive: boolean      // Active enrollment
}
```

**Indexes**:
- `by_class`: Students in a class
- `by_student`: Classes for a student
- `by_class_student`: Unique enrollment check
- `by_active`: Active enrollments

#### 5. Timetables Table
**Purpose**: Store class schedule information  
**Scalability**: Multiple lectures per class per week

```typescript
timetables: {
  classId: id,           // Reference to classes
  dayOfWeek: number,     // 0-6 (Sunday-Saturday)
  startTime: string,     // "HH:MM" format
  endTime: string,       // "HH:MM" format
  room: string?,         // Optional room number
  semester: string,      // Academic semester
  year: number,          // Academic year
  isActive: boolean,     // Active status
  createdAt: number,     // Timestamp
  updatedAt: number      // Timestamp
}
```

**Indexes**:
- `by_class`: Timetable for specific class
- `by_day_time`: Schedule conflicts detection
- `by_semester_year`: Academic period filtering
- `by_active`: Active schedule items

#### 6. Attendance Sessions Table
**Purpose**: 2-minute attendance marking windows  
**Scalability**: Multiple sessions per class per day

```typescript
attendanceSessions: {
  classId: id,           // Reference to classes
  facultyId: id,         // Reference to faculty
  lectureDate: string,   // "YYYY-MM-DD" format
  startTime: string,     // Session start time
  endTime: string,       // Session end time (start + 2 minutes)
  uniqueCode: string,    // Generated verification code
  lectureNumber: number, // Position in day's timetable
  isActive: boolean,     // Active status
  createdAt: number      // Timestamp
}
```

**Indexes**:
- `by_class`: Sessions for a class
- `by_faculty`: Sessions by faculty
- `by_class_date`: Daily session lookup
- `by_active`: Active sessions
- `by_code`: Session verification

#### 7. Attendance Records Table
**Purpose**: Individual student attendance marks  
**Scalability**: High-volume attendance tracking

```typescript
attendanceRecords: {
  sessionId: id,         // Reference to attendance session
  studentId: id,         // Reference to students
  classId: id,           // Reference to classes
  status: "present" | "absent", // Attendance status
  markedAt: number,      // When attendance was marked
  ipAddress: string?,    // For audit trail
  userAgent: string?,    // For audit trail
  isEdited: boolean,     // Manual edit flag
  editedAt: number?,     // Edit timestamp
  editedBy: id?          // Faculty who edited
}
```

**Indexes**:
- `by_session`: All students in session
- `by_student`: Student's attendance history
- `by_class`: Class attendance records
- `by_student_class`: Student performance in class
- `by_session_student`: Unique attendance record
- `by_status`: Attendance statistics

## Scalability Considerations

### Indexing Strategy
- **Composite Indexes**: Used for common query patterns
- **Selective Indexing**: Only essential fields indexed to balance performance and storage
- **Time-based Indexing**: Timestamps indexed for efficient historical queries

### Query Optimization
- **Denormalization**: Limited denormalization for performance-critical queries
- **Pagination**: Built-in support for large result sets
- **Real-time Updates**: Convex provides real-time subscriptions

### Data Integrity
- **Foreign Key Relationships**: All references use Convex document IDs
- **Unique Constraints**: PRN numbers and unique codes are constrained
- **Audit Trail**: IP addresses and user agents tracked for security

### Performance Features
- **Automatic Indexing**: Convex automatically indexes primary keys
- **Query Optimization**: Automatic query optimization by Convex
- **Caching**: Built-in caching for frequently accessed data

## Data Relationships

```
Faculty (1) -----> (M) Classes
Classes (M) -----> (M) Students (via classStudents)
Classes (1) -----> (M) Timetables
Classes (1) -----> (M) AttendanceSessions
AttendanceSessions (1) -----> (M) AttendanceRecords
Students (1) -----> (M) AttendanceRecords
Faculty (1) -----> (M) AttendanceRecords (edits)
```

## Usage Patterns

### Common Queries
1. **Faculty Dashboard**: Classes by faculty → Students by class
2. **Attendance Tracking**: Active sessions → Student verification
3. **Student Records**: Student by PRN → Attendance history
4. **Class Management**: Class by code → Timetable → Students

### Real-time Features
- **Live Attendance**: Real-time session updates
- **Dashboard Updates**: Automatic UI refresh on data changes
- **Conflict Detection**: Timetable overlap detection

## Migration Strategy
- **Backward Compatibility**: Schema changes must maintain existing data
- **Gradual Migration**: Phased rollout of schema changes
- **Data Validation**: Pre-migration validation scripts

This schema is designed to scale efficiently for thousands of documents while maintaining query performance and data integrity.