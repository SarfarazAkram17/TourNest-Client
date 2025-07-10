import Lottie from "lottie-react";
import loading from "../../assets/animations/loading.json";

const Loading = () => {
  return (
    <div className="h-[70vh] flex justify-center items-center">
      {" "}
      <Lottie
        animationData={loading}
        loop={true}
        className="h-[30vh]"
      />
    </div>
  );
};

export default Loading;
