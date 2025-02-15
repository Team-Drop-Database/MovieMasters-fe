import Cookies from "js-cookie"

/**
 * API Client to handle requests with default headers, including Authorization if logged in.
 *
 * @param endpoint API endpoint to fetch
 * @param options Request configuration options
 * @returns Parsed JSON response or appropriate error
 */

const apiClient = async (endpoint: string, options: RequestInit = {}) => {

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_VERSION}${endpoint}`;
    const token = Cookies.get('jwt')

    const headers = new Headers({
      'Content-Type': 'application/json',
      ...(token && {Authorization: `Bearer ${token}`}), // Add Authorization header if token exists
      ...options.headers,  // Merge any additional headers from options
    });

    return await fetch(url, {...options, headers});

  } catch (error: unknown) {
    if (error instanceof Error)
      console.error(`Failed to fetch data.\nError message: ${error.message}`)
    throw error;
  }

};

export default apiClient;
