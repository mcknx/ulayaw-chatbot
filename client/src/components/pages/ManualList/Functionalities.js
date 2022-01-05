import ModalImage from "react-modal-image";
import Accessibility from "./FunctionalList/Accessibility";
import UserManagement from "./FunctionalList/UserManagement";
import ABC_CBT_TD from "./FunctionalList/ABC_CBT_TD";

const Functionalities = (props) => {
  return (
    <div className=" space-y-[500px]">
      {props.activeMarker === 2 ? <Accessibility /> : ""}
      {props.activeMarker === 3 ? <UserManagement /> : ""}
      {props.activeMarker === 4 ? <ABC_CBT_TD /> : ""}

      {/* UserManagement */}
    </div>
  );
};

export default Functionalities;
