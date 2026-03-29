"use client";

import { Button, FormControl, FormGroup, FormSelect } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { addAssignment, setAssignments, updateAssignment } from "../reducer";
import { useEffect, useState } from "react";
import * as client from "../client";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const courseId = cid as string;
  const assignmentId = aid as string;

  const { assignments } = useSelector((state: any) => state.assignmentsReducer);

  const router = useRouter();
  const dispatch = useDispatch();

  const isNew = assignmentId === "new";

  const existing = isNew
    ? null
    : assignments.find((a: any) => a._id === assignmentId);

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
  const [loading, setLoading] = useState(!isNew && !existing);

  useEffect(() => {
    if (isNew || existing) {
      return;
    }
    const loadAssignment = async () => {
      try {
        const assignment = await client.fetchAssignmentById(assignmentId);
        dispatch(updateAssignment(assignment));
        setTitle(assignment.title ?? "");
        setDescription(assignment.description ?? "");
        setPoints(assignment.points ?? 100);
        setDueDate(assignment.dueDate ?? "");
        setAvailableDate(assignment.availableDate ?? "");
        setAvailableUntilDate(assignment.availableUntilDate ?? "");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadAssignment();
  }, [assignmentId, isNew, existing, dispatch]);

  const handleSave = async () => {
    const assignmentData = {
      _id: existing?._id,
      title,
      description,
      points: Number(points),
      dueDate,
      availableDate,
      availableUntilDate,
      course: courseId,
    };

    try {
      if (isNew) {
        const created = await client.createAssignmentForCourse(
          courseId,
          assignmentData,
        );
        dispatch(addAssignment(created));
      } else {
        const updated = await client.updateAssignment({
          ...assignmentData,
          _id: assignmentId,
        });
        dispatch(updateAssignment(updated));
      }
      const refreshed = await client.fetchAssignmentsForCourse(courseId);
      dispatch(setAssignments(refreshed));
      router.push(`/courses/${courseId}/assignments`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => router.push(`/courses/${courseId}/assignments`);

  if (loading) {
    return <div>Loading assignment...</div>;
  }

  if (!isNew && !existing && !title) {
    return <div>Assignment not found</div>;
  }

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
