import {
  CaseReducer,
  configureStore,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "..";

type State = {
  username: string;
  image: string;
  bio: string;
  email: string;
  createdAt: Date;
};
const storeDataDeclare: CaseReducer<State, PayloadAction<State>> = (
  state: State,
  action: PayloadAction<State>
) => (state = action.payload);

const userSlice = createSlice({
  name: "user",
  initialState: {
    username: "",
    image: "",
    bio: "",
    email: "",
    createdAt: new Date(),
  },
  reducers: {
    storeData: storeDataDeclare,
  },
});
// reducer
const userReducer = userSlice.reducer;

// selector
export const userSelector = (state: RootState) => state.user;
export const { storeData } = userSlice.actions;

export default userReducer;
