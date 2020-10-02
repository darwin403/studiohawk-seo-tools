import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";

const MAX_ERRORS = 5;
const MAX_TAGS = 10000;
const MAX_FILE_SIZE = 5000000; // 5 MB

export default function File({ onUpload }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    // state
    setIsProcessing(true);
    setErrors([]);

    acceptedFiles.forEach((file) => {
      // bad file extension
      if (file.name.split(".").slice(-1)[0] !== "csv") {
        setIsProcessing(false);
        return setErrors([{ message: "Only .csv files are allowed!" }]);
      }

      // bad file size
      if (file.size >= MAX_FILE_SIZE) {
        setIsProcessing(false);
        return setErrors([
          { message: `File must be less than ${MAX_FILE_SIZE / 1000000} MB.` },
        ]);
      }

      // csv parse
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        comments: true,
        worker: true,
        complete: (results) => {
          setIsProcessing(false);

          if (results.errors.length !== 0) {
            return setErrors(results.errors.slice(0, MAX_ERRORS));
          }

          if (results.data.length === 0) {
            return setErrors([{ message: "No valid rows detected in file!" }]);
          }

          // validate tags
          const validTags = results.data
            .slice(0, MAX_TAGS)
            .filter(
              (item) =>
                "href" in item &&
                "languageCode" in item &&
                "countryCode" in item
            );

          // success
          onUpload(validTags);
        },
      });
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    onDrop,
  });

  return (
    <>
      <div className="button-group small clear align-right margin-0 ">
        <a className="button" href="/sample.csv" download>
          Sample CSV
        </a>
      </div>
      <div
        {...getRootProps()}
        tabIndex="false"
        className={
          "callout padding-3 " + (!isProcessing ? "primary" : "secondary")
        }
      >
        <input {...getInputProps()} disabled={isProcessing} />
        <div className="text-center" style={{ color: "gray" }}>
          {!isProcessing
            ? "Drag Drop a CSV file, or click to Browse."
            : "Processing ..."}
        </div>
      </div>
      {errors.length !== 0 && (
        <div className="callout alert">
          <ul className="vertical menu">
            {errors.map((error, i) => (
              <li key={i}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

File.defaultProps = {
  onUpload: (i) => i,
};

File.propTypes = {
  onUpload: PropTypes.func,
};
