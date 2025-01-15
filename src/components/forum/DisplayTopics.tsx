import React from 'react';
import Image from 'next/image';
import {FaCommentAlt} from 'react-icons/fa';
import defaultProfilePicture from '@/assets/images/no-profile-pic.jpg';
import {Topic} from '@/models/Topic';
import {useRouter} from "next/navigation";

// Truncate text function
function truncateText(text: string, maxLength: number): string {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
}

interface DisplayTopicsProps {
  topics: Topic[];
}

const DisplayTopics: React.FC<DisplayTopicsProps> = ({topics}) => {
  const router = useRouter();

  const handleTopicClick = (id: number) => {
    router.push(`/forum/threads/${id}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {topics.map((topic) => (
        <div key={topic.id} className="bg-background_primary p-4 rounded-md mb-4 flex flex-col shadow-md cursor-pointer"
             onClick={() => handleTopicClick(topic.id)}>
          <div className="flex items-start mb-1">
            <Image
              className="w-12 h-12 rounded-full object-cover shadow-md mr-4 aspect-square"
              src={topic.createdByProfilePicture || defaultProfilePicture}
              alt="Profile"
              width={50}
              height={50}
            />
            <div className="flex-grow">
              <h3 className="text-base mb-2">{truncateText(topic.title, 50)}</h3>
              <p className="text-sm">{truncateText(topic.description, 65)}</p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-auto text-xs text-gray-400">
            <p className="text-sm">{topic.createdByUsername}</p>
            <div className="flex items-center space-x-1">
              {/* Aligning the comment count and icon */}
              <div className="flex items-center">
                <span>{topic.amountComments}</span>
                <FaCommentAlt className="ml-1 text-blue-800"/>
              </div>
              <span className="min-w-[60px] text-right">{topic.formattedCreationDate}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DisplayTopics;
