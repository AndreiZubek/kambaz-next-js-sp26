"use client";
import { ReactNode } from "react";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "../../store";
import Breadcrumb from "./Breadcrumb";
import React, { useEffect } from "react";
import * as enrollmentsClient from "../../enrollments/client";
import { setEnrollments } from "../../enrollments/reducer";
export default function CoursesLayout({ children }: { children: ReactNode }) {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  ) as any;
  const { enrollments } = useSelector(
    (state: RootState) => state.enrollmentsReducer,
  );
  const [showNavigation, setShowNavigation] = React.useState(true);

  const course = courses.find((course: any) => course._id === cid);

  const isFacultyOrAdmin = useSelector(
    (state: any) =>
      state.accountReducer.currentUser?.role === "FACULTY" ||
      state.accountReducer.currentUser?.role === "ADMIN" ||
      state.accountReducer.currentUser?.role === "TA",
  );

  useEffect(() => {
    const loadEnrollments = async () => {
      if (!currentUser?._id) {
        return;
      }
      try {
        const data = await enrollmentsClient.fetchEnrollmentsForUser(
          currentUser._id,
        );
        dispatch(setEnrollments(data));
      } catch (error) {
        console.error(error);
      }
    };

    loadEnrollments();
  }, [currentUser, dispatch]);

  useEffect(() => {
    if (!currentUser) {
      router.push("/dashboard");
      return;
    }

    const isEnrolled = enrollments.some(
      (enrollment: any) =>
        enrollment.user === currentUser._id && enrollment.course === cid,
    );

    if (!isFacultyOrAdmin && !isEnrolled) {
      router.push("/dashboard");
    }
  }, [cid, currentUser, enrollments, isFacultyOrAdmin, router]);

  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify
          onClick={() => setShowNavigation(!showNavigation)}
          className="me-4 fs-4 mb-1"
        />
        <Breadcrumb course={course} />
      </h2>{" "}
      <hr />
      <div className="d-flex">
        {showNavigation && (
          <div className="d-none d-md-block">
            <CourseNavigation />
          </div>
        )}
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}
