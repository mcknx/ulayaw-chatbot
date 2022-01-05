import ModalImage from "react-modal-image";

const ABC_CBT_TD = () => {
  return (
    <>
      <div className="md:ml-[256px] max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="lg:text-center mb-[50px] mt-[50px] space-y-[100px]">
          <h2 className="text-base text-white font-medium  inline rounded px-4 py-2 md:px-[100px] md:py-[30px]  tracking-wide uppercase bg-[#5dcfff]">
            ABC-CBT Thought Diary
          </h2>
          <div className="space-y-[100px]">
            <ModalImageComponent
              title={"ABC"}
              items={["Click Continue button"]}
              url={"https://gcdn.pbrd.co/images/L4aIrSdOx333.png?o=1"}
            />
            <ModalImageComponent
              title={"Emotion Box"}
              items={["Select only one emoji", "Click Done button"]}
              url={"https://gcdn.pbrd.co/images/pbD2CtLo1xjq.png?o=1"}
            />
            <ModalImageComponent
              title={"Activating Events (Kaganapan)"}
              items={[
                "Allow user to type or input detailed response/s given to the asked question.",
                "User should provide response answering when (kailan), saan (where), at paano (how) questions.",
              ]}
              url={"https://gcdn.pbrd.co/images/ksHog8VAbJbV.png?o=1"}
            />
            <ModalImageComponent
              title={"Understanding the user response (Kaganapan)"}
              items={[
                "After user input its response, the Chatbot will provide information related to the response.",
                "User will wait for a minute for the information to appear.",
              ]}
              url={"https://gcdn.pbrd.co/images/Wv9jFSVDzLxC.png?o=1"}
            />
            <ModalImageComponent
              title={"Activating Events (Kaganapan)"}
              items={[
                "Select Oo, meron pa button to input more response from the current topic.",
                "Select Wala na button to proceed to the next sequence of question.",
              ]}
              url={"https://gcdn.pbrd.co/images/bNxJzlYKAU8P.png?o=1"}
            />
            <ModalImageComponent
              title={
                "Selecting the main activating events (Kaganapan) and Thought Diary"
              }
              items={[
                "Select one quick response balloon.",
                "Displays user response from the chat box user interactions.",
              ]}
              url={"https://gcdn.pbrd.co/images/q8wuboUrmDUj.png?o=1"}
            />
            <ModalImageComponent
              title={"Consequences (Kahinatnan)"}
              items={[
                "User should input words separated with comma. (Example: Galit , balisa , lungkot , nag-aalala)",
              ]}
              url={"https://gcdn.pbrd.co/images/prAubGclZK0L.png?o=1"}
            />
            <ModalImageComponent
              title={"Rate the main Consequences (Kahinatnan)"}
              items={["User input numerical response (range from 0 to 100)"]}
              url={"https://gcdn.pbrd.co/images/kq8agpZi1eG5.png?o=1"}
            />
            <ModalImageComponent
              title={"Explain the rate for the main Consequences (Kahinatnan)"}
              items={[
                "User should this explain the reason behind rating the main Consequences (Kahinatnan)",
              ]}
              url={"https://gcdn.pbrd.co/images/kMDBT0Dbe3Nk.png?o=1"}
            />
            <ModalImageComponent
              title={
                "Understanding the user response Consequences (Kahinatnan)"
              }
              items={[
                "After user input its response, the Chatbot will provide information related to the response.",
                "User will wait for a minute for the information to appear.",
              ]}
              url={"https://gcdn.pbrd.co/images/H4xgwQ7mzuiS.png?o=1"}
            />
            <ModalImageComponent
              title={"Beliefs (Paniniwala)"}
              items={[
                "Allow user to type or input detailed response/s given to the asked question.",
              ]}
              url={"https://gcdn.pbrd.co/images/UosrGJsCEodE.png?o=1"}
            />
            <ModalImageComponent
              title={"Interpretation(s)"}
              items={[
                "User can select a button Oo or Hindi",
                "Allow user to type or input detailed response/s given to the asked question.",
              ]}
              url={"https://gcdn.pbrd.co/images/YUTlCRMxk19d.png?o=1"}
            />
            <ModalImageComponent
              title={"Allow user to tell their Interpretation(s)"}
              items={[
                "Allow user to type or input detailed response/s given to the asked question.",
              ]}
              url={"https://gcdn.pbrd.co/images/YUTlCRMxk19d.png?o=1"}
            />
            <ModalImageComponent
              title={"Understanding the user response Interpretation(s)"}
              items={[
                "After user input its response, the Chatbot will provide information related to the response.",
                "User will wait for a minute for the information to appear",
              ]}
              url={"https://gcdn.pbrd.co/images/g94qCEtEPBzI.png?o=1"}
            />
            <ModalImageComponent
              title={"Allow user to tell their Interpretation(s)"}
              items={[
                "Allow user to type or input detailed response/s given to the asked question.",
              ]}
              url={"https://gcdn.pbrd.co/images/YUTlCRMxk19d.png?o=1"}
            />

            <ModalImageComponent
              title={"End of the ABC Thought Diary"}
              items={["User can select a button oo, save as PDF or hindi"]}
              url={"https://gcdn.pbrd.co/images/C8pVaUeiZb0p.png?o=1"}
            />
            <ModalImageComponent
              title={"Save to Database and Print PDF"}
              items={[
                "After the user selected 'Oo, Save as PDF' the Chatbot will save the Thought Diary of the user into the database and have user a copy of the Thought Diary in PDF format.",
                "After the user selected 'Hindi' the Chatbot will save the Thought Diary of the user into the database and have user will not have Thought Diary in PDF format.",
              ]}
              url={"https://gcdn.pbrd.co/images/0Po6lliAaT4K.png?o=1"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const ModalImageComponent = (props) => {
  return (
    <div clasName="">
      <div className="  w-full my-4 lg:w-9/12 mr-auto rounded-2xl shadow-2xl">
        <ModalImage
          small={props.url}
          large={props.url}
          alt={`${props.title ? props.title : ""}: ${
            props.items
              ? props.items.map((item, i) => {
                  return item;
                })
              : ""
          }`}
          showRotate={true}
        />
        ;
        {/* <img
      alt="Card"
      src="https://gcdn.pbrd.co/images/jINL23BxopeK.png"
      className="max-w-full rounded-lg shadow-lg"
    /> */}
      </div>
      <div className="relative w-full lg:-mt-96 lg:w-3/6 p-8 ml-auto bg-blue-800 rounded-2xl z-10">
        <div className="flex flex-col text-white">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-indigo-200 fill-current w-12 h-12 md:w-16 md:h-16"
              viewBox="0 0 24 24"
            >
              <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692C5.132 6.116 4.723 6.377 4.421 6.76c-.33.358-.656.734-.909 1.162C3.219 8.33 3.02 8.778 2.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C2.535 17.474 4.338 19 6.5 19c2.485 0 4.5-2.015 4.5-4.5S8.985 10 6.5 10zM17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162C14.219 8.33 14.02 8.778 13.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C13.535 17.474 15.338 19 17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10z" />
            </svg>
          </div>
          <p className="text-white my-5 px-2">
            <ol>
              {props.items
                ? props.items.map((item, i) => {
                    return <li>{item}</li>;
                  })
                : ""}
            </ol>
          </p>
          <div className="flex justify-between pl-2">
            <h3 className="font-bold text-2xl">
              {props.title ? props.title : ""}
            </h3>
            <i className="fas fa-quote-right text-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ABC_CBT_TD;
