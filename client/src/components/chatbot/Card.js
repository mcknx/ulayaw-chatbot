import React from "react";

const Card = (props) => {
  return (
    <div
      className="max-w-sm rounded-sm overflow-hidden shadow-lg m-2 border-2 border-gray-300 flex flex-col "
      style={{ height: 350, width: 240 }}
    >
      {/* pic */}
      <div
        className="h-40 bg-cover hover:bg-gray"
        alt={props.payload.fields.header.stringValue}
        style={{
          backgroundImage: `url(${props.payload.fields.image.stringValue})`,
        }}
      ></div>

      <div className="mx-6 my-4 border-b border-gray-light ">
        {/* title */}
        <div className="font-medium text-base text-gray-darker mb-4 h-10">
          {props.payload.fields.header.stringValue}
        </div>
        {/* body */}
        <p className="font-normal text-gray-dark text-sm mb-2 overflow-auto h-20">
          {props.payload.fields.description.stringValue}
        </p>
        <p className="font-normal text-gray-dark text-sm mb-4">
          {/* {props.payload.fields.price.stringValue} */}
        </p>
      </div>

      <div className="font-normal text-gray-dark text-sm mb-4 text-center  h-10">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={props.payload.fields.link.stringValue}
        >
          Simulan
        </a>
      </div>
    </div>
  );
};

export default Card;
