import React from "react";

const Landing = () => {
  return (
    <div className="container mx-auto my-auto md:pt-[100px] 2xl:pt-[200px] md:transform md:scale-[.79] 2xl:scale-[1] ">
      <div className="md:grid md:grid-cols-12 gap-4 ">
        {/* left */}
        <div className="col-span-5 flex justify-center ">
          <label>
            <img
              className="h-full md:h-[400px] md:w-[400px]"
              src="home_ulayaw.png"
            />
          </label>
        </div>
        {/* right */}
        <div className="col-span-7 flex flex-col">
          <label className="text-[48px] leading-tight">
            Kaibigan sa kalusugang pangkaisipan.
          </label>
          <label className="text-[30px] text-[#5A676D] ">
            Ipahayag ang iyong nararamdaman.
          </label>

          {/* buttons-upper */}
          <div className="text-[24px] font-medium flex flex-row space-x-[14px]">
            <div className="w-[183px] mt-[48px] h-[57px] bg-[#5DCFFF] rounded-[15px]  text-center py-2 text-[#29363C] cursor-pointer transform hover:scale-[1.1]">
              Assessment
            </div>
            <input
              className="border-[1px] border-[#3E3E3E] w-[382px] mt-[48px] h-[57px] rounded-[5px] text-[#737373] font-normal px-6 py-2  focus:ring-[#5DCFFF] transform hover:scale-[1.010]"
              type="text"
              placeholder="Enter a code"
            />
          </div>

          <div className="text-center text-[#7a6d6d] w-[579px] mt-[23px] border-t-[1px] border-[#3E3E3E]">
            or
          </div>

          {/* buttons-lower */}
          <div className="text-[24px] font-medium flex flex-row space-x-[14px]">
            <div className="w-[579px] mt-[23px] h-[57px] bg-[#5DCFFF] rounded-[15px]  text-center py-2 text-[#29363C] transform hover:scale-[1.1] cursor-pointer">
              <label> Conversation</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
