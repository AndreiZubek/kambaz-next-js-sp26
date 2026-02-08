"use client";

import {
  Button,
  FormCheck,
  FormControl,
  FormGroup,
  FormSelect,
} from "react-bootstrap";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <FormGroup>
        <label htmlFor="wd-name">Assignment Name</label>
        <input className="form-control mb-4" id="wd-name" defaultValue="A1" />
      </FormGroup>
      <FormGroup>
        <textarea
          className="form-control mb-4"
          rows={12}
          id="wd-description"
          defaultValue={`The assignment is available online.

Submit a link to the landing page of your Web application running on Netlify.

The landing page should include the following:
- Your full name and section
- Links to each of the lab assignments
- Link to the Kanbas application
- Link to all relevant source code repositories

The Kanbas application should include a link to navigate back to the landing page.`}
        ></textarea>
      </FormGroup>
      <div className="row mb-3 justify-content-end">
        <label
          htmlFor="wd-assignment-points"
          className="col-sm-4 col-form-label text-end"
        >
          Points
        </label>
        <div className="col-sm-8">
          <input
            className="form-control"
            id="wd-assignment-points"
            type="number"
            defaultValue="100"
          />
        </div>
      </div>

      <div className="row mb-3 justify-content-end">
        <label
          htmlFor="wd-assignment-group"
          className="col-sm-4 col-form-label text-end"
        >
          Assignment Group
        </label>
        <div className="col-sm-8">
          <FormSelect
            id="wd-assignment-group"
            defaultValue="ASSIGNMENTS"
            className="form-control"
          >
            <option value="ASSIGNMENTS">ASSIGNMENTS</option>
            <option value="EXAMS">EXAMS</option>
            <option value="PROJECTS">PROJECTS</option>
          </FormSelect>
        </div>
      </div>

      <div className="row mb-3 justify-content-end">
        <label
          htmlFor="wd-display-grade"
          className="col-sm-4 col-form-label text-end"
        >
          Display Grade as
        </label>
        <div className="col-sm-8">
          <FormSelect
            id="wd-display-grade"
            defaultValue="PERCENTAGE"
            className="form-control"
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="FRACTION">Fraction</option>
            <option value="POINTS">Points</option>
          </FormSelect>
        </div>
      </div>

      <div className="row mb-3 justify-content-end">
        <label
          htmlFor="wd-submission-type"
          className="col-sm-4 col-form-label text-end"
        >
          Submission Type
        </label>

        <div className="col-sm-8">
          <div className="form-control">
            <FormSelect
              id="wd-submission-type"
              defaultValue="ONLINE"
              className="mt-2"
            >
              <option value="ONLINE">Online</option>
              <option value="ON_PAPER">On Paper</option>
            </FormSelect>

            <div id="wd-online-options">
              <div className="fw-bold my-3">Online Entry Options</div>

              <FormCheck type="checkbox" label="Text Entry" className="mb-3" />
              <FormCheck
                type="checkbox"
                label="Website URL"
                className="mb-3"
                defaultChecked
              />
              <FormCheck
                type="checkbox"
                label="Media Recordings"
                className="mb-3"
              />
              <FormCheck
                type="checkbox"
                label="Student Annotation"
                className="mb-3"
              />
              <FormCheck
                type="checkbox"
                label="File Uploads"
                className="mb-3"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-3 justify-content-end">
        <label htmlFor="wd-assign" className="col-sm-4 col-form-label text-end">
          Assign
        </label>

        <div className="col-sm-8">
          <div className="form-control">
            <label htmlFor="wd-assign-to" className="fs-5 pt-2">
              Assign to
            </label>
            <FormSelect
              id="wd-assign-to"
              defaultValue="EVERYONE"
              className="mt-2"
            >
              <option value="EVERYONE">Everyone</option>
              <option value="SELECT_STUDENTS">Select Students</option>
            </FormSelect>

            <label htmlFor="wd-due-date" className="fs-6 pt-3">
              Due
            </label>
            <FormControl
              id="wd-due-date"
              type="datetime-local"
              defaultValue="2024-05-13T23:59"
            />
            <div className="row mb-3">
              <div className="col-sm-6">
                <label htmlFor="wd-available-from" className="fs-6 pt-3">
                  Available from
                </label>
                <FormControl
                  id="wd-available-from"
                  type="datetime-local"
                  defaultValue="2024-05-06T23:59"
                />
              </div>
              <div className="col-sm-6">
                <label htmlFor="wd-available-until" className="fs-6 pt-3">
                  Until
                </label>
                <FormControl id="wd-available-until" type="datetime-local" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="mt-5" />
      <Button
        variant="danger"
        size="lg"
        className="me-1 float-end"
        id="wd-save"
      >
        Save
      </Button>
      <Button
        variant="secondary"
        size="lg"
        className="me-1 float-end"
        id="wd-cancel"
      >
        Cancel
      </Button>
    </div>
  );
}
