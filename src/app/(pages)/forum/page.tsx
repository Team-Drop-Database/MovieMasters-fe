"use client";

import React, {useState, useEffect, useRef} from "react";
import {FaChevronDown} from "react-icons/fa";
import Image from "next/image";
import {useAuthContext} from "@/contexts/AuthContext";
import {createTopic, getTopics, sortTopics} from "@/services/ForumService";
import {Button} from "@/components/generic/Button";
import BigTextField from "@/components/generic/BigTextField";
import WarningAlert from "@/components/generic/alert/WarningAlert";
import {Topic} from "@/models/Topic";
import DisplayTopics from "@/components/forum/DisplayTopics";
import defaultProfilePicture from "@/assets/images/no-profile-pic.jpg";

export default function Forum() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [visibleTopics, setVisibleTopics] = useState(6);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState("Newest");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {userDetails} = useAuthContext();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchTopics().then();
  }, []);

  const fetchTopics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedTopics = await getTopics();
      setTopics(sortTopics(fetchedTopics as Topic[], sortOption));
    } catch (err) {
      console.error("Failed to load topics:", err);
      setError("Failed to load topics. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const loadMoreTopics = () => {
    setVisibleTopics((prev) => Math.min(prev + 6, topics.length));
  };

  const handleCreateTopic = async () => {
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
      await fetchTopics();
      setIsExpanded(false);
    } catch (err) {
      setError("Failed to create the topic. Please try again.");
    }
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    setIsDropdownOpen(false);

    const sortedTopics = sortTopics(topics, option);
    setTopics(sortedTopics);
  };

  // Close the dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropDown = dropdownRef.current;
      if (dropDown && !dropDown.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <div className="flex flex-col items-start pb-10 px-10 font-[family-name:var(--font-alatsi)] text-white">
      <h1 className="mb-5">Forum</h1>

      {warning && <WarningAlert message={warning} onClose={() => setWarning(null)}/>}

      <div className="mx-auto w-full sm:w-3/4 my-5">
        <div
          className={`flex items-center justify-between mb-0 p-5 bg-background_primary rounded-md cursor-pointer ${isExpanded ? "rounded-b-none" : ""}`}
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
            <h2 className="text-2xl">{isExpanded ? "Create a Topic" : "Start a Topic!"}</h2>
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
              text="Create Topic"
              onClick={handleCreateTopic}
              className="self-end"
              enabled={!!title && !!description}
            />
          </div>
        )}

        <div className="flex justify-between items-center mt-6 mb-4">
          <h2 className="text-3xl">Topics</h2>

          <div className="relative inline-block" ref={dropdownRef}>
            <Button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              text="Sort"
              className="rounded-md"
            />

            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-background_secondary rounded-lg shadow-lg z-50">
                {["Newest", "Oldest", "Most Popular", "Least Popular", "A-Z", "Z-A"].map((option, index, array) => (
                  <p
                    key={option}
                    className={`cursor-pointer px-4 py-2 text-sm ${sortOption === option ? "bg-blue-800 text-white" : "hover:bg-background_primary"} 
            ${index === 0 ? "rounded-t-lg" : ""} // Rounded top for the first item
            ${index === array.length - 1 ? "rounded-b-lg" : ""} // Rounded bottom for the last item
          `}
                    onClick={() => handleSortChange(option)}
                  >
                    {option}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <p>Loading topics...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : topics.length === 0 ? (
          <p>No topics yet, start one!</p>
        ) : (
          <DisplayTopics topics={topics.slice(0, visibleTopics)}/>
        )}

        {visibleTopics < topics.length && (
          <div className="flex justify-center mt-4">
            <Button
              onClick={loadMoreTopics}
              className="px-5 py-2 rounded-md inline-flex items-center"
              text="Load more"
            >
              <FaChevronDown className="mr-2"/>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}