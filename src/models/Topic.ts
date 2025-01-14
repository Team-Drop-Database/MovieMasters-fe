/**
 * Represents a Topic object.
 */
export type Topic = {
  id: number;
  title: string;
  description: string;
  author: string;
  profilePicture: string | null;
  comments: number;
  createdAt: Date;
}

export default Topic;