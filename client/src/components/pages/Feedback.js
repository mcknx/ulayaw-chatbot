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
      <div className="absolute w-full h-[258px] bg-[#E1F6FF] mt-[104px] lg:top-[204px]"></div>
      <div
        className={
          showMoods
            ? "hidden  "
            : showThoughtDiaryTool
            ? "hidden  "
            : "container mx-auto my-auto md:pt-[100px] 2xl:pt-[200px] md:transform md:scale-[.79] 2xl:scale-[1] h-[1000px] md:h-full "
        }
      >
        <div className="relative md:grid md:grid-cols-12 gap-4 ">
          {/* left */}
          <div className="col-span-5 flex justify-center mt-[55px] lg:mt-[0px]">
            <label>
              <img className="-mt-8" src={welcome} />
            </label>
          </div>
          {/* right */}
          <div className="col-span-7 flex flex-col d:px-0 px-2">
            {/* text */}
            <div className="md:text-[24px] text-[12px] font-medium flex flex-col  space-y-[50px]  text-white text-justify justify-center items-center bg-[#48B9E9] p-2 md:p-8 rounded-[10px] md:rounded-[20px] w-full md:w-[500px]  lg:min-w-[700px]">
              <label>
                Fill out this Google form to help us improve our app.
              </label>
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSfUxbsigksdYi9SMvdKQQf3QKo6r-jCLjGFdPVFfMi9NMNOMQ/viewform?embedded=true"
                className="w-full md:w-[500px] lg:w-[650px] h-[546px]"
                // width="650"
                // height="546"
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
