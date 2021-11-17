import React from "react";
import { useDrag } from "react-dnd";
// import { ItemTypes } from "./Constants";

/**
 * Your Component
 */

function PetCard({ id, name }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: "pet",
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
export default PetCard;
