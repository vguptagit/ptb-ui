import { Link } from "react-router-dom";
import CustomQuestionBanksService from "../../services/CustomQuestionBanksService";
import { Collapse, Form } from "react-bootstrap";
import { useState } from "react";

const Essay = () => {debugger;
    const essayTemplate = CustomQuestionBanksService.Essay_Template;
    const [open, setOpen] = useState(false);
    console.log(essayTemplate);
        
    return (
        <div>
            <Form className="editmode border rounded p-3 bg-light">
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label className="mb-1">Enter Essay Questions</Form.Label>
            <Form.Control type="text" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label className="mb-1">Recommended Answer</Form.Label>
            <Form.Control as="textarea" rows={3} />
          </Form.Group>
          <div
                onClick={() => setOpen(!open)}
                className="d-flex align-items-center mb-3"
                style={{ cursor: 'pointer' }}
              >
                {open ?<i class="bi bi-caret-up-fill"></i> : <i class="bi bi-caret-down-fill"></i>}
                <span className="ms-2">Format and add metadata</span>
          </div>
          <Collapse key={open ? 'open' : 'closed'} in={open}>
              <div id="example-collapse-text" className={`d-flex gap-2 ${open ? 'visible' : 'invisible'}`}>
                <label htmlFor="option1">Essay Space:</label>
                <input type="radio" id="option1" name="options" />
                <label htmlFor="option1">None</label>

                <input type="radio" id="option2" name="options" />
                <label htmlFor="option2">1/4 page</label>

                <input type="radio" id="option3" name="options" />
                <label htmlFor="option3">1/2 page</label>

                <input type="radio" id="option4" name="options" />
                <label htmlFor="option4">1 page</label>
              </div>
          </Collapse>

          <div className="mb-1 d-flex justify-content-end">
          <Link className="savelink">
            Save
          </Link>
          <Link className="deletelink">Delete</Link>
        </div>
        </Form>
        </div>
    );
}
export default Essay;