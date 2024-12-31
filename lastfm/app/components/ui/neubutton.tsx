import React from "react";

interface NBProps {
  type: "button" | "submit" | "reset";
  text: string;
}

const NeuButton: React.FC<NBProps> = ({ type, text }) => {
  return (
    <button type={type} className="neu_button">
      {text}
    </button>
  )
}

export { NeuButton }