import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { handleConvexError, isConvexOfflineError } from '../lib/convex';

export const Route = createFileRoute('/register-class')({
  component: RegisterClass,
});

interface ClassData {
  _id: string;
  name: string;
  code: string;
  description?: string;
  maxCapacity: number;
  currentEnrollment: number;
  semester: string;
  year: number;
}

function RegisterClass() {
  const [formData, setFormData] = useState({
    classId: '',
    prn: '',
    email: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions to continue.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setClassData(null);

    try {
      // For now, we'll simulate the API call
      // In a real implementation, you would call the Convex functions here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // TODO: Replace with actual Convex calls
      // 1. Find class by ID
      // const foundClass = await convex.query('class:findClassById', {
      //   classId: formData.classId,
      // });

      // 2. Create or find student
      // const student = await convex.mutation('student:createOrFindStudent', {
      //   email: formData.email,
      //   name: formData.name,
      //   prn: formData.prn,
      //   year: 3, // TODO: Get from user input or database
      //   department: 'Computer Science', // TODO: Get from user input or database
      // });

      // 3. Check if already enrolled
      // const existingEnrollment = await convex.query('class:checkEnrollment', {
      //   classId: foundClass._id,
      //   studentId: student._id,
      // });

      // 4. Enroll student
      // await convex.mutation('class:enrollStudentInClass', {
      //   classId: foundClass._id,
      //   studentId: student._id,
      // });

      // Simulate class not found for demo
      setError('Class not found. Please check the Class ID and try again.');
    } catch (err) {
      console.error('Error registering for class:', err);
      setError('An error occurred while registering for the class.');
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

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreedToTerms(e.target.checked);
  };

  const handleCheckClass = async () => {
    if (!formData.classId) {
      setError('Please enter a Class ID first.');
      return;
    }

    setLoading(true);
    setError(null);
    setClassData(null);

    try {
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      // TODO: Replace with actual Convex call
      // const foundClass = await convex.query('class:findClassById', {
      //   classId: formData.classId,
      // });

      // Simulate class not found for demo
      setError('Class not found. Please check the Class ID.');
    } catch (err) {
      console.error('Error checking class:', err);
      setError('An error occurred while checking the class.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-solid flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Join a Class
          </h1>
          <p className="text-accent-cool text-lg max-w-lg mx-auto">
            Enter the class details provided by your faculty member to join the class and get access to attendance sessions.
          </p>
        </div>

        {/* Form Card */}
        <div className="matte-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Class Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Class Details
              </h2>
              
              <div>
                <label htmlFor="classId" className="block text-sm font-medium text-foreground mb-2">
                  Class ID
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    id="classId"
                    name="classId"
                    required
                    placeholder="Enter the class ID provided by your faculty"
                    value={formData.classId}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleCheckClass}
                    disabled={loading || !formData.classId}
                    className="matte-button-secondary px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Check
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="prn" className="block text-sm font-medium text-foreground mb-2">
                  Your PRN Number
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
                  Your Email Address
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

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Your Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-background/50 p-4 rounded-lg">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  required
                  checked={agreedToTerms}
                  onChange={handleTermsChange}
                  className="mt-1 w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
                />
                <span className="text-sm text-muted-foreground">
                  I agree to join this class and understand that my attendance will be tracked for this subject. 
                  I confirm that the information provided is accurate.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="matte-button-cool w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Joining...' : 'Join Class'}
            </button>
          </form>
        </div>

        {/* Information Cards */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="matte-card-accent p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Easy Access</h3>
              <p className="text-accent-warm text-sm">
                Join classes with just a simple form submission
              </p>
            </div>
          </div>

          <div className="matte-card-warm p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Verified</h3>
              <p className="text-accent-cool text-sm">
                Your enrollment is verified through faculty validation
              </p>
            </div>
          </div>

          <div className="matte-card p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Secure</h3>
              <p className="text-accent-cyan text-sm">
                Your data is protected with secure enrollment process
              </p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            Having trouble joining a class? Contact your faculty member for the correct Class ID.
          </p>
        </div>

        {/* Error/Success Messages */}
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

        {success && (
          <div className="mt-6 matte-card p-4 border-l-4 border-green-500 bg-green-500/10">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-500">{success}</p>
            </div>
          </div>
        )}

        {/* Class Information */}
        {classData && (
          <div className="mt-6 matte-card-accent p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Class Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Class Name</p>
                <p className="text-foreground font-medium">{classData.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Class Code</p>
                <p className="text-foreground font-medium">{classData.code}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Semester</p>
                <p className="text-foreground font-medium">{classData.semester} {classData.year}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Capacity</p>
                <p className="text-foreground font-medium">{classData.currentEnrollment}/{classData.maxCapacity} students</p>
              </div>
              {classData.description && (
                <div className="md:col-span-2">
                  <p className="text-muted-foreground text-sm">Description</p>
                  <p className="text-foreground font-medium">{classData.description}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}