export const arrayInput = [
  {
    name: "title",
    label: "Title",
    placeholder: "Enter your title",
  },
  {
    name: "body",
    label: "Body",
    placeholder: "What 's this article about?",
  },
  {
    name: "description",
    label: "Description",
    placeholder: "Write your article(in markdown)",
  },
  {
    name: "tagList",
    label: "Tag",
    placeholder: "Enter tags",
  },
];

export const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

export const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];
