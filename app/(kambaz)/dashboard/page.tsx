import Link from "next/link";
import Image from "next/image";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (8)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link href="/courses/1234" className="wd-dashboard-course-link">
            <Image
              src="/images/reactjs.jpg"
              width={200}
              height={150}
              alt="reactjs"
            />
            <div>
              <h5> CS1234 React JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/4530" className="wd-dashboard-course-link">
            <Image
              src="/images/softwaredev.jpg"
              width={200}
              height={150}
              alt="softwaredev"
            />
            <div>
              <h5> CS4530 Software Dev </h5>
              <p className="wd-dashboard-course-title">Software Development</p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/4550" className="wd-dashboard-course-link">
            <Image
              src="/images/webdev.jpg"
              width={200}
              height={150}
              alt="webdev"
            />
            <div>
              <h5> CS4550 Web Dev </h5>
              <p className="wd-dashboard-course-title">Web Development</p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/4200" className="wd-dashboard-course-link">
            <Image
              src="/images/datavis.jpg"
              width={200}
              height={150}
              alt="datavis"
            />
            <div>
              <h5> DS4200 Data Visualization </h5>
              <p className="wd-dashboard-course-title">Data Visualization</p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/3255" className="wd-dashboard-course-link">
            <Image
              src="/images/marketstructure.jpg"
              width={200}
              height={150}
              alt="marketstructure"
            />
            <div>
              <h5> ECON3255 React JS </h5>
              <p className="wd-dashboard-course-title">Market Structure</p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/1000" className="wd-dashboard-course-link">
            <Image src="/images/test.jpg" width={200} height={150} alt="test" />
            <div>
              <h5> CS1000 test class </h5>
              <p className="wd-dashboard-course-title">test class</p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/1500" className="wd-dashboard-course-link">
            <Image
              src="/images/onlinecourse.jpg"
              width={200}
              height={150}
              alt="onlinecourse"
            />
            <div>
              <h5> CS1500 Online Course </h5>
              <p className="wd-dashboard-course-title">Online Course</p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/2000" className="wd-dashboard-course-link">
            <Image
              src="/images/accessibility.jpg"
              width={200}
              height={150}
              alt="accessibility"
            />
            <div>
              <h5> CS2000 Accessibility Course </h5>
              <p className="wd-dashboard-course-title">Accessibility Course</p>
              <button> Go </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
