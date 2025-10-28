import { ThemeProvider } from "@/components/theme-provider";
import { router } from "./router";
import { Toaster } from "@components/sonner";
import { RouterProvider } from "react-router";
import { Suspense } from "react";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Suspense fallback={<div>Loading....</div>}>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
