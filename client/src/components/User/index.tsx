import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { GetProfileQuery } from "../../graphql/queries";
import { GetProfile, GetProfileProps } from "../../graphql/types";

import { userSelector } from "../../store/reducers/userSlice";
import NotFound from "../../utils/NotFound";
import Content from "../Profile/Content";
import UserInfo from "./UserInfo";

const Index = () => {
  const { username } = useParams();
  const user = useSelector(userSelector);
  const navigate = useNavigate();
  const { loading, data } = useQuery<GetProfile, GetProfileProps>(
    GetProfileQuery,
    {
      variables: { username: String(username) },
      fetchPolicy: "no-cache",
    }
  );

  if (loading) return <h1>loading</h1>;
  if (!data) return null;
  if (!data.getProfile.success) return <NotFound />;
  return (
    <>
      <Helmet>
        <title>{username}</title>
      </Helmet>
      <UserInfo profile={data.getProfile.profile} />
      <Content username={String(username)} />
    </>
  );
};

export default Index;
