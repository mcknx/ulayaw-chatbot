import React from "react";
import ulayawFace from "../../assets/ulayaw.png";
import MapContainer from "./MapContainer";

function Message(props) {
  // console.log(speaks);
  return (
    <div className=" rounded-lg  mb-2 text-sm ">
      <div>
        {props.speaks === "bot" && (
          <MessageFormat
            speaks={props.speaks}
            text={props.text}
            float={"left"}
            lat={props.lat}
            lng={props.lng}
          />
        )}
        {props.speaks === "user" && (
          <MessageFormat
            speaks={props.speaks}
            text={props.text}
            float={"right"}
            lat={props.lat}
            lng={props.lng}
          />
        )}
      </div>
    </div>
  );
}

function MessageFormat(props) {
  // console.log(float);
  return (
    <div
      className={
        props.float === "left"
          ? "flex justify-start space-x-2  p-2 rounded-lg bottom-0  max-w-[500px] break-words"
          : "flex flex-row-reverse space-x-2 space-x-reverse  p-2 rounded-lg max-w-[500px] break-all text-justify"
      }
    >
      <div
        className={
          props.float === "left" ? "flex justify-end flex-col" : "hidden"
        }
      >
        <div className=" rounded-full flex justify-center  text-white h-10 w-10  ">
          <img src={ulayawFace} />
          {/* <a href="/">{speaks}</a> */}
        </div>
      </div>

      <div
        className={
          props.float === "left"
            ? "rounded-[10px] self-center overflow-ellipsis  px-4 py-2 bg-[#F2EFEF] text-black font-medium text-left"
            : "rounded-[10px] self-center overflow-ellipsis  px-4 py-2 bg-[#5DCFFF] text-white text-left"
        }
      >
        <span>{props.text}</span>
        {props.lat && props.lng ? (
          <MapContainer lat={props.lat} lng={props.lng} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Message;
