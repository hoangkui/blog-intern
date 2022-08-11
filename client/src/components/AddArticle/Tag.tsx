import { Chip, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useRef, useState } from "react";
import swal from "sweetalert";

const Tags = ({
  data,
  handleDelete,
}: {
  data: string;
  handleDelete: (value: string) => void;
}) => {
  return (
    <Chip label={data} variant="outlined" onDelete={() => handleDelete(data)} />
  );
};

export default function InputTags({
  tags,
  setTags,
}: {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const tagRef = useRef<HTMLInputElement>();
  const handleDelete = (value: string) => {
    const newtags = tags.filter((val) => val !== value);
    setTags(newtags);
  };
  const handleOnSubmit = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === " ") {
      if (!tagRef.current) return;
      if (
        (tagRef.current.value as string) == " " ||
        (tagRef.current.value as string) == ""
      ) {
        tagRef.current.value = "";
        return;
      }
      if (tagRef.current.value.length > 30) {
        swal("Tag maxium 30 characteres");
        // tagRef.current.blur;
        tagRef.current.focus();
        return;
      }
      if (tags.length > 4) {
        swal("Maxium 5 tags");
        return;
      }
      if (tags.includes(tagRef.current.value)) {
        swal(`${tagRef.current.value} is exited`);
        tagRef.current.value = "";
        return;
      }
      setTags([...tags, (tagRef.current.value as string).toLowerCase()]);
      tagRef.current.value = "";
      return;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
        }}
        className="max-w-100"
      >
        {tags.map((data, index) => {
          return <Tags data={data} handleDelete={handleDelete} key={index} />;
        })}
      </Box>
      <TextField
        onChange={(e) => {
          const nospecial = /^[a-zA-Z0-9_.-]*$/;
          if (!nospecial.test(e.target.value)) {
            if (!tagRef.current) return;
            tagRef.current.value = tagRef.current.value.slice(0, -1);
          }
        }}
        disabled={tags.length > 4}
        multiline
        maxRows={5}
        onKeyUp={(e) => handleOnSubmit(e)}
        onKeyDown={(e) => {
          if (e.key === " ") e.preventDefault();
        }}
        inputRef={tagRef}
        type="text"
        fullWidth
        variant="standard"
        size="small"
        sx={{ margin: "1rem 0" }}
        margin="none"
        placeholder={tags.length < 5 ? "Enter tag and space to create" : ""}
      />
    </Box>
  );
}
