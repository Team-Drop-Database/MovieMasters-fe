"use client";

import React, {useEffect, useState} from "react";
import {getTopicById} from "@/services/ForumService";
import {Topic} from "@/models/Topic";
import Loading from "@/components/generic/Loading";

export default function Thread({params}: { params: Promise<{ id: string }> }) {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        // Resolve the topic ID from params
        const resolvedParams = await params;
        const topicId = resolvedParams.id;
        const fetchedTopic = await getTopicById(topicId);

        if (fetchedTopic) {
          setTopic(fetchedTopic);
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

    fetchTopic().then();
  }, [params]);

  if (loading) {
    return <Loading/>
  }

  return (
    <div className="flex flex-col items-start pb-10 px-10 font-[family-name:var(--font-alatsi)] text-white">
      <h1 className="mb-5">Thread</h1>

      {!topic ? (
        <p>Topic not found.</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="flex flex-col items-start pb-10 px-10 font-[family-name:var(--font-alatsi)] text-white">
          <h1 className="mb-5 text-3xl font-bold">{topic.title}</h1>
          <p className="mb-3 text-lg">{topic.description}</p>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              <p className="text-sm text-gray-400">Created by: </p>
              <span className="ml-2 text-lg font-semibold">{topic.createdByUsername}</span>
            </div>
            <div className="flex items-center">
              <p className="text-sm text-gray-400">Posted on: </p>
              <span className="ml-2 text-lg">{topic.formattedCreationDate}</span>
            </div>
          </div>

          {/* You could render more information related to the topic like comments here */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold">Comments</h2>
            {/* Example: */}
            {/* {topic.comments.map(comment => <CommentCard key={comment.id} comment={comment} />)} */}
          </div>
        </div>
      )}
    </div>
  );

}
