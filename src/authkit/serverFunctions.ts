import { createServerFn } from '@tanstack/react-start';
import { deleteCookie } from '@tanstack/react-start/server';
import { GetAuthURLOptions, NoUserInfo, UserInfo } from './ssr/interfaces';
import { getWorkOS } from './ssr/workos';
import { getConfig } from './ssr/config';
import { terminateSession, withAuth } from './ssr/session';

// Helper function to handle WorkOS API errors gracefully
function handleWorkOSError(error: any) {
  console.warn('WorkOS API error:', error?.message || error);
  return null;
}

export const getAuthorizationUrl = createServerFn({ method: 'GET' })
  .inputValidator((options?: GetAuthURLOptions) => options)
  .handler(({ data: options = {} }) => {
    try {
      const { returnPathname, screenHint, redirectUri } = options;

      return getWorkOS().userManagement.getAuthorizationUrl({
        provider: 'authkit',
        clientId: getConfig('clientId'),
        redirectUri: redirectUri || getConfig('redirectUri'),
        state: returnPathname ? btoa(JSON.stringify({ returnPathname })) : undefined,
        screenHint,
      });
    } catch (error) {
      return handleWorkOSError(error);
    }
  });

export const getSignInUrl = createServerFn({ method: 'GET' })
  .inputValidator((data?: string) => data)
  .handler(async ({ data: returnPathname }) => {
    return await getAuthorizationUrl({ data: { returnPathname, screenHint: 'sign-in' } });
  });

export const getSignUpUrl = createServerFn({ method: 'GET' })
  .inputValidator((data?: string) => data)
  .handler(async ({ data: returnPathname }) => {
    return getAuthorizationUrl({ data: { returnPathname, screenHint: 'sign-up' } });
  });

export const signOut = createServerFn({ method: 'POST' })
  .inputValidator((data?: string) => data)
  .handler(async ({ data: returnTo }) => {
    const cookieName = getConfig('cookieName') || 'wos_session';
    deleteCookie(cookieName);
    await terminateSession({ returnTo });
  });

export const getAuth = createServerFn({ method: 'GET' }).handler(async (): Promise<UserInfo | NoUserInfo> => {
  try {
    const auth = await withAuth();
    return auth;
  } catch (error) {
    console.warn('Auth error:', error instanceof Error ? error.message : String(error));
    return { user: null };
  }
});
