import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/register-class')({
  component: RegisterClass,
});

function RegisterClass() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement class registration logic
    console.log('Registering for class...');
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
                <input
                  type="text"
                  id="classId"
                  name="classId"
                  required
                  placeholder="Enter the class ID provided by your faculty"
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
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
              className="matte-button-cool w-full py-3 text-lg"
            >
              Join Class
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
      </div>
    </div>
  );
}