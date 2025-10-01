import { createRoot } from "react-dom/client";
import "./index.css";
import "@ant-design/v5-patch-for-react-19";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { AppInitProvider } from "./AppInitProvider.tsx";
import { App } from "./App.tsx";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <AppInitProvider>
        <App />
      </AppInitProvider>
    </BrowserRouter>
  </Provider>,
);
