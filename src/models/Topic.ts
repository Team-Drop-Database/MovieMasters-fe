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
  creationDate: Date;
  formattedCreationDate: string;
}

export default Topic;