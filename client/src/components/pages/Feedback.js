import React, { useContext } from "react";
import { ThoughtDiaryContext } from "../../Context/ThoughtDiaryContext";
import { ShowMoodsContext } from "../../Context/ShowMoodsContext";
import welcome from "../../assets/ulayaw_gif/C.gif";

const About = (props) => {
  const { showThoughtDiaryTool, setShowThoughtDiaryTool } =
    useContext(ThoughtDiaryContext);
  console.log(showThoughtDiaryTool);

  const { showMoods, setShowMoods } = useContext(ShowMoodsContext);

  return (
    <>
      <div className="absolute w-full h-[258px] bg-[#E1F6FF] top-[204px]"></div>
      <div
        className={
          showMoods
            ? "hidden  "
            : showThoughtDiaryTool
            ? "hidden  "
            : "container mx-auto my-auto md:pt-[100px] 2xl:pt-[200px] md:transform md:scale-[.79] 2xl:scale-[1] h-full "
        }
      >
        <div className="md:grid md:grid-cols-12 gap-4 ">
          {/* left */}
          <div className="col-span-5 flex justify-center ">
            <label>
              <img className="-mt-8" src={welcome} />
            </label>
          </div>
          {/* right */}
          <div className="col-span-7 flex flex-col">
            {/* text */}
            <div className="text-[24px] font-medium flex flex-col  space-y-[50px] w-auto text-white text-justify justify-center items-center bg-[#48B9E9] p-8 rounded-[20px] min-w-[700px]">
              <label>
                Help us improve our app by filling up this google form:
              </label>
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSfUxbsigksdYi9SMvdKQQf3QKo6r-jCLjGFdPVFfMi9NMNOMQ/viewform?embedded=true"
                width="650"
                height="546"
                frameborder="0"
                marginheight="0"
                marginwidth="0"
              >
                Loading…
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
