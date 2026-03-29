"use client";
import React, { useState } from "react";
import { FormControl } from "react-bootstrap";
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export default function WorkingWithObjects() {
  const [assignment, setAssignment] = useState({
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  });
  const [moduleState, setModuleState] = useState({
    id: "1",
    name: "NodeJS Module",
    description: "Learn about NodeJS and ExpressJS",
    course: "Web Development",
  });
  const ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`;
  const MODULE_API_URL = `${HTTP_SERVER}/lab5/module`;
  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>
      <h4>Modifying Properties</h4>
      <a
        id="wd-update-assignment-title"
        className="btn btn-primary float-end"
        href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}
      >
        Update Title{" "}
      </a>
      <FormControl
        className="w-75"
        id="wd-assignment-title"
        defaultValue={assignment.title}
        onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })
        }
      />
      <br />

      <h4>Modifying Assignment Score</h4>
      <a
        id="wd-update-assignment-score"
        className="btn btn-warning float-end"
        href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}
      >
        Update Score
      </a>
      <FormControl
        className="w-75"
        id="wd-assignment-score"
        type="number"
        value={assignment.score}
        onChange={(e) =>
          setAssignment({ ...assignment, score: Number(e.target.value) })
        }
      />
      <br />

      <h4>Modifying Assignment Completed</h4>
      <a
        id="wd-update-assignment-completed"
        className="btn btn-warning float-end"
        href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}
      >
        Update Completed
      </a>
      <label className="form-check-label">
        <input
          id="wd-assignment-completed"
          className="form-check-input me-2"
          type="checkbox"
          checked={assignment.completed}
          onChange={(e) =>
            setAssignment({ ...assignment, completed: e.target.checked })
          }
        />
        Completed
      </label>
      <br />

      <h4>Modifying Module Name</h4>
      <a
        id="wd-update-module-name"
        className="btn btn-success float-end"
        href={`${MODULE_API_URL}/name/${moduleState.name}`}
      >
        Update Module Name
      </a>
      <FormControl
        className="w-50"
        id="wd-module-name"
        value={moduleState.name}
        onChange={(e) =>
          setModuleState({ ...moduleState, name: e.target.value })
        }
      />
      <br />

      <h4>Modifying Module Description</h4>
      <a
        id="wd-update-module-description"
        className="btn btn-success float-end"
        href={`${MODULE_API_URL}/description/${moduleState.description}`}
      >
        Update Module Description
      </a>
      <FormControl
        className="w-50"
        id="wd-module-description"
        value={moduleState.description}
        onChange={(e) =>
          setModuleState({ ...moduleState, description: e.target.value })
        }
      />
      <hr />

      <h4>Retrieving Objects</h4>
      <a
        id="wd-retrieve-assignment"
        className="btn btn-primary"
        href={`${HTTP_SERVER}/lab5/module/name`}
      >
        Get Module Name
      </a>
      <br />
      <a
        id="wd-retrieve-module"
        className="btn btn-primary"
        href={`${HTTP_SERVER}/lab5/module`}
      >
        Get Module
      </a>
        <br />
      <a
        id="wd-retrieve-assignments"
        className="btn btn-primary"
        href={`${HTTP_SERVER}/lab5/assignment`}
      >
        Get Assignment
      </a>
      <hr />
      <h4>Retrieving Properties</h4>
      <a
        id="wd-retrieve-assignment-title"
        className="btn btn-primary"
        href={`${HTTP_SERVER}/lab5/assignment/title`}
      >
        Get Title
      </a>
      <hr />
    </div>
  );
}
