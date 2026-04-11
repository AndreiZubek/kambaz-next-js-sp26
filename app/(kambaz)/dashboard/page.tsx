"use client";
import Link from "next/link";
import * as client from "../courses/client";
import { useDispatch, useSelector } from "react-redux";
import { setCourses } from "../courses/reducer";
import { setEnrollments } from "../enrollments/reducer";
import { RootState } from "../store";
import * as enrollmentsClient from "../enrollments/client";
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
import { useEffect, useState } from "react";
export default function Dashboard() {
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  ) as any;
  const { enrollments } = useSelector(
    (state: RootState) => state.enrollmentsReducer,
  );
  const dispatch = useDispatch();
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [course, setCourse] = useState<any>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });

  const refreshEnrollments = async () => {
    if (!currentUser?._id) {
      return;
    }
    const data = await enrollmentsClient.fetchEnrollmentsForUser(
      currentUser._id,
    );
    dispatch(setEnrollments(data));
  };

  const fetchCourses = async () => {
    try {
      const allCoursesData = await client.fetchAllCourses();
      setAllCourses(allCoursesData);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchEnrollments = async () => {
    if (!currentUser?._id) {
      return;
    }
    try {
      await refreshEnrollments();
    } catch (error) {
      console.error(error);
    }
  };
  const onAddNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    const updatedAllCourses = [...allCourses, newCourse];
    setAllCourses(updatedAllCourses);
  };
  const onDeleteCourse = async (courseId: string) => {
    await client.deleteCourse(courseId);
    const updatedAllCourses = allCourses.filter(
      (course) => course._id !== courseId,
    );
    setAllCourses(updatedAllCourses);
  };
  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    const updatedAllCourses = allCourses.map((c) =>
      c._id === course._id ? course : c,
    );
    setAllCourses(updatedAllCourses);
  };

  useEffect(() => {
    if (!currentUser?._id) {
      return;
    }
    const loadData = async () => {
      await Promise.all([fetchCourses(), fetchEnrollments()]);
    };
    loadData();
  }, [currentUser]);

  const myCourseIds = new Set(
    enrollments
      .filter((enrollment: any) => enrollment.user === currentUser._id)
      .map((enrollment: any) => enrollment.course),
  );

  const myCourses = allCourses.filter((course: any) =>
    myCourseIds.has(course._id),
  );

  const displayedCourses = showAllCourses ? allCourses : myCourses;

  useEffect(() => {
    dispatch(setCourses(myCourses));
  }, [myCourses, dispatch]);

  const isFaculty = useSelector(
    (state: any) =>
      state.accountReducer.currentUser?.role === "FACULTY" ||
      state.accountReducer.currentUser?.role === "ADMIN" ||
      state.accountReducer.currentUser?.role === "TA",
  );
  const isStudent = useSelector(
    (state: any) => state.accountReducer.currentUser?.role === "STUDENT",
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

  const handleEnroll = async (courseId: string) => {
    try {
      await enrollmentsClient.enrollUserInCourse(currentUser._id, courseId);
      await refreshEnrollments();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnenroll = async (courseId: string) => {
    try {
      await enrollmentsClient.unenrollUserFromCourse(currentUser._id, courseId);
      await refreshEnrollments();
    } catch (error) {
      console.error(error);
    }
  };

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
            onClick={onAddNewCourse}
          >
            {" "}
            Add{" "}
          </button>
          <button
            className="btn btn-warning float-end me-2"
            onClick={onUpdateCourse}
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
        {displayedCourses.length})
      </h2>{" "}
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {displayedCourses.map((course) => {
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
                        {isStudent && (
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
                        )}
                        {isFaculty && (
                          <>
                            <button
                              id={`wd-delete-course-click-${course._id}`}
                              onClick={(event) => {
                                event.preventDefault();
                                onDeleteCourse(course._id);
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
                        {isStudent && (
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
                        )}
                        {isFaculty && showAllCourses && (
                          <>
                            <button
                              id={`wd-delete-course-click-${course._id}`}
                              onClick={(event) => {
                                event.preventDefault();
                                onDeleteCourse(course._id);
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
