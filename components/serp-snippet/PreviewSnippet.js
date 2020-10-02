import { useEffect, useState } from "react";
import { ContentState, Editor, EditorState } from "draft-js";
import PropTypes from "prop-types";

import { takeScreenShot } from "@/utils/screenshot";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUndo,
  faCamera,
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function PreviewSnippet(props) {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState(EditorState.createEmpty());
  const [url, setUrl] = useState(EditorState.createEmpty());
  const [description, setDescription] = useState(EditorState.createEmpty());
  const [showOptions, setShowOptions] = useState(false);

  // get text from draft.js editor states
  const getTextFromEditor = (editorState) =>
    editorState.getCurrentContent().getPlainText();

  const titleText = getTextFromEditor(title);
  const urlText = getTextFromEditor(url);
  const descriptionText = getTextFromEditor(description);

  // functions
  const setSnippetText = ({ title, url, description }) => {
    if (title) {
      setTitle(() =>
        EditorState.createWithContent(ContentState.createFromText(title))
      );
    }

    if (url) {
      setUrl(() =>
        EditorState.createWithContent(ContentState.createFromText(url))
      );
    }

    if (description) {
      setDescription(() =>
        EditorState.createWithContent(ContentState.createFromText(description))
      );
    }
  };

  const resetSnippet = () =>
    setSnippetText({
      title: props.title,
      url: props.url,
      description: props.description,
    });

  const getContentWidth = (element) => {
    const styles = getComputedStyle(element);

    return parseInt(
      element.clientWidth -
        parseFloat(styles.paddingLeft) -
        parseFloat(styles.paddingRight)
    );
  };

  const getPixelLength = (string, field) => {
    const span = document.createElement("span");
    const text = document.createTextNode(string);
    span.append(text);
    span.style.display = "inline-block";
    span.style.fontFamily = "arial, sans-serif";
    span.style.fontSize = field === "title" ? "20px" : "14px";
    document.body.appendChild(span);
    const pixelLength = getContentWidth(span);
    document.body.removeChild(span);

    return pixelLength;
  };

  // effects
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setSnippetText({
      title: props.title,
      url: props.url,
      description: props.description,
    });
  }, [props.title, props.url, props.description]);

  useEffect(() => {
    props.onModify({
      title: titleText,
      url: urlText,
      description: descriptionText,
    });
  }, [titleText, urlText, descriptionText, props.onModify]);

  // render
  if (!mounted) return false;

  const pixelLength = {
    title: getPixelLength(titleText, "title"),
    description: getPixelLength(descriptionText, "description"),
  };
  
  const pixelLengthLimit = {
    min: {
      title: 250,
      description: 400,
    },
    max: {
      title: 580,
      description: 920,
    },
  };

  const isGoodTitle =
    pixelLength.title >= pixelLengthLimit.min.title &&
    pixelLength.title <= pixelLengthLimit.max.title;
  const isGoodDescription =
    pixelLength.description >= pixelLengthLimit.min.description &&
    pixelLength.description <= pixelLengthLimit.max.description;

  return (
    <>
      <div
        className="card snippet"
        onMouseEnter={() => setShowOptions(true)}
        onMouseLeave={() => setShowOptions(false)}
        style={{
          border: "5px dotted hsl(0, 0%, 90%)",
        }}
      >
        {props.isFetching && <div className="fetching"></div>}
        <div className="card-section" style={{ padding: "2rem 2rem" }}>
          <div className="url">
            <Editor editorState={url} onChange={setUrl} />
          </div>
          <h4 className="title">
            <Editor editorState={title} onChange={setTitle} />
          </h4>
          <div className="description">
            <Editor editorState={description} onChange={setDescription} />
          </div>
        </div>
        {showOptions && (
          <div className="options" data-html2canvas-ignore="true">
            <div className="button-group clear large no-gaps">
              <button className="button" onClick={resetSnippet}>
                <FontAwesomeIcon icon={faUndo} />
              </button>
              <button
                className="button"
                onClick={() =>
                  takeScreenShot(
                    ".snippet",
                    props.url ? `${props.url}-snippet.png` : "snippet.png"
                  )
                }
              >
                <FontAwesomeIcon icon={faCamera} />
              </button>
            </div>
          </div>
        )}
      </div>
      <div
        className={
          "callout " +
          (isGoodTitle && isGoodDescription
            ? "success"
            : !isGoodTitle && !isGoodDescription
            ? "alert"
            : "warning")
        }
      >
        <ul className="vertical menu">
          <li>
            <FontAwesomeIcon
              icon={isGoodTitle ? faCheckCircle : faExclamationCircle}
              style={{
                marginRight: "0.75rem",
                color: isGoodTitle ? "rgb(77, 144, 82)" : "#cc4b37",
              }}
            />
            {isGoodTitle
              ? `Title is between ${pixelLengthLimit.min.title} pixels and ${pixelLengthLimit.max.title} pixels.`
              : `Title should be between ${pixelLengthLimit.min.title} pixels and ${pixelLengthLimit.max.title} pixels.`}{" "}
            Title is currently <b>{pixelLength.title} pixels</b> long.
          </li>
          <li>
            <FontAwesomeIcon
              icon={isGoodDescription ? faCheckCircle : faExclamationCircle}
              style={{
                marginRight: "0.75rem",
                color: isGoodDescription ? "rgb(77, 144, 82)" : "#cc4b37",
              }}
            />
            {isGoodDescription
              ? `Description is between ${pixelLengthLimit.min.description} pixels and ${pixelLengthLimit.max.description} pixels.`
              : `Description should be between ${pixelLengthLimit.min.description} pixels and ${pixelLengthLimit.max.description} pixels.`}{" "}
            Description is currently <b>{pixelLength.description} pixels</b>{" "}
            long.
          </li>
        </ul>
      </div>
    </>
  );
}

PreviewSnippet.defaultProps = {
  title: "Title",
  url: "website.com",
  description: "Description",
  isFetching: false,
  onModify: (i) => i,
};

PreviewSnippet.propTypes = {
  title: PropTypes.string,
  url: PropTypes.string,
  description: PropTypes.string,
  isFetching: PropTypes.bool,
  onModify: PropTypes.func,
};
