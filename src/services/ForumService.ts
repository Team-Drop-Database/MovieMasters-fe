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
      const topics = await response.json();

      return topics.map((data) => {
        const topic = data as Topic;

        topic.creationDate = new Date(topic.creationDate);
        topic.formattedCreationDate = formatDateAgo(topic.creationDate);
        return topic;
      });
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

//Helper function to format date
function formatDateAgo(date: Date): string {
  const cleanDate = date.toString().split('.')[0];

  const now = new Date();
  const targetDate = new Date(cleanDate);

  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInMonths / 12);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}min ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays}d ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths}mth ago`;
  } else {
    return `${diffInYears}y ago`;
  }
}

//Helper function to sort topics
export function sortTopics(topics: Topic[], option: string, limit: number = topics.length): Topic[] {
  let sortedTopics = [...topics];

  switch (option) {
    case "A-Z":
      sortedTopics.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "Z-A":
      sortedTopics.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case "Most Popular":
      sortedTopics.sort((a, b) => b.amountComments - a.amountComments);
      break;
    case "Least Popular":
      sortedTopics.sort((a, b) => a.amountComments - b.amountComments);
      break;
    case "Newest":
      sortedTopics.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
      break;
    case "Oldest":
      sortedTopics.sort((a, b) => new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime());
      break;
    default:
      break;
  }

  // Return only the number of topics specified by the limit
  return sortedTopics.slice(0, limit);
}
