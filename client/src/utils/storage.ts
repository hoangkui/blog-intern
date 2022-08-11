const storage = {
  setToken: (aT: string, rT: string) => {
    localStorage.setItem("accessToken", aT);
    localStorage.setItem("refreshToken", rT);
  },
  //   get: (token: string) => {
  //     window.localStorage.setItem(`${storagePrefix}token`, JSON.stringify(token));
  //   },
  clearToken: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};

export default storage;
