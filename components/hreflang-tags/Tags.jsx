import { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import isEqual from "lodash/isEqual";
import validator from "validator";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import countries from "@/utils/countries";
import languages from "@/utils/languages";

const MAX_TAGS_RENDER = 10;

function Tags(props) {
  const defaultTag = {
    href: "",
    languageCode: "",
    countryCode: "",
  };

  const [tags, setTags] = useState([]);

  useEffect(() => {
    setTags(props.tags);
  }, [props.tags]);

  // TODO: Should optimize performance, update single tag instead of entire tags.
  const setTag = (index, field, value) => {
    setTags((prevTags) => {
      const newTags = [...prevTags];

      if (newTags?.[index]) {
        newTags[index] = Object.assign({}, newTags[index], {
          [field]: value,
        });
      } else {
        newTags[index] = Object.assign({}, defaultTag, { [field]: value });
      }

      if (isEqual(newTags[index], defaultTag)) {
        newTags.splice(index, 1);
      }

      return newTags;
    });
  };

  const removeTag = (index) => {
    setTags((prevTags) => {
      const newTags = [...prevTags];
      newTags.splice(index, 1);
      return newTags;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // validate tags
    const validatedTags = tags.map((tag) => ({
      ...tag,
      isValid: validator.isURL(tag.href),
    }));
    setTags(validatedTags);

    // filter invalid tags
    const validTags = tags.filter((tag) => validator.isURL(tag.href));
    props.onGenerate(validTags);
  };

  return (
    <>
      {tags.length > MAX_TAGS_RENDER && (
        <div className="callout warning small">
          Total of <b>{tags.length}</b> tag(s) have been loaded and{" "}
          <b>will be generated</b> below. However, only first {MAX_TAGS_RENDER}{" "}
          tag(s) are shown below due to browser performance constraints.
        </div>
      )}
      <form className="margin-vertical-2" onSubmit={handleSubmit}>
        {[...tags, defaultTag]
          .slice(0, MAX_TAGS_RENDER)
          .map(({ href, languageCode, countryCode, isValid }, i) => (
            <div className="input-group position-relative" key={i}>
              <input
                type="text"
                className="input-group-field"
                style={
                  isValid !== undefined && !isValid
                    ? {
                        borderColor: "#cc4b37",
                        backgroundColor: "#faedeb",
                      }
                    : {}
                }
                placeholder={`https://${
                  languageCode && countryCode
                    ? `${languageCode}-${countryCode}.`
                    : languageCode
                    ? `${languageCode}.`
                    : ""
                }example.com`}
                value={href}
                onChange={(e) => setTag(i, "href", e.target.value)}
              />

              <select
                className="input-group-field"
                value={languageCode}
                onChange={(e) => setTag(i, "languageCode", e.target.value)}
              >
                <option value="">Language</option>
                {languages.map((language, i) => (
                  <option value={language.code} key={i}>
                    {language.name}
                  </option>
                ))}
              </select>
              <select
                className="input-group-field"
                value={countryCode}
                onChange={(e) => setTag(i, "countryCode", e.target.value)}
              >
                <option value="">Country</option>
                {countries.map((country, i) => (
                  <option value={country.code} key={i}>
                    {country.name}
                  </option>
                ))}
              </select>
              <div
                className="position-absolute"
                style={{ right: "-3rem" }}
              >
                <button
                  type="button"
                  className="button clear alert"
                  style={{ visibility: tags?.[i] ? "visible" : "hidden" }}
                  onClick={() => removeTag(i)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
          ))}
        <button type="submit" className="button expanded">
          Generate HREF Tags
        </button>
      </form>
    </>
  );
}

Tags.defaultProps = {
  tags: [],
  onGenerate: (i) => i,
};

Tags.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      languageCode: PropTypes.string,
      countryCode: PropTypes.string,
    })
  ),
  onGenerate: PropTypes.func,
};

export default memo(Tags);
