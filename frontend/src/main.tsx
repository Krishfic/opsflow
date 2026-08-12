import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App.tsx";
import { store } from "./app/store";

import "./index.css";
import AuthInitializer from "./features/auth/AuthInitializer.tsx";

createRoot(
    document.getElementById("root")!
).render(
    <StrictMode>
        <Provider store={store}>
    <AuthInitializer>
        <App />
    </AuthInitializer>
</Provider>
    </StrictMode>
);