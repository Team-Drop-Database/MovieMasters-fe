import React, {useState} from "react";
import BigTextField from "@/components/generic/BigTextField";
import {Button} from "@/components/generic/Button";
import {createTopic} from "@/services/ForumService";
import WarningAlert from "@/components/generic/alert/WarningAlert";

interface ThreadCreatorProps {
  onTopicCreated: () => void;
}

const ThreadCreator: React.FC<ThreadCreatorProps> = ({ onTopicCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [warning, setWarning] = useState<string | null>(null);

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
      onTopicCreated();
    } catch (err) {
      setWarning("Failed to create the thread. Please try again.");
    }
  };

  return (
    <div className="bg-background_primary p-5 pt-0 rounded-b-md mb-10 flex flex-col">
      {warning && (
        <WarningAlert
          message={warning}
          onClose={() => setWarning(null)}
        />
      )}
      <label className="text-md block mb-2">Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Give your thread a title"
        maxLength={100}
        className="h-8 w-full mb-5 outline-none placeholder-black rounded-md text-black py-1 px-2 bg-light_grey hover:bg-light_grey_active duration-300 hover:duration-300 font-[family-name:var(--font-jura)]"
      />
      <label className="text-md block mb-2">Description</label>
      <BigTextField
        value={description}
        onValueChange={setDescription}
        placeholder="Explain your thread or share your thoughts"
        className="h-[6.5rem] w-full mb-5"
      />
      <Button
        text="Create thread"
        onClick={handleCreateTopic}
        className="self-end"
      />
    </div>
  );
};

export default ThreadCreator;
