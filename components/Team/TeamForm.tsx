import React, { useState } from "react";

interface TeamFormProps {
  onSubmit: (data: { name: string; description?: string }) => void;
  onClose?: () => void;
}

const TeamForm: React.FC<TeamFormProps> = ({ onSubmit, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSubmit({ name, description });
      setLoading(false);
      setName("");
      setDescription("");
      if (onClose) onClose();
    }, 1000); // mock async
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-[10px] shadow mb-4"
    >
      <h2 className="text-lg font-bold mb-2">Create a Team</h2>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Team Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-2 py-1 w-full"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Team"}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1 rounded border"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TeamForm;
