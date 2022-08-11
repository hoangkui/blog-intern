import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice";
// import logger from "redux-logger";
import thunk from "redux-thunk";

import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
// ...
const persistConfig = {
  key: "root",
  storage,
};
const userPersistedReducer = persistReducer(persistConfig, userReducer);
export const store = configureStore({
  reducer: { user: userPersistedReducer },
  middleware: [thunk],
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
