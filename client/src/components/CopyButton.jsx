import { useState } from 'react';

const CopyButton = ({ roomId }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="bg-[#00f5d4] text-black px-3 py-1 rounded-lg hover:bg-[#00e5c0] text-sm"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
};

export default CopyButton;
