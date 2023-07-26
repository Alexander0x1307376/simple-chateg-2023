import { FC } from "react";

const videoCalls = Array.from({ length: 13 }, (_, index) => ({ id: index }));

const VideoSection: FC = () => {
  return (
    <div className="flex rounded-lg flex-wrap justify-center">
      {videoCalls.map((item) => (
        <div key={item.id} className="mx-2 h-40 w-60 my-2 bg-green-900">
          {item.id}
        </div>
      ))}
    </div>
  );
};

export default VideoSection;
