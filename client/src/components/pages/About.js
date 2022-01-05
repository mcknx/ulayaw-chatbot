import React, { useContext } from "react";
import { ThoughtDiaryContext } from "../../Context/ThoughtDiaryContext";
import { ShowMoodsContext } from "../../Context/ShowMoodsContext";
import welcome from "../../assets/ulayaw_gif/welcome.gif";

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
            : "container mx-auto my-auto md:pt-[100px] 2xl:pt-[200px] md:transform md:scale-[.79] 2xl:scale-[1] h-[1400px] "
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
          <div className="col-span-7 flex flex-col md:px-0 px-4">
            {/* text */}
            <div className="md:text-[24px] text-[12px]  font-medium flex flex-row space-x-[14px] w-full md:w-[500px] lg:w-[579px] text-white text-justify bg-[#48B9E9] p-12 rounded-[20px]">
              <label>
                Ulayaw is proposed to be an assistive tool to the existing
                intervention addressing its limitations and is in no way will
                completely replace human interaction. This project Ulayaw as a
                tool to help relieve mental stress, individuals experiencing
                suicidal ideation in the Philippines will be alleviated.
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
