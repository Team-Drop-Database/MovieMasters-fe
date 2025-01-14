"use client";

import React, { useState, useEffect } from "react";
import { FaChevronDown, FaCommentAlt } from "react-icons/fa";
import Image from "next/image";
import { useAuthContext } from "@/contexts/AuthContext";
import {createTopic, getTopics} from "@/services/ForumService";
import defaultProfilePicture from "@/assets/images/no-profile-pic.jpg";
import {Button} from "@/components/generic/Button";
import BigTextField from "@/components/generic/BigTextField";
import WarningAlert from "@/components/generic/alert/WarningAlert";
import Topic from "@/models/Topic";

export default function Forum() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [threads, setThreads] = useState([]);
  const [visibleThreads, setVisibleThreads] = useState(6);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { userDetails } = useAuthContext();

  // Fetch threads from the backend
  const fetchThreads = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedThreads = await getTopics();
      setThreads(fetchedThreads as Topic[]);
    } catch (err) {
      console.error("Failed to load threads:", err);
      setError("Failed to load threads. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch threads on component mount
  useEffect(() => {
    fetchThreads();
  }, []);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const loadMoreThreads = () => {
    setVisibleThreads((prev) => Math.min(prev + 6, threads.length));
  };

  const handleCreateThread = async () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    // Check if either title or description is empty or just spaces
    if (!trimmedTitle || !trimmedDescription) {
      setWarning("Both title and description are required!");
      return;
    }

    try {
      await createTopic(trimmedTitle, trimmedDescription);
      setTitle("");
      setDescription("");
      await fetchThreads();
      setIsExpanded(false);
    } catch (err) {
      setError("Failed to create the thread. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-start pb-10 px-10 font-[family-name:var(--font-alatsi)] text-white">
      <h1 className="mb-5">Forum</h1>

      {warning && <WarningAlert message={warning} onClose={() => setWarning(null)} />}

      <div className="mx-auto w-3/4 my-5">
        <div
          className={`flex items-center justify-between mb-0 p-5 bg-background_primary rounded-md cursor-pointer ${
            isExpanded ? "rounded-b-none" : ""
          }`}
          onClick={toggleExpand}
        >
          <div className="flex items-center space-x-6">
            <div className="relative w-16 h-16">
              <Image
                className="rounded-full object-cover shadow-md"
                src={userDetails?.profileUrl || defaultProfilePicture}
                alt="Profile"
                fill
                sizes="55px"
              />
            </div>
            <h2 className="text-2xl">{isExpanded ? "Create a Thread" : "Start a Thread!"}</h2>
          </div>

          <Image
            className={`opacity-40 hover:opacity-100 transform ${isExpanded ? "rotate-180" : ""}`}
            src="/double_arrow.svg"
            alt="Double Arrow"
            width={30}
            height={30}
          />
        </div>

        {isExpanded && (
          <div className="bg-background_primary p-5 pt-0 rounded-b-md mb-10 flex flex-col">
            <label className="text-md block mb-2">Title</label>
            <BigTextField
              value={title}
              onValueChange={setTitle}
              placeholder="Give your topic a title"
              className="h-10 w-full mb-5"
              maxLength={100}
            />
            <label className="text-md block mb-2">Description</label>
            <BigTextField
              value={description}
              onValueChange={setDescription}
              placeholder="Explain your topic or share your thoughts"
              className="h-[7rem] w-full mb-5"
            />
            <Button
              text="Create Thread"
              onClick={handleCreateThread}
              className="bg-blue-500 text-white px-5 py-2 rounded-md self-end"
              enabled={!!title && !!description}
            />
          </div>
        )}

        <div>
          <h2 className="text-3xl mb-3 mt-6">Threads</h2>

          {isLoading ? (
            <p>Loading threads...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : threads.length === 0 ? (
            <p>No threads yet, start one!</p>
          ) : (
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {threads.slice(0, visibleThreads).map((thread, index) => (
                <div
                  key={index}
                  className="bg-background_primary p-4 rounded-md mb-4 flex flex-col"
                >
                  <div className="flex items-start mb-1">
                    <Image
                      className="w-12 h-12 rounded-full object-cover shadow-md mr-4"
                      src={thread.createdBy || defaultProfilePicture}
                      alt="Profile"
                      width={50}
                      height={50}
                    />
                    <div className="flex-grow">
                      <h3 className="text-base mb-2">{thread.title}</h3>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-auto text-xs text-gray-400">
                    <p className="text-sm">{thread.author}</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-blue-800">
                        <FaCommentAlt className="mr-1" /> {thread.comments}
                      </div>
                      <span>{thread.timeAgo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {visibleThreads < threads.length && (
          <button
            onClick={loadMoreThreads}
            className="flex items-center mt-5 mx-auto bg-blue-800 text-white px-5 py-2 rounded-md"
          >
            <FaChevronDown className="mr-2" /> Load More
          </button>
        )}
      </div>
    </div>
  );
}
