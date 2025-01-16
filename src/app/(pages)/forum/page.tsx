"use client";

import React, {useState, useEffect} from "react";
import {FaChevronDown} from "react-icons/fa";
import Image from "next/image";
import {useAuthContext} from "@/contexts/AuthContext";
import {getTopics, sortTopics} from "@/services/ForumService";
import {Topic} from "@/models/Topic";
import DisplayThreads from "@/components/forum/DisplayThreads";
import defaultProfilePicture from "@/assets/images/no-profile-pic.jpg";
import {Button} from "@/components/generic/Button";
import ThreadCreator from "@/components/forum/ThreadCreator";
import OwnedBySwitch from "@/components/forum/OwnedBySwitch";
import SortDropdown from "@/components/forum/SortDropdown";
import Loading from "@/components/generic/Loading";

export default function Forum() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [visibleTopics, setVisibleTopics] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState("Newest");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [ownedByMe, setOwnedByMe] = useState(false);
  const {userDetails} = useAuthContext();

  useEffect(() => {
    fetchTopics().then();
  }, []);

  useEffect(() => {
    if (ownedByMe) {
      const filteredTopics = allTopics.filter((topic) => topic.createdByUsername === userDetails?.username);
      setTopics(sortTopics(filteredTopics, sortOption));
    } else {
      setTopics(sortTopics(allTopics, sortOption));
    }
  }, [ownedByMe, allTopics, sortOption, userDetails]);

  const fetchTopics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedTopics = await getTopics();
      setAllTopics(fetchedTopics as Topic[]);
      setTopics(sortTopics(fetchedTopics as Topic[], sortOption));
    } catch (err) {
      setError("Failed to load threads. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    setIsDropdownOpen(false);
    const sortedTopics = sortTopics(allTopics, option);
    setTopics(sortedTopics);
  };

  const handleOwnedByMeChange = () => {
    setOwnedByMe(!ownedByMe);
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const loadMoreTopics = () => {
    setVisibleTopics((prev) => Math.min(prev + 6, topics.length));
  };

  const handleTopicCreated = () => {
    setSortOption("Newest")
    fetchTopics().then();
    setIsExpanded(false);
  };

  return (
    <div className="flex flex-col items-start pb-10 px-10 font-[family-name:var(--font-alatsi)]">
      <h1 className="mb-2">Forum</h1>

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
            <h2 className="text-2xl">{isExpanded ? "Create a thread" : "Start a thread!"}</h2>
          </div>

          <Image
            className={`opacity-40 hover:opacity-100 hover:duration-300 transform ${isExpanded ? "rotate-180" : ""}`}
            src="/double_arrow.svg"
            alt="Double Arrow"
            width={30}
            height={30}
          />
        </div>

        {isExpanded && <ThreadCreator onTopicCreated={handleTopicCreated}/>}

        <div className="flex justify-between items-center mt-6 mb-4">
          <h2 className="text-3xl">Threads</h2>

          <div className="ml-auto mr-5">
            <OwnedBySwitch ownedByMe={ownedByMe} onChange={handleOwnedByMeChange}/>
          </div>

          <SortDropdown
            sortOption={sortOption}
            onSortChange={handleSortChange}
            isDropdownOpen={isDropdownOpen}
            toggleDropdown={() => setIsDropdownOpen((prev) => !prev)}
          />
        </div>

        {isLoading ? (
          <Loading text={"Loading threads..."}/>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : topics.length === 0 ? (
          <p>No topics yet, start one!</p>
        ) : (
          <DisplayThreads topics={topics.slice(0, visibleTopics)}/>
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