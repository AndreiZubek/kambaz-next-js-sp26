"use client";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse } from "../courses/reducer";
import { addEnrollment, removeEnrollment } from "../enrollments/reducer";
import { RootState } from "../store";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  FormControl,
  Row,
} from "react-bootstrap";
import { useState } from "react";
export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  ) as any;
  const { enrollments } = useSelector(
    (state: RootState) => state.enrollmentsReducer,
  );
  const dispatch = useDispatch();
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [course, setCourse] = useState<any>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });

  const isFaculty = useSelector(
    (state: any) =>
      state.accountReducer.currentUser?.role === "FACULTY" ||
      state.accountReducer.currentUser?.role === "ADMIN" ||
      state.accountReducer.currentUser?.role === "TA",
  );

  if (!currentUser) {
    return <p>Please sign in to view your courses.</p>;
  }

  const isUserEnrolled = (courseId: string) => {
    return enrollments.some(
      (enrollment: any) =>
        enrollment.user === currentUser._id && enrollment.course === courseId,
    );
  };

  const handleEnroll = (courseId: string) => {
    dispatch(addEnrollment({ user: currentUser._id, course: courseId }));
  };

  const handleUnenroll = (courseId: string) => {
    dispatch(removeEnrollment({ userId: currentUser._id, courseId: courseId }));
  };

  const filteredCourses = showAllCourses
    ? courses
    : courses.filter((course) => isUserEnrolled(course._id));

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">New Course</h5>
        <Button
          variant="primary"
          id="wd-enrollments-toggle"
          onClick={() => setShowAllCourses(!showAllCourses)}
        >
          Enrollments
        </Button>
      </div>
      {isFaculty && (
        <>
          <button
            className="btn btn-primary float-end"
            id="wd-add-new-course-click"
            onClick={() => dispatch(addNewCourse(course))}
          >
            {" "}
            Add{" "}
          </button>
          <button
            className="btn btn-warning float-end me-2"
            onClick={() => dispatch(updateCourse(course))}
            id="wd-update-course-click"
          >
            Update{" "}
          </button>
        </>
      )}
      <br />
      <FormControl
        value={course.name}
        className="mb-2"
        onChange={(e) => setCourse({ ...course, name: e.target.value })}
      />
      <FormControl
        value={course.description}
        as="textarea"
        className="mb-2"
        onChange={(e) => setCourse({ ...course, description: e.target.value })}
      />
      <hr />
      <h2 id="wd-dashboard-published">
        {showAllCourses ? "All Courses" : "My Courses"} (
        {filteredCourses.length})
      </h2>{" "}
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {filteredCourses.map((course) => {
            const enrolled = isUserEnrolled(course._id);
            return (
              <Col
                key={course._id}
                className="wd-dashboard-course"
                style={{ width: "300px" }}
              >
                <Card>
                  <Link
                    href={`/courses/${course._id}/home`}
                    onClick={(e) => { if (!enrolled) e.preventDefault(); }}
                    className="wd-dashboard-course-link text-decoration-none text-dark"
                  >
                    <CardImg
                      src={course.image}
                      variant="top"
                      width="100%"
                      height={160}
                    />
                    <CardBody className="card-body">
                      <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                        {course.name}{" "}
                      </CardTitle>
                      <CardText
                        className="wd-dashboard-course-description overflow-hidden"
                        style={{ height: "100px" }}
                      >
                        {course.description}{" "}
                      </CardText>
                      {enrolled && <Button variant="primary"> Go </Button>}
                    </CardBody>
                  </Link>
                  <div style={{ padding: "10px" }}>
                    {enrolled ? (
                      <>
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            handleUnenroll(course._id);
                          }}
                          className="btn btn-danger float-end"
                          id={`wd-unenroll-${course._id}`}
                        >
                          Unenroll
                        </button>
                        {isFaculty && (
                          <>
                            <button
                              id={`wd-delete-course-click-${course._id}`}
                              onClick={(event) => {
                                event.preventDefault();
                                dispatch(deleteCourse(course._id));
                              }}
                              className="btn btn-danger me-2 float-end"
                            >
                              Delete
                            </button>
                            <button
                              id={`wd-edit-course-click-${course._id}`}
                              onClick={(event) => {
                                event.preventDefault();
                                setCourse(course);
                              }}
                              className="btn btn-warning me-2 float-end"
                            >
                              Edit
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            handleEnroll(course._id);
                          }}
                          className="btn btn-success float-end"
                          id={`wd-enroll-${course._id}`}
                        >
                          Enroll
                        </button>
                        {isFaculty && showAllCourses && (
                          <>
                            <button
                              id={`wd-delete-course-click-${course._id}`}
                              onClick={(event) => {
                                event.preventDefault();
                                dispatch(deleteCourse(course._id));
                              }}
                              className="btn btn-danger me-2 float-end"
                            >
                              Delete
                            </button>
                            <button
                              id={`wd-edit-course-click-${course._id}`}
                              onClick={(event) => {
                                event.preventDefault();
                                setCourse(course);
                              }}
                              className="btn btn-warning me-2 float-end"
                            >
                              Edit
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}
