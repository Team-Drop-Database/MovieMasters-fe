"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation"; // For routing
import { getTopicById, getCommentsByTopicId, sendComment } from "@/services/ForumService";
import { Topic } from "@/models/Topic";
import { Comment } from "@/models/Comment";
import Loading from "@/components/generic/Loading";
import { FaPaperPlane } from "react-icons/fa";
import Image from "next/image";
import defaultProfilePicture from "@/assets/images/no-profile-pic.jpg";
import { useAuthContext } from "@/contexts/AuthContext";

export default function Thread({ params }: { params: Promise<{ id: string }> }) {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [comments, setComments] = useState<Comment[] | null>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const commentsRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter(); // For navigation
  const { userDetails } = useAuthContext();

  useEffect(() => {
    const fetchTopicAndComments = async () => {
      try {
        const resolvedParams = await params;
        const topicId = resolvedParams.id;

        const fetchedTopic = await getTopicById(topicId);
        const fetchedComments = await getCommentsByTopicId(topicId);

        if (fetchedTopic) {
          setTopic(fetchedTopic);
          setComments(fetchedComments.sort((a, b) => a.creationDate.getTime() - b.creationDate.getTime())); // Sort oldest to newest
          console.log(fetchedComments)
        } else {
          setError("Topic not found.");
        }
      } catch (err) {
        setError("Failed to load the topic. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopicAndComments().then();
  }, [params]);

  const handleSendComment = async () => {
    if (!newComment.trim() || !topic) return;

    try {
      const newCommentObject = await sendComment(topic.id, newComment);
      setComments((prevComments) => [...(prevComments || []), newCommentObject]);
      setNewComment(""); // Clear the input field
      scrollToBottom(); // Scroll to the bottom
    } catch (err) {
      console.error("Failed to send comment:", err);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents new lines when pressing Enter
      handleSendComment().then(); // Sends the comment when Enter is pressed
    }
  };

  const scrollToBottom = () => {
    const commentsSlider = commentsRef.current as HTMLDivElement;
    if (commentsSlider) {
      commentsSlider.scrollTop = commentsSlider.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom(); // Scroll to the bottom when comments are updated
  }, [comments]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-start pb-10 px-10 font-[family-name:var(--font-alatsi)]">
      {/* Header */}
      <h1>Thread</h1>

      {/* Main Thread Content */}
      <div className="flex flex-col w-full max-w-4xl mx-auto">
        {/* Back to Forum */}
        <div
          className="text-gray-300 mb-1 cursor-pointer hover:text-gray-200 hover:duration-300"
          onClick={() => router.push("/forum")} // Replace "/forum" with the actual forum route
        >
          <span className="mr-2 text-lg">&lt;&lt; Back to forum</span>
        </div>

        {/* Thread Content Div */}
        <div className="bg-background_primary py-5 p-8 rounded-lg shadow-lg">
          {/* Topic Section */}
          {!topic ? (
            <p>Topic not found.</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <div className="mb-3">
                {/* Title */}
                <h1 className="text-3xl mb-1">{topic.title}</h1>

                {/* Description */}
                <p className="text-lg mb-3 text-gray-300">{topic.description}</p>

                {/* Profile Section */}
                <div className="flex items-center space-x-4">
                  {/* Profile Picture */}
                  <div className="relative w-14 h-14">
                    <Image
                      src={topic.createdByProfilePicture || defaultProfilePicture}
                      alt="Profile"
                      className="rounded-full object-cover"
                      fill
                      sizes="56px"
                    />
                  </div>

                  {/* Name and Date */}
                  <div>
                    <p className="text-[1.1rem] text-gray-400">
                      {topic.createdByUsername}
                    </p>
                    <p className="text-[1.1rem] text-gray-400">
                      {topic.formattedCreationDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div
                ref={commentsRef}
                className="flex flex-col space-y-4 max-h-[15rem] min-h-[15rem] overflow-y-auto scrollbar-hide"
              >
                {comments && comments.length > 0 ? (
                  comments
                    .sort((a, b) => a.creationDate.getTime() - b.creationDate.getTime()) // Sort newest to oldest
                    .map((comment) => (
                      <div
                        key={comment.id}
                        className="border-t border-gray-300 text-gray-300 p-4 shadow-sm text-sm flex space-x-4"
                      >
                        <div className="relative w-12 h-12">
                          <Image
                            src={comment.profilePicture || defaultProfilePicture}
                            alt={comment.username}
                            className="rounded-full object-cover"
                            fill
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <p className="font-bold">{comment.username}</p>
                          <p>{comment.content}</p>
                          <p className="text-xs text-gray-500">{comment.formattedCreationDate}</p>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-center text-gray-300">
                    No one commented yet, be the first one!
                  </p>
                )}
              </div>

              {/* Add Comment Section */}
              <div className="mt-6 flex items-start space-x-4">
                {/* User Profile Picture */}
                <div className="relative w-12 h-12">
                  <Image
                    src={userDetails?.profileUrl || defaultProfilePicture}
                    alt="Profile"
                    className="rounded-full object-cover"
                    fill
                    sizes="48px"
                  />
                </div>

                {/* Input Field and Send Icon */}
                <div className="flex-grow flex items-center">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={handleKeyDown} // Add onKeyDown to handle Enter key
                    className="w-full bg-gray-700 text-gray-300 p-3 rounded-md outline-none hover:bg-gray-600 transition-colors"
                  />
                  {/* Floating Send Icon */}
                  <FaPaperPlane
                    onClick={handleSendComment}
                    className="ml-3 text-gray-300 hover:text-gray-200 hover:duration-300 cursor-pointer"
                    size={22}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
