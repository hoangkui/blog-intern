import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import { Helmet } from "react-helmet";

import ChangeInfo from "./ChangeInfo";
import ChangePassword from "./ChangePassword";

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}
const Index = () => {
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <Helmet>
        <title>Setting</title>
      </Helmet>
      <div className="flex items-center justify-center my-24">
        <Box
          sx={{
            bgcolor: "background.paper",
            display: "flex",
          }}
        >
          <Tabs
            className="solid-border"
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: "divider" }}
          >
            <Tab
              label="Edit Profile"
              {...a11yProps(0)}
              sx={{ textTransform: "capitalize" }}
            />
            <Tab
              label="Change Password"
              {...a11yProps(1)}
              sx={{ textTransform: "capitalize" }}
            />
          </Tabs>
          <Typography component={"span"} variant={"body2"}>
            <div className="solid-border px-20 box-border">
              {value === 0 ? <ChangeInfo /> : <ChangePassword />}
            </div>
          </Typography>
        </Box>
      </div>
    </>
  );
};

export default Index;
