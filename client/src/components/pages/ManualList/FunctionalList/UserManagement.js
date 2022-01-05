import ModalImage from "react-modal-image";

const UserManagement = () => {
  return (
    <>
      <div className="md:ml-[256px] max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="lg:text-center mb-[50px] mt-[50px] space-y-[100px]">
          <h2 className="text-base text-white font-medium  inline rounded px-4 py-2 md:px-[100px] md:py-[30px]  tracking-wide uppercase bg-[#5dcfff]">
            User Management
          </h2>
          <div className="space-y-[100px]">
            <ModalImageComponent
              title={"Sign up"}
              items={["Click Login button"]}
              url={"https://gcdn.pbrd.co/images/5ePCBHjAOfUR.png?o=1"}
            />
            <ModalImageComponent
              //   title={"Click Click here to Signup text"}
              items={["Click Click here to Signup text"]}
              url={"https://gcdn.pbrd.co/images/mOfY7wg4WcdL.png?o=1"}
            />
            <ModalImageComponent
              //   title={"Click Click here to Signup text"}
              items={[
                "Fill in the needed credentials",
                "Click Register button",
              ]}
              url={"https://gcdn.pbrd.co/images/nEz8Kc774eg4.png?o=1"}
            />
            <ModalImageComponent
              title={"Account Activation"}
              items={["Check your email for the activation"]}
              url={"https://gcdn.pbrd.co/images/M6Okck3SbuHd.png?o=1"}
            />
            <ModalImageComponent
              //   title={"Account Activation"}
              items={["Click Activation Link"]}
              url={"https://gcdn.pbrd.co/images/Na10E3p3Yp9B.png?o=1"}
            />
            <ModalImageComponent
              //   title={"Account Activation"}
              items={["Click Activate your Account button"]}
              url={"https://gcdn.pbrd.co/images/XzXeAqyrCGd1.png?o=1"}
            />
            <ModalImageComponent
              title={"Login"}
              items={["Click Login button"]}
              url={"https://gcdn.pbrd.co/images/tr5Nip12q4YA.png?o=1"}
            />
            <ModalImageComponent
              //   title={"Login"}
              items={[
                "Input Login credentials and then click the Login button",
              ]}
              url={"https://gcdn.pbrd.co/images/NTUNLiJOlwLT.png?o=1"}
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

export default UserManagement;
