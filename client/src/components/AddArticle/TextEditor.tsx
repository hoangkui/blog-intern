import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.snow.css";

import React from "react";
import ReactQuill from "react-quill";

import { formats, modules } from "../../utils/static";

const TextEditor = ({
  item,
  value,
  onChange,
}: {
  item: { label: string; name: string; placeholder: string };
  value: string;
  onChange: (e: string) => void;
}) => {
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (e.clipboardData.files[0]) {
      e.preventDefault();
    }
  };
  return (
    <>
      <div className="flex items-center gap-5 w-[720px]">
        <div onPasteCapture={(e) => handlePaste(e)} className="w-full">
          <ReactQuill
            style={{
              minHeight: "300px",
            }}
            placeholder="Write something"
            defaultValue={value}
            onChange={onChange}
            theme="snow"
            className="w-full last-child:h-fit whitespace-pre inline-block leading-7"
            modules={modules}
            formats={formats}
          />
        </div>
      </div>
    </>
  );
};

export default TextEditor;
