import { FC } from "react";
import { getFirstLetters } from "../../utils/getFirstLetters";
import { computeColorByString } from "../../utils/findClosestColor";

export interface AvaProps {
  url?: string;
  label: string;
  size?: string;
}

const Ava: FC<AvaProps> = ({ url, label, size }) => {
  if (!url) {
    const acronym = getFirstLetters(label);
    const color = computeColorByString(acronym);

    return (
      <div
        className="rounded-full text-white font-bold text-[70%] overflow-clip flex items-center justify-center uppercase"
        style={{ backgroundColor: color, height: size, width: size }}
      >
        {acronym}
      </div>
    );
  } else {
    return (
      <div style={{ height: size, width: size }} className="h-full w-full">
        <img
          className="block object-cover rounded-full"
          src={url}
          alt={label}
        />
      </div>
    );
  }
};

export default Ava;
