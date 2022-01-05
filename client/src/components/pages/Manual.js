import React, { useState, useContext } from "react";
import { ThoughtDiaryContext } from "../../Context/ThoughtDiaryContext";
import { ShowMoodsContext } from "../../Context/ShowMoodsContext";
import homeUlayaw from "../../assets/home_ulayaw.png";
import ObjectivesAndGoals from "./ManualList/ObjectivesAndGoals";
import Functionalities from "./ManualList/Functionalities";
import GetStarted from "./ManualList/GetStarted";
const Landing = (props) => {
  const { showThoughtDiaryTool, setShowThoughtDiaryTool } =
    useContext(ThoughtDiaryContext);
  console.log(showThoughtDiaryTool);

  const { showMoods, setShowMoods } = useContext(ShowMoodsContext);
  const [activeMarker, setActiveMarker] = useState(1);
  // const [showGO, setShowGo] = useState(true);
  // const [showF, setShowF] = useState(false);
  // const [showGS, setShowGS] = useState(false);

  return (
    <div classNameName="py-12">
      <div classNameName=" flex flex-row">
        {/* sidebar */}
        {/* <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script> */}
        <div className="overflow-y-auto md:absolute lg:fixed md:flex flex-col md:flex-row md:h-[400px] w-full md:w-[256px] h-[500px]  mb-[100px] bg-white">
          <div
            className="flex flex-col w-full md:w-64 text-gray-700  dark-mode:text-gray-200 dark-mode:bg-gray-800 flex-shrink-0"
            x-data="{ open: false }"
          >
            <div className="flex-shrink-0 px-8 py-4 flex flex-row items-center justify-between border-4">
              <a
                href="#"
                className="text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg dark-mode:text-white focus:outline-none focus:shadow-outline"
              >
                Ulayaw Manual
              </a>
              {/* <button className=" md:hidden rounded-lg focus:outline-none focus:shadow-outline">
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  className="w-6 h-6"
                >
                  <path
                    x-show="!open"
                    fill-rule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                    clip-rule="evenodd"
                  ></path>
                  <path
                    x-show="open"
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button> */}
            </div>
            <nav className="flex-grow md:block px-4 pb-4 md:pb-0 md:overflow-y-auto">
              <a
                className={`block px-4 py-2 mt-2 text-sm font-semibold text-gray-900  rounded-lg dark-mode:bg-gray-700 dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200  cursor-pointer ${
                  activeMarker === 1 ? "bg-gray-200" : ""
                }`}
                onClick={() => setActiveMarker(1)}
                // href="#"
              >
                Ulayaw Goals and Objectives
              </a>

              {/* <a
                className={`block px-4 py-2 mt-2 text-sm font-semibold text-gray-900  rounded-lg dark-mode:bg-gray-700 dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200  cursor-pointer ${
                  activeMarker === 2 ? "bg-gray-200" : ""
                }`}
                onClick={() => setActiveMarker(2)}
                // href="#"
              >
                Ulayaw Functionalities
              </a> */}
              <div className="relative" x-data="{ open: false }">
                <button
                  className={`flex flex-row items-center w-full px-4 py-2 mt-2 text-sm font-semibold text-left  rounded-lg dark-mode:bg-transparent dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:focus:bg-gray-600 dark-mode:hover:bg-gray-600 md:block hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200  focus:outline-none focus:shadow-outline cursor-pointer ${
                    activeMarker === 2 ? "bg-transparent" : ""
                  }`}
                  onClick={() => setActiveMarker(2)}
                >
                  <span>Ulayaw Functionalities</span>
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    className="inline w-4 h-4 mt-1 ml-1 transition-transform duration-200 transform md:-mt-1"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
                <div className="absolute right-0 w-full mt-2 origin-top-right rounded-md shadow-lg">
                  <div className="px-2 py-2 bg-white rounded-md space-y-1  shadow dark-mode:bg-gray-800">
                    <a
                      className={`block px-4 py-2 mt-2 text-sm font-semibold  rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline cursor-pointer ${
                        activeMarker === 2 ? "bg-gray-200" : ""
                      }`}
                      onClick={() => setActiveMarker(2)}
                      // href="#"
                    >
                      Accessibility
                    </a>
                    <a
                      className={`block px-4 py-2 mt-2 text-sm font-semibold  rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline cursor-pointer ${
                        activeMarker === 3 ? "bg-gray-200" : ""
                      }`}
                      onClick={() => setActiveMarker(3)}
                      // href="#"
                    >
                      User Management
                    </a>
                    <a
                      className={`block px-4 py-2 mt-2 text-sm font-semibold  rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline cursor-pointer ${
                        activeMarker === 4 ? "bg-gray-200" : ""
                      }`}
                      onClick={() => setActiveMarker(4)}
                      // href="#"
                    >
                      ABC-CBT Thought Diary
                    </a>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
        {/* content */}
        <div
          className={`
          
          ${
            activeMarker === 3
              ? `h-[5000px]`
              : `${
                  activeMarker === 4
                    ? `h-[11000] md:h-[9000px]`
                    : `h-[3000px] lg:h-[2000px]`
                }`
          } `}
        >
          {activeMarker === 1 ? <ObjectivesAndGoals /> : ""}
          {activeMarker !== 1 ? (
            <Functionalities activeMarker={activeMarker} />
          ) : (
            ""
          )}
          {/* {activeMarker === 3 ? <GetStarted /> : ""} */}
        </div>
      </div>
    </div>
  );
};

export default Landing;
