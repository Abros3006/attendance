# Project Scope Rule

## Overview
This project is an attendance system designed for MIT WPU to streamline and improve the process of marking student attendance. It replaces the existing inefficient system with a digital platform that allows fast and easy attendance updates.

## Key Features and Scope
The system includes the following functionalities:

1. **Admin Management**:
   - Admins can create faculty accounts.

2. **Faculty Management**:
   - Faculty have name, email, and password.
   - Faculty can create and manage timetables for their subjects.
   - Timetables include classes with multiple lectures, each having start and end times.

3. **Class Management**:
   - Each class has unique students.
   - Students have name, email, and PRN number.
   - Faculty can create classes and add students via:
     - CSV upload
     - Manual addition
     - Unique join link with class ID validation
   - Classes have a maximum capacity set by faculty.
   - Students can be removed or edited by faculty.

4. **Attendance Sessions**:
   - Faculty can start attendance sessions for lectures, valid for 2 minutes (server time).
   - A unique link is shared with students in the class.
   - Students mark attendance by visiting the link, entering PRN, email, and a unique code.
   - Attendance is marked as present if within 2 minutes, absent otherwise.
   - Attendance data is stored in the database.

5. **Attendance Viewing and Editing**:
   - Faculty can view attendance for all students in a class.
   - Faculty can edit attendance records (mark present/absent retroactively).
   - Students can view their own attendance across all classes or for specific classes using email and PRN.

6. **Admin Oversight**:
   - Admins have full access to view all data.

## Out of Scope
- Integration with external systems beyond what's specified (e.g., no integration with university ERP unless explicitly added).
- Advanced analytics or reporting beyond basic attendance viewing.
- Mobile app development (web-based only, unless specified).
- Multi-institution support (specific to MIT WPU).
- Features not listed in the requirements, such as notifications, grading, or scheduling beyond timetables.

## Constraints
- Attendance sessions are strictly 2 minutes long.
- Authentication via email, PRN, and unique codes for students.
- Database storage for all attendance records.
- Web platform with roles: Admin, Faculty, Student.

This rule defines the boundaries of the project to ensure development stays focused on the core attendance management features.