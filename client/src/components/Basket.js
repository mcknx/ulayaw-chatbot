import React, { useState } from "react";
import { useDrop } from "react-dnd";
import PetCard from "./PetCard";

const PETS = [
  { id: 1, name: "dog" },
  { id: 2, name: "rat" },
  { id: 3, name: "fish" },
  { id: 4, name: "cat" },
];

function Basket() {
  const [basket, setBasket] = useState([]);
  const [{ isOver }, dropRef] = useDrop({
    accept: "pet",
    drop: (item) =>
      setBasket((basket) =>
        !basket.includes(item) ? [...basket, item] : basket
      ),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  return (
    <>
      <div className="pets p-4 border-2 rounded-lg">
        {PETS.map((pet) => (
          <PetCard draggable id={pet.id} name={pet.name} />
        ))}
      </div>
      <div className="basket p-4 border-2 rounded-lg" ref={dropRef}>
        {basket.map((pet) => (
          <PetCard draggable id={pet.id} name={pet.name} />
        ))}
        {isOver && <div>Drop Here!</div>}
      </div>
    </>
  );
}

export default Basket;
