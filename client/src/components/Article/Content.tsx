import "react-medium-image-zoom/dist/styles.css";
import "react-quill/dist/quill.bubble.css";

import Chip from "@mui/material/Chip";
import parse, { domToReact, Element } from "html-react-parser";
import React, { useEffect, useRef } from "react";
import Zoom from "react-medium-image-zoom";
import { useNavigate } from "react-router-dom";

const options = {
  replace: (domNode: any) => {
    if (
      domNode instanceof Element &&
      domNode.attribs &&
      domNode.name === "p" &&
      (domNode.children[0] as Element).name === "img"
    ) {
      return (
        <div className="w-full flex justify-center my-4">
          <Zoom>
            <img src={(domNode.children[0] as Element).attribs.src} alt="" />
          </Zoom>
        </div>
      );
    }
    if (domNode instanceof Element && domNode.attribs && domNode.name === "p") {
      return <p className="py-2">{domToReact(domNode.children, options)}</p>;
    }
    if (
      domNode instanceof Element &&
      domNode.attribs &&
      domNode.name === "ul"
    ) {
      return (
        <ul className="list-disc pl-14 py-4">
          {domToReact(domNode.children, options)}
        </ul>
      );
    }
    if (domNode instanceof Element && domNode.attribs && domNode.name === "a") {
      return (
        <a
          className="underline"
          href={
            ((domNode.children[0] as Element)?.parent as Element).attribs.href
          }
          target="blank"
        >
          {domToReact(domNode.children, options)}
        </a>
      );
    }
  },
};
const URL_API_SPEECH =
  "https://storage.googleapis.com/speechify-api-cdn/speechifyapi.min.mjs";
function importModule(path: string) {
  // who knows what will be imported here?
  return import(path);
}
const Content = ({
  body,
  listTag,
  title,
  description,
}: {
  body: string;
  title: string;
  listTag: string[];
  description: string;
}) => {
  const navigate = useNavigate();
  const ref = useRef<any>();
  useEffect(() => {
    const mountWidget = async () => {
      importModule(URL_API_SPEECH).then(async (speechifyWidget) => {
        const config = {
          rootElement: document.getElementById("article"),
          customStyles: {
            widget: {
              zIndex: 5,
            },
          },
        };
        const widget = speechifyWidget.makeSpeechifyExperience(config);
        await widget.mount();
        ref.current = widget;
      });
    };
    mountWidget();
    return () => {
      const unMountWidget = async () => {
        await ref.current.unmount();
      };
      unMountWidget();
    };
  }, []);
  return (
    <div className="mx-44 border-solid border-[#ccc] border-b-2 text-xl font-roboto">
      <div id="article" style={{ overflowWrap: "anywhere" }}>
        <h1 className="font-bold text-4xl" id="article-title">
          {title}
        </h1>
        <h2 className="text-2xl my-6 font-medium">{description}</h2>
        <div>{parse(body, options)}</div>
      </div>
      <div className="pt-6 ml-[-6px] mb-6">
        {listTag.map((item) => (
          <Chip
            key={item}
            label={item}
            color={"default"}
            onClick={() => navigate(`/tag/${item}/`)}
            sx={{ margin: "4px" }}
          />
        ))}
      </div>
    </div>
  );
};

export default Content;
