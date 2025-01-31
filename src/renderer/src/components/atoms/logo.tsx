import React from "react";

const Logo: React.FC = () => {
  return (
    <div>
      <h1 className="text-center mb-0">
        <span className="text-white outline-white">Trivia</span>
        <span
          style={{
            fontWeight: "bold",
            background:
              "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          CON
        </span>
        <span className="text-white outline-white">™</span>
      </h1>
      <div className="">
        <span
          style={{
            fontSize: "10px",
            fontFamily: "monospace",
            color: "#00ff00",
          }}
        >
          ver. 0.0.0.2137-pre_alpha1
        </span>
      </div>
    </div>
  );
};
export default Logo;
