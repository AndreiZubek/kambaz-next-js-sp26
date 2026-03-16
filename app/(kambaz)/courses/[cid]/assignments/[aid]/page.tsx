"use client";

import {
  Button,
  FormControl,
  FormGroup,
  FormSelect,
} from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { addAssignment, updateAssignment } from "../reducer";
import { useState } from "react";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();

  const { assignments } = useSelector((state: any) => state.assignmentsReducer);

  const router = useRouter();
  const dispatch = useDispatch();

  const isNew = aid === "new";

  const existing = isNew ? null : assignments.find((a: any) => a._id === aid);

  if (!isNew && !existing) {
    return <div>Assignment not found</div>;
  }

  const [title, setTitle] = useState(existing?.title ?? "New Assignment");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [points, setPoints] = useState(existing?.points ?? 100);
  const [dueDate, setDueDate] = useState(existing?.dueDate ?? "");
  const [availableDate, setAvailableDate] = useState(
    existing?.availableDate ?? "",
  );
  const [availableUntilDate, setAvailableUntilDate] = useState(
    existing?.availableUntilDate ?? "",
  );

  const handleSave = () => {
    const assignmentData = {
      _id: existing?._id,
      title,
      description,
      points: Number(points),
      dueDate,
      availableDate,
      availableUntilDate,
      course: cid,
    };

    if (isNew) {
      dispatch(addAssignment(assignmentData));
    } else {
      dispatch(updateAssignment(assignmentData));
    }

    router.push(`/courses/${cid}/assignments`);
  };

  const handleCancel = () => router.push(`/courses/${cid}/assignments`);

  return (
    <div id="wd-assignments-editor">
      <FormGroup className="mb-4">
        <label htmlFor="wd-name">Assignment Name</label>
        <input
          className="form-control"
          id="wd-name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormGroup>

      <FormGroup className="mb-4">
        <label htmlFor="wd-description">Description</label>
        <textarea
          className="form-control"
          rows={6}
          id="wd-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormGroup>

      <div className="row mb-3 justify-content-end">
        <label htmlFor="wd-points" className="col-sm-4 col-form-label text-end">
          Points
        </label>
        <div className="col-sm-8">
          <input
            className="form-control"
            id="wd-points"
            type="number"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
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
          <FormSelect id="wd-assignment-group" defaultValue="ASSIGNMENTS">
            <option value="ASSIGNMENTS">ASSIGNMENTS</option>
            <option value="EXAMS">EXAMS</option>
            <option value="PROJECTS">PROJECTS</option>
          </FormSelect>
        </div>
      </div>

      <div className="row mb-3 justify-content-end">
        <label className="col-sm-4 col-form-label text-end">Assign</label>
        <div className="col-sm-8">
          <div className="form-control">
            <label htmlFor="wd-due-date" className="fs-6 pt-3">
              Due
            </label>
            <FormControl
              id="wd-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <div className="row mb-3">
              <div className="col-sm-6">
                <label htmlFor="wd-available-from" className="fs-6 pt-3">
                  Available from
                </label>
                <FormControl
                  id="wd-available-from"
                  type="date"
                  value={availableDate}
                  onChange={(e) => setAvailableDate(e.target.value)}
                />
              </div>
              <div className="col-sm-6">
                <label htmlFor="wd-available-until" className="fs-6 pt-3">
                  Until
                </label>
                <FormControl
                  id="wd-available-until"
                  type="date"
                  value={availableUntilDate}
                  onChange={(e) => setAvailableUntilDate(e.target.value)}
                />
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
        onClick={handleSave}
      >
        Save
      </Button>
      <Button
        variant="secondary"
        size="lg"
        className="me-1 float-end"
        onClick={handleCancel}
      >
        Cancel
      </Button>
    </div>
  );
}
