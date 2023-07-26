import { FC } from "react";
import VideoSection from "../components/VideoSection";

const MeetingSection: FC = () => {
  return (
    <div className="h-full flex flex-col">
      <h2 className="grow-0 py-4 px-2">Общий чятег</h2>
      <div className="flex-1 p-2 overflow-auto">
        <VideoSection />
      </div>
      <div className="flex-1 p-2">Текстовый чат</div>
    </div>
  );
};

export default MeetingSection;
