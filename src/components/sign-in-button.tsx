import { Link } from '@tanstack/react-router';
import type { User } from '@workos-inc/node';

export default function SignInButton({ large, user, url }: { large?: boolean; user: User | null; url: string | null }) {
  if (user) {
    return (
      <div className="flex items-center space-x-3">
        <Link 
          to="/faculty" 
          className={`bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity ${large ? 'px-8 py-4 text-lg' : 'px-6 py-2'} inline-block`}
        >
          Go to Dashboard
        </Link>
        <Link 
          to="/logout" 
          className={`bg-muted text-muted-foreground font-medium hover:bg-muted/80 transition-colors ${large ? 'px-6 py-3' : 'px-4 py-2'} inline-block`}
        >
          Sign Out
        </Link>
      </div>
    );
  }

  // If URL is not available, show a disabled button
  if (!url) {
    return (
      <button 
        className={`bg-muted text-muted-foreground font-medium cursor-not-allowed opacity-50 ${large ? 'px-8 py-4 text-lg' : 'px-6 py-3'} inline-block`}
        disabled
      >
        Loading...
      </button>
    );
  }

  return (
    <a 
      href={url}
      className={`bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity ${large ? 'px-8 py-4 text-lg' : 'px-6 py-3'} inline-block`}
    >
      Sign In{large && ' with AuthKit'}
    </a>
  );
}
