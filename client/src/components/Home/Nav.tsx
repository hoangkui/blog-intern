import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { userSelector } from "../../store/reducers/userSlice";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
    sx: { textTransform: "capitalize" },
  };
}
const Nav = () => {
  const { tagName } = useParams();

  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const user = useSelector(userSelector);
  const isLogin = user.username !== "";

  useEffect(() => {
    if (tagName) {
      setValue(2);
      return;
    }

    window.location.href.includes("all") && setValue(1);
    return () => {
      if (window.location.href.includes("all")) {
        setValue(1);
        return;
      }
      setValue(0);
    };
  });
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
      >
        <Tab
          onClick={() => {
            navigate("");
          }}
          style={{ display: !isLogin ? "none" : "block" }}
          label="Your Feeds"
          {...a11yProps(0)}
        />
        <Tab
          onClick={() => {
            navigate("/all");
          }}
          label="All Feeds"
          {...a11yProps(1)}
        />
        {tagName && (
          <Tab
            label={tagName}
            {...a11yProps(2)}
            sx={{ textTransform: "lowercase" }}
          />
        )}
      </Tabs>
    </Box>
  );
};

export default Nav;
