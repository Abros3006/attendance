import { HeadContent, Link, Outlet, Scripts, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Suspense } from 'react';
import { getAuth, getSignInUrl } from '../authkit/serverFunctions';
import SignInButton from '../components/sign-in-button';
import type { ReactNode } from 'react';
import ConvexProvider from '../integrations/convex/provider'
import '../styles.css'

export const Route = createRootRoute({
  beforeLoad: async () => {
    try {
      const { user } = await getAuth();
      return { user };
    } catch (error) {
      console.warn('Auth initialization error:', error);
      return { user: null };
    }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'MIT WPU Attendance System',
      },
    ],
  }),
  loader: async ({ context }) => {
    try {
      const { user } = context;
      const url = await getSignInUrl({ data: '/faculty' });
      return {
        user,
        url,
      };
    } catch (error) {
      console.warn('Sign-in URL generation error:', error);
      return {
        user: context?.user || null,
        url: null,
      };
    }
  },
  component: RootComponent,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="matte-card p-8 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Page Not Found</h1>
        <p className="text-matte mb-6">The page you're looking for doesn't exist.</p>
        <Link to="/" className="matte-button inline-block">
          Go Home
        </Link>
      </div>
    </div>
  ),
});

function RootComponent() {
  const { user, url } = Route.useLoaderData();
  return (
    <RootDocument>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo and Brand */}
              <div className="flex items-center space-x-4">
                <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xl font-semibold text-foreground">MIT WPU</span>
                </Link>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                <Link 
                  to="/" 
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Home
                </Link>
                <Link 
                  to="/check-attendance" 
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Check Attendance
                </Link>
                <Link 
                  to="/register-class" 
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Join Class
                </Link>
              </nav>

              {/* Auth Section */}
              <div className="flex items-center space-x-4">
                <Suspense fallback={
                  <div className="w-8 h-8 bg-muted rounded animate-pulse"></div>
                }>
                  <SignInButton user={user} url={url} />
                </Suspense>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-matte text-sm">
                © 2024 MIT WPU Attendance System. Designed for academic excellence.
              </p>
            </div>
          </div>
        </footer>
      </div>
      <TanStackRouterDevtools position="bottom-right" />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <ConvexProvider>
          {children}
          <Scripts />
        </ConvexProvider>
      </body>
    </html>
  );
}