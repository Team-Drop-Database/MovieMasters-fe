/**
 * Represents a Comment object.
 */
export interface Comment {
  id: string;
  content: string;
  username: string;
  profilePicture: string;
  creationDate: Date;
  formattedCreationDate: string;
}
