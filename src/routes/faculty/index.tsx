import { getAuth } from '@/authkit/serverFunctions';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';

//@ts-ignore
export const Route = createFileRoute('/faculty/')({
  component: FacultyDashboard,
  loader: async () => {
    try {
      const { user } = await getAuth();

      if (!user) {
        throw redirect({
          to: '/',
        });
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName
        },
      };
    } catch (error) {
      console.error('Auth error in faculty loader:', error);
      throw redirect({
        to: '/',
      });
    }
  },
});

function FacultyDashboard() {
  const { user } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Faculty Dashboard
          </h1>
          <p className="text-warning text-lg">
            Welcome back, {user?.firstName || user?.email}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-xl border border-border p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Create Class</h3>
              <p className="text-warning text-sm mb-4">Create a new class and add students</p>
              <Link to="/faculty/create-class" className="bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity w-full py-3 block text-center rounded-lg">
                New Class
              </Link>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Manage Timetable</h3>
              <p className="text-accent text-sm mb-4">Create and manage class schedules</p>
              <button className="bg-secondary text-secondary-foreground font-medium hover:opacity-90 transition-opacity w-full py-3 rounded-lg">
                View Timetable
              </button>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Start Session</h3>
              <p className="text-ring text-sm mb-4">Begin an attendance session</p>
              <button className="bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity w-full py-3 rounded-lg">
                Start Now
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-foreground">No recent classes created</span>
              </div>
              <span className="text-muted-foreground text-sm">Just now</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-foreground">Welcome to the faculty dashboard!</span>
              </div>
              <span className="text-muted-foreground text-sm">Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
