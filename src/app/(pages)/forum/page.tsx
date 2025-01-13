"use client";

import React, { useState } from "react";
import {FaChevronDown, FaCommentAlt} from "react-icons/fa";
import Image from "next/image";
import { useAuthContext } from "@/contexts/AuthContext";
import defaultProfilePicture from "@/assets/images/no-profile-pic.jpg";

export default function Forum() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleThreads, setVisibleThreads] = useState(6);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { userDetails } = useAuthContext();

  const threads = [  {
    title: "Selling a Business and Scaling Another Amidst Tragedy.",
    author: "Michele Hansen",
    comments: 3,
    timeAgo: "5d ago",
    profilePicture: null,
  },  {
    title: "Selling a Business and Scaling Another Amidst Tragedy.",
    author: "Michele Hansen",
    comments: 3,
    timeAgo: "5d ago",
    profilePicture: null,
  },  {
    title: "Selling a Business and Scaling Another Amidst Tragedy.",
    author: "Michele Hansen",
    comments: 3,
    timeAgo: "5d ago",
    profilePicture: null,
  },  {
    title: "Selling a Business and Scaling Another Amidst Tragedy.",
    author: "Michele Hansen",
    comments: 3,
    timeAgo: "5d ago",
    profilePicture: null,
  },  {
    title: "Selling a Business and Scaling Another Amidst Tragedy.",
    author: "Michele Hansen",
    comments: 3,
    timeAgo: "5d ago",
    profilePicture: null,
  },  {
    title: "Selling a Business and Scaling Another Amidst Tragedy.",
    author: "Michele Hansen",
    comments: 3,
    timeAgo: "5d ago",
    profilePicture: null,
  },  {
    title: "Selling a Business and Scaling Another Amidst Tragedy.",
    author: "Michele Hansen",
    comments: 3,
    timeAgo: "5d ago",
    profilePicture: null,
  },  {
    title: "Selling a Business and Scaling Another Amidst Tragedy.",
    author: "Michele Hansen",
    comments: 3,
    timeAgo: "5d ago",
    profilePicture: null,
  },  {
    title: "Selling a Business and Scaling Another Amidst Tragedy.",
    author: "Michele Hansen",
    comments: 3,
    timeAgo: "5d ago",
    profilePicture: null,
  },];

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const loadMoreThreads = () => {
    setVisibleThreads((prev) => Math.min(prev + 6, threads.length));
  };

  const handleCreateThread = () => {
    if (!title || !description) {
      alert("Both title and description are required!");
      return;
    }
    alert("Thread created successfully!");
    setTitle("");
    setDescription("");
  };

  return (
    <div className="flex flex-col items-start pb-10 px-10 font-[family-name:var(--font-alatsi)] text-white">
      <h1 className="mb-5">Forum</h1>

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
          <div className="bg-background_primary p-5 pt-0 rounded-b-md mb-10">
            <label className="text-md block mb-2">Title</label>
            <input
              type="text"
              placeholder="What's your topic about?"
              className="w-full p-3 rounded-md mb-5 text-black"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label className="text-md block mb-2">Description</label>
            <textarea
              placeholder="Let's share what's going on your mind..."
              className="w-full p-3 rounded-md mb-5 text-black"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <button
              className="bg-blue-500 text-white px-5 py-2 rounded-md"
              onClick={handleCreateThread}
            >
              Create Thread
            </button>
          </div>
        )}

        <div>
          <h2 className="text-3xl mb-3 mt-6">Threads</h2>

          {threads.length === 0 ? (
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
                      src={thread.profilePicture || defaultProfilePicture}
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
            <FaChevronDown  className="mr-2" /> Load More
          </button>
        )}
      </div>
    </div>
  );
}
