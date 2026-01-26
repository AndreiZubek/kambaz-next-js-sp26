export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">
        <h3>
          <b>Assignment Name</b>
        </h3>
      </label>
      <input id="wd-name" defaultValue="A1 - ENV + HTML" />
      <br />
      <br />
      <textarea id="wd-description" cols={50} rows={8}>
        The assignment is available online Submit a link to the landing page of
        your Web application running on Netlify. The landing page should include
        the following: Your full name and section Links to each of the lab
        assignments Link to the Kanbas application Link to all relevant source
        code repositories The Kanbas application should include a link to
        navigate back to the landing page.
      </textarea>
      <br />
      <br />
      <table>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-points">Points</label>
          </td>
          <td>
            <input id="wd-points" type="number" defaultValue={100} />
          </td>
        </tr>
        <tr>
          <td>
            <br />
          </td>
        </tr>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-assignment-group">Assignment Group</label>
          </td>
          <td>
            <select id="wd-assignment-group" defaultValue="ASSIGNMENTS">
              <option value="ASSIGNMENTS">ASSIGNMENTS</option>
              <option value="EXAMS">EXAMS</option>
              <option value="PROJECTS">PROJECTS</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>
            <br />
          </td>
        </tr>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-display-grade">Display Grade as</label>
          </td>
          <td>
            <select id="wd-display-grade" defaultValue="PERCENTAGE">
              <option value="PERCENTAGE">Percentage</option>
              <option value="FRACTION">Fraction</option>
              <option value="POINTS">Points</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>
            <br />
          </td>
        </tr>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-submission-type">Submission Type</label>
          </td>
          <td>
            <select id="wd-submission-type" defaultValue="ONLINE">
              <option value="ONLINE">Online</option>
              <option value="ON_PAPER">On Paper</option>
            </select>
            <div id="online-options">
              <br />
              <label htmlFor="wd-online-options">Online Entry Options</label>
              <br />
              <label>
                <input type="checkbox" /> Text Entry
              </label>
              <br />

              <label>
                <input type="checkbox" /> Website URL
              </label>
              <br />

              <label>
                <input type="checkbox" /> Media Recordings
              </label>
              <br />

              <label>
                <input type="checkbox" /> Student Annotation
              </label>
              <br />

              <label>
                <input type="checkbox" /> File Uploads
              </label>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <br />
          </td>
        </tr>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-assign">Assign</label>
          </td>
          <td>
            <label htmlFor="wd-assign-to">Assign to</label>
            <br />
            <input type="text" defaultValue="Everyone" id="wd-assign-to" />
            <br />
            <br />
            <label htmlFor="wd-due-date"> Due </label>
            <br />
            <input type="date" defaultValue="2024-05-13" id="wd-due-date" />
            <br />
            <br />
            <table>
              <tr>
                <td>
                  <label htmlFor="wd-available-from">Available from</label>
                  <br />
                  <input
                    type="date"
                    defaultValue="2024-05-06"
                    id="wd-available-from"
                  />
                </td>
                <td>
                  <label htmlFor="wd-available-until">Available until</label>
                  <br />
                  <input
                    type="date"
                    defaultValue="2024-05-20"
                    id="wd-available-until"
                  />
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td colSpan={2} align="right">
            <hr />
            <button id="wd-cancel">Cancel</button>
            &nbsp;&nbsp;
            <button id="wd-save">Save</button>
          </td>
        </tr>
      </table>
    </div>
  );
}
