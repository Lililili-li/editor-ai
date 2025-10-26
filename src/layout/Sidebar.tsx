import { Button } from "../components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BookOpenText,
  Search,
  HeartPlus,
  SquareArrowOutUpRight,
  Rose,
  Star,
} from "lucide-react";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { useNavigate, useLocation } from "react-router";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { useDevice } from "@/composable/use-device";
import { HotKeys } from "@douyinfe/semi-ui";
import SearchCommand from "@/pages/home/components/SearchCommand";
import UserInfo from "@/pages/profile/UserInfo";
import Articles from "@/pages/work/Articles";

interface MenuProps {
  path: string;
  name: string;
  icon: ReactNode;
}

const menus: MenuProps[] = [
  {
    path: "/home",
    name: "主页",
    icon: <BookOpenText style={{ width: "16px" }} />,
  },
  {
    path: "/collection",
    name: "收藏",
    icon: <Star style={{ width: "16px" }} />,
  },
  {
    path: "/publish",
    name: "分享",
    icon: <SquareArrowOutUpRight style={{ width: "16px" }} />,
  },
  {
    path: "/community",
    name: "逛逛",
    icon: <Rose style={{ width: "16px" }} />,
  },
];

const SearchBar = () => {
  const { isMac } = useDevice();
  const macHotKeys = [HotKeys.Keys.Meta, "j"];
  const windowHotKeys = [HotKeys.Keys.Control, "j"];
  const SearchCommandRef = useRef<{ openModal: () => void }>(null);
  const showDialog = () => {
    SearchCommandRef.current?.openModal();
  };
  return (
    <div
      className="bg-[#ffffff] dark:bg-[#1a1a1a] rounded-md relative flex items-center mb-2 h-[32px] cursor-pointer hover:[&_.tip]:opacity-100"
      onClick={showDialog}
    >
      <HotKeys
        hotKeys={isMac ? macHotKeys : windowHotKeys}
        onHotKey={showDialog}
        style={{ display: "none" }}
      ></HotKeys>
      <Search className="absolute top-1/2 -translate-y-1/2 left-2" size={16} />
      <input
        type="text"
        placeholder="搜索"
        className="outline-0 border-0 pl-7 text-sm pointer-none: cursor-pointer"
        disabled
      />
      <div className="tip right-2 top-1/2 -translate-y-1/2 absolute opacity-0">
        <KbdGroup>
          <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
          <span>+</span>
          <Kbd>J</Kbd>
        </KbdGroup>
      </div>
      <SearchCommand ref={SearchCommandRef} />
    </div>
  );
};

const Sidebar = () => {
  const [activeRoute, setActiveRoute] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const { pathname } = location;
    setActiveRoute(pathname);
  }, [location]);

  return (
    <div className="h-full bg-muted px-3 py-1 dark:bg-[#27272a]">
      <div className="profile-info flex justify-between mb-2 items-center">
        <div className="logo flex items-center gap-2">
          <img src="/logo.png" alt="" className="rounded-[4px] w-[28px]" />
          <span
            className="text-gray-600 dark:text-gray-100 font-bold text-[18px]"
            style={{ fontFamily: "kx" }}
          >
            Editor AI
          </span>
        </div>
        <UserInfo />
      </div>
      <div className="menu-list [&_.active]:bg-black/5 [&_.active]:text-gray-900 [&_.active]:dark:bg-white/10 [&_.active]:dark:text-gray-200 [&_.active]:dark:hover:bg-white/8">
        <SearchBar />
        {menus.map((item, index) => {
          return (
            <div className="menu-item" key={index}>
              <Button
                variant="ghost"
                className={`p-0 px-2 h-8 text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 w-full justify-start items-center gap-2 ${
                  "/home" + (item.path === "/home" ? "" : item.path) ===
                  activeRoute
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  navigate("/home" + (item.path === "/home" ? "" : item.path))
                }
              >
                <span>{item.icon}</span>
                <span className="text-[16px]">{item.name}</span>
              </Button>
            </div>
          );
        })}
      </div>
      <Separator className="my-2" />
      <Articles />
    </div>
  );
};

export default Sidebar;
