import Cookies from 'js-cookie';

/**
 * Authenticates a user by sending their credentials to the API.
 *
 * @param username The user's username.
 * @param password The user's password.
 * @returns A promise resolving to the token string if successful.
 * @throws An error if the request fails or credentials are incorrect.
 */
export async function loginUser(username: string, password: string): Promise<{ accessToken: string, refreshToken: string }> {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_VERSION}/auth/login`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password}),
    });

    if (!response.ok) {
      throw new Error('Login failed: Incorrect username and/or password');
    }

    const {accessToken, refreshToken} = await response.json();

    const JWT_COOKIE_SECURE: boolean = process.env
    .JWT_COOKIE_SECURE?.toLowerCase() == 'true';

    // Store tokens
    Cookies.set('jwt', accessToken, {expires: 1, secure: JWT_COOKIE_SECURE, sameSite: 'Strict'});
    Cookies.set('refresh_token', refreshToken, {expires: 3, secure: JWT_COOKIE_SECURE, sameSite: 'Strict'});

    return {accessToken, refreshToken};
  } catch (error) {
    console.warn('Error during login:', error);
    throw error;
  }
}

export async function refreshToken(): Promise<string> {
  const refreshToken = Cookies.get('refresh_token');

  if (!refreshToken) {
    throw new Error('No refresh token found.');
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_VERSION}/auth/refresh`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ jwt: refreshToken }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token.');
  }
  const {accessToken} = await response.json();
  return accessToken;
}