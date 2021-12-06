import React, { useContext } from "react";
import { ThoughtDiaryContext } from "../../Context/ThoughtDiaryContext";
import { ShowMoodsContext } from "../../Context/ShowMoodsContext";
import welcome from "../../assets/ulayaw_gif/welcome.gif";
import asma from "../../assets/team/asma.png";
import talo from "../../assets/team/talo.png";
import surigao from "../../assets/team/surigao.png";
import bayacag from "../../assets/team/bayacag.png";
import email from "../../assets/team/email.png";
const About = (props) => {
  const { showThoughtDiaryTool, setShowThoughtDiaryTool } =
    useContext(ThoughtDiaryContext);
  console.log(showThoughtDiaryTool);

  const { showMoods, setShowMoods } = useContext(ShowMoodsContext);

  return (
    <>
      <div className="absolute text-center w-full h-[258px] bg-[#E1F6FF] top-[204px]">
        <label className="text-center text-[#0C86BA] text-bold text-[48px]">
          The Team
        </label>
      </div>
      <div
        className={
          showMoods
            ? "hidden  "
            : showThoughtDiaryTool
            ? "hidden  "
            : "container mx-auto my-auto md:pt-[100px] 2xl:pt-[200px] md:transform md:scale-[.79] 2xl:scale-[1] h-full "
        }
      >
        <div className="grid  grid-cols-8  mt-[60px]">
          {/* center */}
          <div className="col-span-2 flex flex-col justify-center items-center mr-[50px]">
            <label>
              <img
                className="rounded-full border-[10px] border-[#48B9E9]"
                src={asma}
              />
            </label>

            <div className="flex flex-col justify-center items-center mt-[40px] border-2 border-[#0C86BA] w-[250px] py-4 rounded-[20px] tracking-tight leading-tight">
              <label className="text-[18px]">Mckeen Asma</label>
              <label className="text-[18px] text-[#00709F] text-bold">
                Lead Programmer
              </label>
              <div className="flex flex-row space-x-2 text-[12px]">
                <img className="" src={email} />
                <label>Masma_180000002118@uic.edu.ph</label>
              </div>
            </div>
          </div>
          <div className="col-span-2 flex flex-col justify-center items-center mr-[50px]">
            <label>
              <img
                className="rounded-full border-[10px] border-[#48B9E9]"
                src={bayacag}
              />
            </label>

            <div className="flex flex-col justify-center items-center mt-[40px] border-2 border-[#0C86BA] w-[250px] py-4 rounded-[20px] tracking-tight leading-tight">
              <label className="text-[18px]">Eldon Bayacag</label>
              <label className="text-[18px] text-[#00709F] text-bold">
                Programmer
              </label>
              <div className="flex flex-row space-x-2 text-[12px]">
                <img className="" src={email} />
                <label>Ebayacag_180000002988@uic.edu.ph</label>
              </div>
            </div>
          </div>
          <div className="col-span-2 flex flex-col justify-center items-center mr-[50px]">
            <label>
              <img
                className="rounded-full border-[10px] border-[#48B9E9]"
                src={talo}
              />
            </label>

            <div className="flex flex-col justify-center items-center mt-[40px] border-2 border-[#0C86BA] w-[250px] py-4 rounded-[20px] tracking-tight leading-tight">
              <label className="text-[18px]">Christian John Talo</label>
              <label className="text-[18px] text-[#00709F] text-bold">
                Project Manager
              </label>
              <div className="flex flex-row space-x-2 text-[12px]">
                <img className="" src={email} />
                <label>Ctalo_180000001914@uic.edu.ph</label>
              </div>
            </div>
          </div>
          <div className="col-span-2 flex flex-col justify-center items-center mr-[50px]">
            <label>
              <img
                className="rounded-full border-[10px] border-[#48B9E9]"
                src={surigao}
              />
            </label>

            <div className="flex flex-col justify-center items-center mt-[40px] border-2 border-[#0C86BA] w-[250px] py-4 rounded-[20px] tracking-tight leading-tight">
              <label className="text-[18px]">Jonas Surigao</label>
              <label className="text-[18px] text-[#00709F] text-bold">
                Designer
              </label>
              <div className="flex flex-row space-x-2 text-[12px]">
                <img className="" src={email} />
                <label>Jsurigao_180000002050@uic.edu.ph</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
