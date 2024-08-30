import Lottie from "lottie-react";
import animationData from "@/animations/animation_loading.json"; // Path to your Lottie animation JSON file

const LottieAnimation = () => {
  return (
    <div className="lottie-container h-screen w-full max-w-4xl mx-auto flex items-center flex-col">
      <Lottie
        animationData={animationData}
        className="h-[500px] "
        loop={true}
      />
      <h1 className="text-2xl font-light text-black">Loading...</h1>
    </div>
  );
};

export default LottieAnimation;
