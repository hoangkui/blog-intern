import { useMutation } from "@apollo/client";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import { debounce } from "debounce";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

import { FollowUserMutation } from "../../graphql/mutations";
import { FollowUser, FollowUserProps } from "../../graphql/types";
import { InfoContext } from "../Article/Info";

const Follow = ({
  data,
  changeCount = (x: boolean, y: string) => {},
}: {
  data: { following: boolean; username: string };
  changeCount?: (x: boolean, y: string) => void;
}) => {
  const navigate = useNavigate();
  const [followUser, { loading }] = useMutation<FollowUser, FollowUserProps>(
    FollowUserMutation
  );
  const [following, setFollowing] = useState<boolean>(data.following);

  const handleToogle = debounce(async () => {
    if (!localStorage.getItem("accessToken")) {
      swal("Login please", "", "warning");
      const encode = encodeURIComponent(String(window.location));
      navigate(`/auth/login?redirect=${encode}`);
      return;
    }
    const res = await followUser({
      variables: { username: data.username },
    });
    if (res.data?.followUser.success) {
      changeCount(following, data.username);
      setFollowing(!following);
    }
  }, 300);
  const handleUnfollow = async () => {
    swal({
      title: "Are you sure?",
      text: `Unfollow @${data.username}`,
      icon: "warning",
      buttons: [true, true],
      dangerMode: true,
    }).then(async (willDelete) => {
      willDelete && (await handleToogle());
    });
  };
  if (loading)
    return (
      <LoadingButton loading variant="outlined">
        s
      </LoadingButton>
    );
  return (
    <div>
      {following ? (
        <>
          <Button
            variant="outlined"
            size="small"
            sx={{
              textTransform: "capitalize",
              color: "black",
              backgroundColor: "white ",
            }}
            onClick={() => handleUnfollow()}
          >
            Following
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="contained"
            size="small"
            sx={{ textTransform: "capitalize" }}
            onClick={() => handleToogle()}
          >
            Follow
          </Button>
        </>
      )}
    </div>
  );
};

export default Follow;
