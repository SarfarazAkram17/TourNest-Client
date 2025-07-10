import Lottie from "lottie-react";
import loading from "../../assets/animations/loading.json";

const Loading = () => {
  return (
    <div className="h-screen flex justify-center items-center">
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
