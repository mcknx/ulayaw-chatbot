import React, { useContext } from "react";
import { ThoughtDiaryContext } from "../../Context/ThoughtDiaryContext";
import { ShowMoodsContext } from "../../Context/ShowMoodsContext";
import homeUlayaw from "../../assets/home_ulayaw.png";

const Manual = (props) => {
  const { showThoughtDiaryTool, setShowThoughtDiaryTool } =
    useContext(ThoughtDiaryContext);
  console.log(showThoughtDiaryTool);

  const { showMoods, setShowMoods } = useContext(ShowMoodsContext);

  return (
    <div
      // className={
      //   showThoughtDiaryTool
      //     ? "hidden "
      //     : "container mx-auto my-auto md:pt-[100px] 2xl:pt-[200px] md:transform md:scale-[.79] 2xl:scale-[1]"
      // }
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
            <img
              className="h-full md:h-[400px] md:w-[400px]"
              src={homeUlayaw}
            />
          </label>
        </div>
        {/* right */}
        <div className="col-span-7 flex flex-col">
          <label className="text-[48px] leading-tight text-[#28AFE8]">
            Kaibigan sa kalusugang pangkaisipan.
          </label>
          <label className="text-[30px] text-[#5A676D] ">
            Ipahayag ang iyong nararamdaman.
          </label>

          {/* buttons-upper */}
          {/* <div className="text-[24px] font-medium flex flex-row space-x-[14px]">
            <button className="w-[183px] mt-[48px] h-[57px] bg-[#5DCFFF] rounded-[15px]  text-center py-2 text-[#29363C] cursor-pointer transform hover:scale-[1.010]">
              Assessment
            </button>
            <input
              className="border-[1px] border-[#3E3E3E] w-[382px] mt-[48px] h-[57px] rounded-[5px] text-[#737373] font-normal px-6 py-2  focus:ring-[#5DCFFF] transform hover:scale-[1.005]"
              type="text"
              placeholder="Enter a code"
            />
          </div> */}

          <div className="text-center text-[#7a6d6d] w-[579px] mt-[23px] border-t-[1px] border-[#3E3E3E]">
            {/* or */}
          </div>

          {/* buttons-lower */}
          <div className="text-[24px] font-medium flex flex-row space-x-[14px] w-[579px] text-[#1A4A61] text-justify">
            <label>
              Pindutin ang emoji ni Ulayaw upang makapagsimula sa
              pakikipag-usap.
            </label>
            {/* <button className="w-full mt-[23px] h-[57px] bg-[#5DCFFF] rounded-[15px]  text-center py-2 text-[#29363C] transform hover:scale-[1.005] cursor-pointer">
              <p> Conversation</p>
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manual;