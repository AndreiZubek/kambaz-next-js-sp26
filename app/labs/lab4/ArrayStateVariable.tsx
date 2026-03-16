import { useState } from "react";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "./store";

export default function ArrayStateVariable() {
  const { todos } = useSelector((state: RootState) => state.todosReducer);
  const [array, setArray] = useState([1, 2, 3, 4, 5]);
  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };
  const deleteElement = (index: number) => {
    setArray(array.filter((item, i) => i !== index));
  };
  return (
    <div id="wd-array-state-variables" className="border border-gray p-1">
      <h2>Array State Variable</h2>
      <ListGroup>
        {todos.map((todo: any) => (
          <ListGroupItem key={todo.id}>{todo.title}</ListGroupItem>
        ))}
      </ListGroup>
      <hr />
      <Button
        onClick={addElement}
        variant="success"
        size="lg"
        className="w-30 mb-2"
      >
        Add Element{" "}
      </Button>

      <ListGroup className="rounded-2" id="wd-array-state">
        {array.map((item, index) => (
          <ListGroupItem
            key={index}
            className="wd-array-state ps-2 p-0 fs-4 border-gray"
          >
            {" "}
            {item}
            <Button
              onClick={() => deleteElement(index)}
              variant="danger"
              size="lg"
              className="w-40 me-4 m-2 float-end"
            >
              Delete{" "}
            </Button>
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}
