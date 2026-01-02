# WorkOS Configuration for Faculty-Only Authentication

## Current Configuration
The WorkOS integration is properly configured for the MIT WPU attendance system. The authentication flow redirects faculty members to `/faculty` after successful sign-in.

## Required WorkOS Setup for Faculty-Only Access

To restrict sign-in to only faculty members, you need to configure WorkOS on their dashboard:

### Option 1: Directory Sync (Recommended)
1. **Set up Directory Sync** in your WorkOS dashboard
2. **Connect your organization's directory** (Microsoft Azure AD, Google Workspace, etc.)
3. **Create groups for faculty members**
4. **Configure authentication policies** to only allow users from specific groups

### Option 2: Email Domain Restriction
1. **Configure Allowed Domains** in WorkOS dashboard
2. **Add only faculty email domains** (e.g., `@mitwpu.edu.in`)

### Option 3: Organization Configuration
1. **Create specific organizations** for faculty in WorkOS
2. **Map domain or group memberships** to these organizations

## Current Environment Variables
```env
WORKOS_CLIENT_ID=
WORKOS_API_KEY=sk_test_...
WORKOS_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

## Authentication Flow
1. User clicks "Sign In" on the homepage
2. Redirected to WorkOS authentication page
3. After successful authentication, redirected to `/faculty` dashboard
4. Faculty dashboard shows user information and management options

## Notes
- The current setup uses AuthKit for authentication flow
- Only authenticated users can access the `/faculty` route
- Users are automatically redirected to faculty dashboard after sign-in
- Configure WorkOS to restrict access to faculty members only