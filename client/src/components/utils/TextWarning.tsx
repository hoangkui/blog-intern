import React from "react";

const TextWarning = ({ children }: { children: React.ReactNode }) => {
  return (
    <h1 className="flex items-center justify-center text-3xl pt-24">
      {children}
    </h1>
  );
};

export default TextWarning;
