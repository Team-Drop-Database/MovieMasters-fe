import {cookies} from "next/headers";

/**
 * API Client to handle requests with default headers, including Authorization if logged in.
 *
 * @param endpoint API endpoint to fetch
 * @param options Request configuration options
 * @returns Parsed JSON response or appropriate error
 */

const apiClient = async (endpoint: string, options: RequestInit = {}) => {

  try {
    const requestCookies = await cookies();  // Access cookies from the request

    const token = requestCookies.get('jwt').value;

    const headers = new Headers({
      'Content-Type': 'application/json',
      ...(token && {Authorization: `Bearer ${token}`}), // Add Authorization header if token exists
      ...options.headers,  // Merge any additional headers from options
    });

    const response = await fetch(endpoint, {...options, headers});
    return response.json();

  } catch (error: unknown) {
    if (error instanceof Error)
      console.error(`Failed to fetch data.\nError message: ${error.message}`)
    throw error;
  }

};

export default apiClient;
