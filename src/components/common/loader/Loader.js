import React, { useState, useEffect, useRef } from "react";
import Spinner from "react-bootstrap/Spinner";
import "./Loader.css";

function Loader(props) {
  const [show, setShow] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => {
    setShow(props.show);
    if (props.show && loaderRef.current) {
      // When the loader is shown and the ref is not null, focus on the loader
      loaderRef.current.focus();
    }
  }, [props.show]);

  return (
    <>
      {show && (
        <div
          className="loader-overlay"
          tabIndex="0"
          ref={loaderRef}
          onKeyDown={(e) => {
            // Handle focus navigation within the loader
            if (e.key === "Tab") {
              e.preventDefault();
              if (loaderRef.current) {
                const focusableElements = loaderRef.current.querySelectorAll(
                  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                if (e.shiftKey) {
                  if (document.activeElement === firstElement) {
                    lastElement.focus();
                  } else {
                    const index = Array.from(focusableElements).indexOf(document.activeElement);
                    focusableElements[index - 1]?.focus();
                  }
                } else {
                  if (document.activeElement === lastElement) {
                    firstElement.focus();
                  } else {
                    const index = Array.from(focusableElements).indexOf(document.activeElement);
                    focusableElements[index + 1]?.focus();
                  }
                }
              }
            }
          }}
        >
          <div className="fallback-spinner">
            <div className="loading"  aria-label="loading screen">
              <Spinner className="spinner" animation="border" role="status" tabindex="0">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Loader;
