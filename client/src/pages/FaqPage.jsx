import React from "react";
import image from "../assets/hero.svg";
const FaqPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center px-6">
      {/** middle container */}
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row justify-between gap-12">
        {/** Left side */}
        <div className="max-w-2xl space-y-6 text-secondary text-center md:text-start">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl leading-tight">
            {" "}
            Welcome to facebook <span className="text-highlight">
              {" "}
              Connect
            </span>{" "}
            securly with people from around the world.
          </h2>
          <p className="text-base"> Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque et, harum nesciunt pariatur autem ipsa sint laboriosam illum sunt corrupti placeat sapiente vel praesentium magni, nam, repellendus natus doloremque a!</p>
          {/** cta button */}
          <div className="flex flex-col sm:flex-row justify-center md:justify-start sm:gap-6 gap-4">
            <button
              type="button"
              className="bg-white text-secondary rounded-4xl py-4 px-8 text-lg"
            >
              {" "}
              Join us Today{" "}
            </button>
            <button
              type="button"
              className="bg-orange-500 text-white rounded-4xl py-4 px-10 text-lg"
            >
              {" "}
              Login{" "}
            </button>
          </div>
        </div>
        {/** right side */}
        <div className="bg-purple-800 flex justify-center md:justify-end w-full md:w-1/2">
        
           <img src={image} alt=""className="w-[320px] sm:w-[480px] lg:w-[600px]" />
        
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
