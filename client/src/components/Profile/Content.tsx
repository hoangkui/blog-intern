import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useSelector } from "react-redux";
import { userSelector } from "../../store/reducers/userSlice";

import MyArticles from "./MyArticles";
import MyFavorited from "./MyFavorited";
import MyPeding from "./MyPending";
import MySaved from "./MySaved";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
    sx: { textTransform: "none" },
  };
}
const Content = ({ username }: { username: string }) => {
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const user = useSelector(userSelector);
  const isMyProfile = user.username === username;

  const nameLabel = `${isMyProfile ? "My" : username + "'"}`;
  return (
    <div className="text-[#373a3c] flex flex-wrap leading-6 items-center justify-center mx-60 pb-60">
      <div className="basis-5/6">
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label={`${nameLabel} articles`} {...a11yProps(0)} />
              {isMyProfile && (
                <Tab label="My favorited articles" {...a11yProps(1)} />
              )}
              {isMyProfile && (
                <Tab label="My saved articles" {...a11yProps(2)} />
              )}
              {isMyProfile && (
                <Tab label="Will publish Soon" {...a11yProps(3)} />
              )}
            </Tabs>
          </Box>
          {value === 0 && <MyArticles username={username} />}
          {value === 1 && isMyProfile && <MyFavorited username={username} />}
          {value === 2 && isMyProfile && <MySaved username={username} />}
          {value === 3 && isMyProfile && <MyPeding />}
        </Box>
      </div>
    </div>
  );
};

export default Content;
