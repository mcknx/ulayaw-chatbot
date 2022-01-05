const GetStarted = () => {
  return (
    <div className="md:ml-[256px] max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="lg:text-center mt-[50px]">
        <h2 className="text-base text-white font-medium  inline rounded px-4 py-2 tracking-wide uppercase bg-[#5dcfff]">
          General Objective
        </h2>
        {/* <h3 className="mt-3  text-3xl leading-8 font-medium tracking-tight text-gray-900 sm:text-4xl">
            Login
          </h3> */}
        <p className="mt-[50px] max-w-2xl text-xl text-gray-500 lg:mx-auto text-justify mb-[100px]">
          The proponents aim to create Ulayaw: A Web-Based Chatbot for
          Individuals that would assess suicidal behaviors of users utilizing
          the Suicidals Behaviors Questionnaire-Revised (SBQ-R) to help reduce
          suicidal tendencies. Ulayaw will be using a schema-guided dialogue
          dataset as the primary element to conduct the assessment and provide
          the appropriate response to the entire conversation with the user. By
          building the most appropriate conversational scheme, Ulayaw would like
          to help individuals to express and talk about their past and current
          psychological state. With a location-based service, critical cases
          that need immediate response and action by authorities will be
          included.
        </p>
        <h2 className="text-base text-white font-medium  inline rounded px-4 py-2 tracking-wide uppercase bg-[#5dcfff]">
          Specific Objectives
        </h2>
      </div>

      <div className="mt-[50px]">
        <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
          <div className="relative">
            <dt>
              <h4 className="absolute flex items-center justify-center w-[100px] h-8 rounded-md  tracking-wide font-regular text-sm text-blue-500">
                OBJECTIVE 1
              </h4>
              <h5 className="pt-1 ml-[120px] text-lg leading-6 font-medium text-gray-900">
                To gather sample of conversation and data sets:
              </h5>
            </dt>
            <dd className="mt-1 ml-14 text-base text-gray-500 flex flex-col">
              <label className="ml-24 flex items-center justify-start  rounded-md  tracking-wide font-regular text-sm">
                a. Dialogue Data set from different Mental Health Chat support
                organizations.
              </label>
              <label className="ml-24 flex items-center justify-start  rounded-md  tracking-wide font-regular text-sm">
                b. Secondary Data of conversation for Suicidal ideation and risk
                level.
              </label>
            </dd>
          </div>
          <div className="relative">
            <dt>
              <h4 className="absolute flex items-center justify-center w-[100px] h-8 rounded-md  tracking-wide font-regular text-sm text-blue-500">
                OBJECTIVE 2
              </h4>
              <h5 className="pt-1 ml-[120px] text-lg leading-6 font-medium text-gray-900">
                To evaluate the validity and verify the chatbot conversational
                structure.
              </h5>
            </dt>
            <dd className="mt-1 ml-14 text-base text-gray-500 flex flex-col">
              <label className="ml-24 flex items-center justify-start  rounded-md  tracking-wide font-regular text-sm">
                a. Handcrafted dataset of User’s conversation.
              </label>
              <label className="ml-24 flex items-center justify-start  rounded-md  tracking-wide font-regular text-sm">
                b. Check the input-response conversations.
              </label>
            </dd>
          </div>
          <div className="relative">
            <dt>
              <h4 className="absolute flex items-center justify-center w-[100px] h-8 rounded-md  tracking-wide font-regular text-sm text-blue-500">
                OBJECTIVE 3
              </h4>
              <h5 className="pt-1 ml-[120px] text-lg leading-6 font-medium text-gray-900">
                Create an assistive conversational scheme following the ABC
                Model fitting with the Tagalog Language.
              </h5>
            </dt>
          </div>
          <div className="relative">
            <dt>
              <h4 className="absolute flex items-center justify-center w-[100px] h-8 rounded-md  tracking-wide font-regular text-sm text-blue-500">
                OBJECTIVE 4
              </h4>
              <h5 className="pt-1 ml-[120px] text-lg leading-6 font-medium text-gray-900">
                Develop a Web-based chatbot for users experiencing suicidal
                ideation and tendencies.
              </h5>
            </dt>
          </div>
          <div className="relative">
            <dt>
              <h4 className="absolute flex items-center justify-center w-[100px] h-8 rounded-md  tracking-wide font-regular text-sm text-blue-500">
                OBJECTIVE 5
              </h4>
              <h5 className="pt-1 ml-[120px] text-lg leading-6 font-medium text-gray-900">
                Test and Deploy Ulayaw chatbot to target users and with the
                other lifeline Authorities.
              </h5>
            </dt>
          </div>
        </dl>
      </div>
      <div className="lg:text-center mt-[50px]">
        <h2 className="text-base text-white font-medium  inline rounded px-4 py-2 tracking-wide uppercase bg-[#5dcfff]">
          Goals
        </h2>

        <p className="mt-[50px] max-w-2xl text-xl text-gray-500 lg:mx-auto text-justify mb-[100px]">
          The Ulayaw chatbot will converse in the Tagalog language, which is way
          more understandable and convenient for the target user. It is designed
          for expression and conversation, allowing users to seek help and
          assistance based on the user experiences to its emotional aspects. On
          the other hand, Ulayaw chatbot aims to be affiliated with Mental
          health Facilities and the Professional and 911 for caution and
          awareness in times of emergency. Ulayaw is proposed to be an assistive
          tool to the existing intervention addressing its limitations and is in
          no way will completely replace human interaction. The chatbot will be
          created to help assist the mental health sector on catering patient
          assessment to suicidal ideation and risk level. And lastly, it is the
          hope of this project that with Ulayaw as a tool to help relieve mental
          stress, individuals experiencing suicidal ideation in the Philippines
          will be alleviated.
        </p>
      </div>
    </div>
  );
};

export default GetStarted;
