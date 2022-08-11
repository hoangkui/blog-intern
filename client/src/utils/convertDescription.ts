import { getArrayUrl } from "./getUrlImage";
import { decode } from "html-entities";
export function dataURLtoFile(dataurl: string, filename: string) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)![1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export default async (description: string) => {
  description = decode(description);
  const arrayImg = description.split(`"`).filter((x) => x.includes("data:"));

  const arrFile = arrayImg.map((item) => dataURLtoFile(item, "a.jpg"));
  const arrImgUrl = await getArrayUrl([...arrFile]);

  // replace src img
  let newDescription = description;
  [...arrayImg].map((item, index) => {
    newDescription = newDescription.replace(item, arrImgUrl[index]);
  });

  return newDescription;
};
