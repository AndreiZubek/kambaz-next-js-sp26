import { Container } from "react-bootstrap";
import BackgroundColors from "./BackgroundColors";
import Borders from "./Borders";
import Corners from "./Corners";
import Dimensions from "./Dimensions";
import Flex from "./Flex";
import Float from "./Float";
import ForegroundColors from "./ForegroundColors";
import GridLayout from "./GridLayout";
import "./index.css";
import Margins from "./Margins";
import MediaQueriesDemo from "./MediaQueriesDemo";
import Padding from "./Padding";
import Positions from "./Positions";
import ReactIconsSampler from "./ReactIconsSampler";
import Zindex from "./Zindex";
import BootstrapGrids from "./BootstrapGrids";
import ScreenSizeLabel from "./ScreenSizeLabel";
import BootstrapTables from "./BootstrapTables";
import BootstrapLists from "./BootstrapLists";
import BootstrapForms from "./BootstrapForms";
import BootstrapNavigation from "./BootstrapNavigation";
import Link from "next/link";

export default function Lab2() {
  return (
    <Container>
      <h2>Lab 2 - Cascading Style Sheets</h2>
      <Link
        id="wd-tailwind-btn"
        href="/labs/lab2/tailwind"
        className="btn btn-primary w-100 mb-2"
      >
        Tailwind{" "}
      </Link>
      <h3>Styling with the STYLE attribute</h3>
      <p>
        Style attribute allows configuring look and feel right on the element.
        Although it&apos;s very convenient it is considered bad practice and you
        should avoid using the style attribute
      </p>
      <div id="wd-css-id-selectors">
        <h3>ID selectors</h3>
        <p id="wd-id-selector-1">
          Instead of changing the look and feel of all the elements of the same
          name, e.g., P, we can refer to a specific element by its ID
        </p>
        <p id="wd-id-selector-2">
          Here&apos;s another paragraph using a different ID and a different
          look and feel
        </p>
      </div>
      <div id="wd-css-class-selectors">
        <h3>Class selectors</h3>
        <p className="wd-class-selector">
          Instead of using IDs to refer to elements, you can use an
          element&apos;s CLASS attribute{" "}
        </p>
        <h4 className="wd-class-selector">
          This heading has same style as paragraph above{" "}
        </h4>
      </div>
      <div id="wd-css-document-structure">
        <div className="wd-selector-1">
          {/* this is parent element with selector .wd-selector-1 */}
          <h3>Document structure selectors</h3>
          <div className="wd-selector-2">
            {/* .wd-selector-2 is a direct child of .wd-selector-1 */}
            Selectors can be combined to refer elements in particular places in
            the document
            <p className="wd-selector-3">
              {/* .wd-selector-3 is  a direct child of .wd-selector-2 and a descendant of .wd-selector-1 */}
              This paragraph&apos;s red background is referenced as
              <br />
              .selector-2 .selector3
              <br />
              meaning the descendant of some ancestor.
              <br />
              <span className="wd-selector-4">
                Whereas this span is a direct child of its parent
              </span>
              <br />
              You can combine these relationships to create specific styles
              depending on the document structure
            </p>
          </div>
        </div>
      </div>
      <ForegroundColors />
      <BackgroundColors />
      <Borders />
      <Padding />
      <Margins />
      <Corners />
      <Dimensions />
      <Positions />
      <Zindex />
      <Float />
      <GridLayout />
      <Flex />
      <MediaQueriesDemo />
      <ReactIconsSampler />
      <BootstrapGrids />
      <ScreenSizeLabel />
      <BootstrapTables />
      <BootstrapLists />
      <BootstrapForms />
      <BootstrapNavigation />
    </Container>
  );
}
