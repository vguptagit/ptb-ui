import { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import "./Loader.css";

function Loader(props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(props.show);
  }, [props.show]);

  return (
    <>
      <div className="fallback-spinner" show={show}>
        <div className="loading">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </div>
    </>
  );
}

export default Loader;
