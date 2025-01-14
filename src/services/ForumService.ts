import apiClient from "@/services/ApiClient";
import {Topic} from "@/models/Topic";

/**
 * Fetch all topics from the backend without pagination.
 *
 * @returns A promise resolving to a list of topics.
 */
export async function getTopics(): Promise<Topic[]> {
  const endpoint = `/forum/topics`;

  try {
    const response: Response = await apiClient(endpoint);

    if (response.status === 200) {
      return await response.json();
    } else {
      console.warn(`Failed to fetch topics. Status: ${response.status}`);
      return [];
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
    }
    throw error;
  }
}

/**
 * Create a new topic in the forum.
 *
 * @param title The title of the topic.
 * @param description The description of the topic.
 * @returns A promise resolving to the created topic.
 */
export async function createTopic(title: string, description: string): Promise<Topic> {
  const endpoint = `/forum/topics`;

  try {
    const response: Response = await apiClient(endpoint, {
      method: 'POST',
      body: JSON.stringify({title, description}),
    });

    if (response.status === 201) {
      return await response.json();
    } else {
      console.warn(`Failed to create topic. Status: ${response.status}`);
      new Error('Failed to create topic');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
    }
    throw error;
  }
}