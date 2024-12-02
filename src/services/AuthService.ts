import Cookies from 'js-cookie';

/**
 * Authenticates a user by sending their credentials to the API.
 *
 * @param username The user's username.
 * @param password The user's password.
 * @returns A promise resolving to the token string if successful.
 * @throws An error if the request fails or credentials are incorrect.
 */
export async function loginUser(username: string, password: string): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_VERSION}/auth/login`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password}),
    });

    const token = await response.text();

    // Store JWT in cookies
    Cookies.set('jwt', token, {expires: 1, secure: true, sameSite: 'Strict'});

    return token;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}