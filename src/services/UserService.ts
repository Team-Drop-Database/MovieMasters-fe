import apiClient from "@/services/ApiClient";

const STATUS_CREATED = 201;
const BAD_REQUEST = 400;

export async function registerUser(user: object): Promise<string | undefined> {
  const endpoint = "/users";
  const response = await apiClient(endpoint,{
    method: "POST",
    body: JSON.stringify(user)
  });

  switch (response.status) {
    case STATUS_CREATED: {
      return "Your account has been created";
    }
    case BAD_REQUEST: {
      throw new Error(await response.text());
    }
  }
}

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