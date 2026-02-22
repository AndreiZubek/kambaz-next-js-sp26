"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ListGroupItem } from "react-bootstrap";
export default function CourseNavigation() {
  const links = [
    "Home",
    "Modules",
    "Piazza",
    "Zoom",
    "Assignments",
    "Quizzes",
    "Grades",
    "People",
  ];
  const params = useParams();
  const courseId = params.cid;
  const path = "/courses/" + courseId;
  const pathname = usePathname();
  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => {
        const linkPath =
          link === "People"
            ? `${path}/people/table`
            : `${path}/${link.toLowerCase()}`;
        return (
          <ListGroupItem
            key={link}
            as={Link}
            href={linkPath}
            className={`list-group-item border-0 ${pathname.includes(link.toLowerCase()) ? "active" : "text-danger"}`}
          >
            {link}
          </ListGroupItem>
        );
      })}
    </div>
  );
}
