import { LucideCheckCircle } from "lucide-react";
import React, { useState } from "react";
import { LuPlus, LuArrowLeft, LuArrowRight } from "react-icons/lu";

interface TeamMultiStepFormProps {
  onSubmit: (data: any) => void;
  onClose?: () => void;
}

const steps = ["Team Details", "Add Members", "Review & Confirm"];

export default function TeamMultiStepForm({
  onSubmit,
  onClose,
}: TeamMultiStepFormProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [memberEmail, setMemberEmail] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAddMember = () => {
    if (!memberEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(memberEmail)) {
      setError("Enter a valid email");
      return;
    }
    if (members.includes(memberEmail)) {
      setError("Member already added");
      return;
    }
    setMembers((prev) => [...prev, memberEmail]);
    setMemberEmail("");
    setError("");
  };

  const handleRemoveMember = (email: string) => {
    setMembers((prev) => prev.filter((m) => m !== email));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleNext = () => {
    if (step === 0 && !name.trim()) {
      setError("Team name is required");
      return;
    }
    setError("");
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError("");
    setStep((s) => s - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      onSubmit({ name, description, avatar, members });
      setSubmitting(false);
      if (onClose) onClose();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-4">
        {steps.map((label, i) => (
          <React.Fragment key={label}>
            <div
              className={`flex items-center gap-1 ${
                i === step ? "font-bold text-blue-700" : "text-gray-400"
              }`}
            >
              {i < step ? (
                <LucideCheckCircle className="text-green-500" />
              ) : (
                <span className="w-4 h-4 inline-block rounded-full border border-blue-300 bg-white" />
              )}
              <span className="text-xs">{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-blue-100 mx-1" />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Step Content */}
      {step === 0 && (
        <div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Team Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded px-2 py-1 w-full"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Team Avatar/Logo
            </label>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
            {avatar && (
              <div className="mt-2 text-xs text-gray-500">
                Selected: {avatar.name}
              </div>
            )}
          </div>
        </div>
      )}
      {step === 1 && (
        <div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Invite Members (by email)
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                className="border rounded px-2 py-1 flex-1"
                placeholder="user@example.com"
              />
              <button
                type="button"
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-1"
                onClick={handleAddMember}
              >
                <LuPlus /> Add
              </button>
            </div>
            {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
          </div>
          <ul className="mb-2">
            {members.map((email) => (
              <li
                key={email}
                className="flex items-center gap-2 text-sm bg-blue-50 rounded px-2 py-1 mb-1"
              >
                {email}
                <button
                  type="button"
                  className="ml-auto text-red-500 text-xs"
                  onClick={() => handleRemoveMember(email)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Review Team</h3>
          <div className="mb-2">
            <span className="font-medium">Name:</span> {name}
          </div>
          {description && (
            <div className="mb-2">
              <span className="font-medium">Description:</span> {description}
            </div>
          )}
          {avatar && (
            <div className="mb-2">
              <span className="font-medium">Avatar:</span> {avatar.name}
            </div>
          )}
          <div className="mb-2">
            <span className="font-medium">Members:</span>{" "}
            {members.length ? members.join(", ") : "None"}
          </div>
        </div>
      )}
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {step > 0 ? (
          <button
            type="button"
            className="flex items-center gap-1 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={handleBack}
          >
            <LuArrowLeft /> Back
          </button>
        ) : (
          <span />
        )}
        {step < steps.length - 1 ? (
          <button
            type="button"
            className="flex items-center gap-1 px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleNext}
          >
            Next <LuArrowRight />
          </button>
        ) : (
          <button
            type="submit"
            className="flex items-center gap-1 px-3 py-1 rounded bg-blue-700 text-white hover:bg-blue-800"
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create Team"}
          </button>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          className="mt-4 text-xs text-gray-500 underline"
          onClick={onClose}
        >
          Cancel
        </button>
      )}
    </form>
  );
}
