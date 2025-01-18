import apiClient from "@/services/ApiClient";
import {Topic} from "@/models/Topic";
import {Comment} from "@/models/Comment";

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

      return topics.map((data: Topic) => {
        const topic = data;

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
 * Fetch a topic by its ID from the backend.
 *
 * @param topicId The ID of the topic to retrieve.
 * @returns A promise resolving to the requested topic.
 */
export async function getTopicById(topicId: string): Promise<Topic | null> {
  const endpoint = `/forum/topics/${topicId}`;

  try {
    const response: Response = await apiClient(endpoint);

    if (response.status === 200) {
      const topic = await response.json();

      topic.creationDate = new Date(topic.creationDate);
      topic.formattedCreationDate = formatDateAgo(topic.creationDate);
      return topic;
    } else {
      console.warn(`Failed to fetch topic. Status: ${response.status}`);
      return null;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
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
export async function createTopic(title: string, description: string): Promise<Topic | null> {
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


/**
 * Fetch comments for a specific topic.
 *
 * @param topicId The ID of the topic to retrieve comments for.
 * @returns A promise resolving to a list of comments.
 */
export async function getCommentsByTopicId(topicId: string): Promise<Comment[]> {
  const endpoint = `/forum/topics/${topicId}/comments`;

  try {
    const response: Response = await apiClient(endpoint);

    if (response.status === 200) {
      const comments = await response.json();

      return comments.map((data: Comment) => {
        const comment = data;

        comment.creationDate = new Date(comment.creationDate);
        comment.formattedCreationDate = formatDateAgo(comment.creationDate);
        return comment;
      });
    } else {
      console.warn(`Failed to fetch comments. Status: ${response.status}`);
      return [];
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw error;
  }
}

/**
 * Send a new comment to a specific topic.
 *
 * @param topicId The ID of the topic to post the comment to.
 * @param content The content of the comment.
 * @returns A promise resolving to the created comment.
 */
export async function sendComment(topicId: number, content: string): Promise<Comment | null> {
  const endpoint = `/forum/topics/${topicId}/comments`;

  try {
    const response: Response = await apiClient(endpoint, {
      method: "POST",
      body: content,
    });

    if (response.status === 201) {
      const comment = await response.json();
      comment.creationDate = new Date(comment.creationDate);
      comment.formattedCreationDate = formatDateAgo(comment.creationDate);
      return comment as Comment;
    } else {
      console.warn(`Failed to send comment. Status: ${response.status}`);
      new Error("Failed to send comment");
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
  const sortedTopics = [...topics];

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
