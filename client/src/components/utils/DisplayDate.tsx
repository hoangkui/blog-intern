import moment from "moment";
import { useEffect, useState } from "react";

import displayDate from "../../utils/displayDate";

const DisplayDate = ({ date, title }: { date: Date; title?: string }) => {
  return (
    <p className="text-[#757575] text-sm">
      <dfn className="not-italic" title={moment(date).format("LLLL")}>
        {title}
        {moment(date).calendar()}
      </dfn>
    </p>
  );
};
const DisplayDateComment = ({ date }: { date: Date }) => {
  const [time, setTime] = useState(moment(date).fromNow());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(moment(date).fromNow());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <p className="text-gray text-sm not-italic">
      <dfn title={moment(date).format("LLLL")} className="not-italic">
        {time}
      </dfn>
    </p>
  );
};
export { DisplayDateComment };
export default DisplayDate;
