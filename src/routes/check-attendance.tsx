import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/check-attendance')({
  component: CheckAttendance,
});

function CheckAttendance() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement attendance lookup logic
    console.log('Looking up attendance...');
  };

  return (
    <div className="min-h-screen hero-solid flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Check Your Attendance
          </h1>
          <p className="text-accent-warm text-lg max-w-lg mx-auto">
            View your attendance records across all classes. Enter your details below to get started.
          </p>
        </div>

        {/* Form Card */}
        <div className="matte-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Student Information
              </h2>
              
              <div>
                <label htmlFor="prn" className="block text-sm font-medium text-foreground mb-2">
                  PRN Number
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
                  Email Address
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="matte-button w-full py-3 text-lg"
            >
              Check My Attendance
            </button>
          </form>
        </div>

        {/* Information Cards */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="matte-card-accent p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">View Records</h3>
              <p className="text-accent-warm text-sm">
                See your attendance history across all enrolled classes
              </p>
            </div>
          </div>

          <div className="matte-card-warm p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Quick Access</h3>
              <p className="text-accent-cool text-sm">
                Instant access to your attendance data anytime
              </p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            Don't have your PRN? Contact your department office for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}