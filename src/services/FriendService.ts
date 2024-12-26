import apiClient from "@/services/ApiClient";

export async function addFriend(username: string) {
  const endpoint = `/friendships/add`;
  const response = await apiClient(endpoint, {
    method: "POST",
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    throw new Error(`Failed to add friend. Status: ${response.status}`);
  }

  return await response.json();
}

export async function updateFriendshipStatus(
  username: string,
  status: string
) {
  const endpoint = `/friendships/update`;
  const response = await apiClient(endpoint, {
    method: "PUT",
    body: JSON.stringify({ username, status }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to update friendship status. Status: ${response.status}`
    );
  }

  return await response.json();
}

export async function getFriendsByStatus(status: string) {
  const endpoint = `/friendships/friends?status=${status}`;
  const response = await apiClient(endpoint);

  if (!response.ok) {
    throw new Error(`Failed to fetch friends. Status: ${response.status}`);
  }

  return await response.json();
}

export async function deleteFriend(username: string) {
  const endpoint = `/friendships/remove`;
  const response = await apiClient(endpoint, {
    method: "DELETE",
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete friend. Status: ${response.status}`);
  }
}
