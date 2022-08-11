import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import { defaultDataUser } from "../components/Header";
import { REFRESH_TOKEN } from "../graphql/mutations";
import { RefreshTokenResponse } from "../graphql/types";
import { apolloRefreshToken } from "../lib/apollo-client";
import { storeData, userSelector } from "../store/reducers/userSlice";
import storage from "./storage";

export const refreshToken = async () => {
  try {
    const res = await apolloRefreshToken.mutate<
      RefreshTokenResponse,
      { refreshToken: string }
    >({
      mutation: REFRESH_TOKEN,
      variables: {
        refreshToken: localStorage.getItem("refreshToken") || "",
      },
    });
    if (!res.data) return;
    const { accessToken, refreshToken } = res.data.refreshToken;
    storage.setToken(accessToken, refreshToken);
    return accessToken;
  } catch (err) {
    throw err;
  }
};

export const parseJwt = (token: string) => {
  if (token === null) {
    return false;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

export const handleRefreshToken = async () => {
  if (!localStorage.getItem("accessToken")) return;
  const decoded = parseJwt(String(localStorage.getItem("accessToken")));
  const decodedRefresh = parseJwt(String(localStorage.getItem("refreshToken")));

  if (decoded === false) return;
  const expired = Number(decoded.exp) * 1000 <= Date.now();
  if (Number(decodedRefresh.exp) * 1000 <= Date.now()) {
    localStorage.clear();
  }
  try {
    expired && (await refreshToken());
  } catch (error) {
    localStorage.clear();
  }
};
