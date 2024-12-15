import apiClient from "@/services/ApiClient";

export async function fetchUserData(username: string) {
  const endpoint = `/users/username/${username}`;
  const response = await apiClient(endpoint);

  if (!response.ok) {
    throw new Error(`Failed to fetch user data. Status: ${response.status}`);
  }
  return await response.json();
}

export async function updateUser(
  userId: number,
  updatedData: {
    username: string;
    email: string;
    profilePicture: string;
  }
) {
  const endpoint = `/users/${userId}`;
  const response = await apiClient(endpoint, {
    method: "PUT",
    body: JSON.stringify(updatedData)
  });

  if (!response.ok) {
    throw new Error(`Failed to update profile data. Status: ${response.status}`);
  }

  return await response.json();
}