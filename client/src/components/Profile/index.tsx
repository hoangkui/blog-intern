import { useSelector } from "react-redux";

import { userSelector } from "../../store/reducers/userSlice";
import Content from "./Content";
import UserInfo from "./UserInfo";

const Index = () => {
  const user = useSelector(userSelector);

  return (
    <>
      <UserInfo />
      <Content username={user.username} />
    </>
  );
};

export default Index;
