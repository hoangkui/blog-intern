import { ApolloProvider } from "@apollo/client";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import client from "./lib/apollo-client";
import { AppRoutes } from "./routes";
import { store } from "./store";
import ScrollToTop from "./utils/StrollToTop";

const persistor = persistStore(store);
import "./App.css";
function App() {
  return (
    <div>
      <ApolloProvider client={client}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ScrollToTop>
              <AppRoutes />
            </ScrollToTop>
          </PersistGate>
        </Provider>
      </ApolloProvider>
    </div>
  );
}

export default App;
