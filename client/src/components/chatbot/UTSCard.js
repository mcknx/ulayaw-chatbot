import React from "react";
import { useDrag } from "react-dnd";
// import { ItemTypes } from "./Constants";

/**
 * Your Component
 */

function UTSCard({ id, name }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: "uts",
    item: { id, name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div className="pet-card p-4 border-2 rounded-lg" ref={dragRef}>
      {name}
      {isDragging && "🤗"}
    </div>
  );
}
export default UTSCard;
