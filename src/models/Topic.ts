/**
 * Represents a Topic object.
 */
export type Topic = {
  id: number;
  title: string;
  description: string;
  createdByUsername: string;
  createdByProfilePicture: string | null;
  amountComments: number;
  creationDate: string;
}

export default Topic;