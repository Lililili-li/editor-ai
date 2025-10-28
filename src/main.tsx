import { createRoot } from "react-dom/client";
import "./assets/index.css";
import "./assets/editor.less";
import App from "./App.tsx";
import { store } from "./store";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
