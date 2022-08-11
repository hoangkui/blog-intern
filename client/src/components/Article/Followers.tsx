import { useLazyQuery } from "@apollo/client";
import { Avatar, Fade, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { GET_FOLLOWERS } from "../../graphql/queries";
import { GetFollowers } from "../../graphql/types";
import { userSelector } from "../../store/reducers/userSlice";
import Follow from "../User/Follow";

interface FollowersProps {
  idAuthor: string;
  count: number;
  changeCount?: (x: boolean, y: string) => void;
}
const Followers = ({
  idAuthor,
  count,
  changeCount = (x: boolean, y: string) => {},
}: FollowersProps) => {
  const user = useSelector(userSelector);
  const [getFollowers, { data }] = useLazyQuery<GetFollowers, { id: string }>(
    GET_FOLLOWERS,
    { fetchPolicy: "no-cache" }
  );

  const [open, setOpen] = useState(false);
  const handleGetComments = async () => {
    const res = await getFollowers({
      variables: { id: idAuthor },
    });
    const length = res.data?.getProfileById.profile.followed.length || 0;
    length > 0 && setOpen(true);
  };
  return (
    <>
      <p
        className="text-[#362b2e] cursor-pointer hover:opacity-90"
        onClick={handleGetComments}
      >
        <span className="font-semibold">{count}</span> Followers
      </p>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <Fade in={true} timeout={2000}>
          <div>
            <DialogTitle className="text-center">{count} Followers</DialogTitle>
            <List sx={{ pt: 0 }}>
              {data?.getProfileById.profile.followed.map((profile) => (
                <div
                  key={profile.username}
                  className="flex items-center justify-between w-[600px] px-8 my-3"
                >
                  <div className="flex gap-2 items-center">
                    <Avatar
                      src={profile.image}
                      className="rounded-[50%] shadow-sm w-8 h-8"
                    />
                    <div>
                      <Link
                        className="font-semibold text-md cursor-pointer block"
                        to={`/u/${profile.username}`}
                      >
                        {profile.username}
                      </Link>
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: "2",
                          WebkitBoxOrient: "vertical",
                          fontSize: "0.875rem",
                        }}
                        className="text-sm text-[#757575] my-0 font-light w-full"
                      >
                        {profile.bio}
                      </Typography>
                    </div>
                  </div>
                  {profile.username !== user.username && (
                    <div>
                      <Follow
                        data={{
                          following: profile.following,
                          username: profile.username,
                        }}
                        changeCount={changeCount}
                      />
                    </div>
                  )}
                </div>
              ))}
            </List>
          </div>
        </Fade>
      </Dialog>
    </>
  );
};

export default Followers;
