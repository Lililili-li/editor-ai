import { lazy } from "react";
import { createBrowserRouter, redirect } from "react-router";
import LoadingSpinner from "@components/LoadingSpinner";
import Layout from "@/layout/Layout";

const Demo = lazy(() => import("@/pages/Demo"));

export const routeConfig = [
  {
    path: "/",
    loader: () => {
      if (localStorage.getItem("id")) {
        return redirect("/home");
      } else {
        return redirect("/login");
      }
    },
  },
  {
    path: "/login",
    lazy: async () => {
      const Login = await import("@/pages/Login");
      return {
        Component: Login.default,
      };
    },
    HydrateFallback: LoadingSpinner,
    name: "Login",
  },
  {
    path: "home",
    Component: Layout,
    children: [
      {
        index: true,
        lazy: async () => {
          const comp = await import("@/pages/home/Home");
          return {
            Component: comp.default,
          };
        },
        HydrateFallback: LoadingSpinner,
      },
      {
        path: "publish",
        lazy: async () => {
          const comp = await import("@/pages/Publish");
          return {
            Component: comp.default,
          };
        },
        HydrateFallback: LoadingSpinner,
      },
      {
        path: "collection",
        lazy: async () => {
          const comp = await import("@/pages/collection/Collection");
          return {
            Component: comp.default,
          };
        },
        HydrateFallback: LoadingSpinner,
      },
      {
        path: "shard",
        lazy: async () => {
          const comp = await import("@/pages/Shard");
          return {
            Component: comp.default,
          };
        },
        HydrateFallback: LoadingSpinner,
      },
    ],
  },
  {
    path: "/work/:id?",
    Component: Layout,
    children: [
      {
        index: true,
        lazy: async () => {
          const comp = await import("@/pages/work/Work");
          return {
            Component: comp.default,
          };
        },
        HydrateFallback: LoadingSpinner,
      }
    ]
  },
  
  {
    path: "/demo",
    Component: Demo,
  },
];

export const router = createBrowserRouter(routeConfig);
