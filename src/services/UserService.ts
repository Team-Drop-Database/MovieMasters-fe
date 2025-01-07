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

export async function deleteUser(userId: number) {
  const endpoint = `/users/${userId}`;
  const response = await apiClient(endpoint, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete user. Status: ${response.status}`);
  }
}

export async function uploadImageToImgbb(imageFile: Blob) {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error("Imgbb API key is missing");
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData as unknown as BodyInit,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image to Imgbb");
  }

  const data = await response.json();
  return data.data.url;
}
