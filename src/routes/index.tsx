import { createFileRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { getSignInUrl } from '../authkit/serverFunctions';
import SignInButton from '@/components/sign-in-button';

export const Route = createFileRoute('/')({
  component: Home,
  loader: async ({ context }) => {
    const { user } = context as { user: any };
    const url = await getSignInUrl({ data: '/faculty' });
    return { user, url };
  },
});

function Home() {
  const { user, url } = Route.useLoaderData();

  return (
    <div className="min-h-screen hero-solid flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <h1 className="text-5xl font-bold text-foreground mb-4">
              MIT WPU Attendance System
            </h1>
            <p className="text-xl text-accent-warm max-w-2xl mx-auto leading-relaxed">
              Modernize your attendance tracking with our streamlined platform. 
              Fast, reliable, and designed for MIT WPU's academic excellence.
            </p>
          </div>
        </div>

        {/* Main Content Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Faculty Access Card */}
          <div className="matte-card p-8 card-hover">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Faculty Portal
              </h2>
              <p className="text-accent-warm mb-6 leading-relaxed">
                Manage your classes, start attendance sessions, and track student participation with ease.
              </p>
              <SignInButton user={user} url={url} />
            </div>
          </div>

          {/* Student Access Card */}
          <div className="matte-card p-8 card-hover">
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Check Attendance
              </h2>
              <p className="text-accent-cool mb-6 leading-relaxed">
                View your attendance records, check your class participation, and track your academic progress.
              </p>
              <Link 
                to="/check-attendance" 
                className="matte-button-cool inline-block"
              >
                Check My Attendance
              </Link>
            </div>
          </div>

          {/* Join Class Card */}
          <div className="matte-card-warm p-8 card-hover">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Join Class
              </h2>
              <p className="text-accent-cyan mb-6 leading-relaxed">
                Get access to your classes by joining with the unique Class ID provided by your faculty.
              </p>
              <Link 
                to="/register-class" 
                className="matte-button-warm inline-block"
              >
                Join a Class
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="matte-card p-8">
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
            Key Features
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Fast & Efficient</h4>
              <p className="text-accent-warm text-sm">2-minute attendance windows ensure quick and accurate tracking</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Real-time Tracking</h4>
              <p className="text-accent-cyan text-sm">Live attendance monitoring and instant notifications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}