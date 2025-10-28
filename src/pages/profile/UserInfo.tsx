import type { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@components/avatar";
import { Button } from "@components/button";
import { Bell, Check } from "lucide-react";
import { logout, setUserInfo } from "@/store/features/userSlice";
import userService from "@/api/user-service";
import { useRequest } from "ahooks";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@components/dropdown-menu";
import { LanguageEnum, setLanguage, setTheme, ThemeEnum } from "@/store/features/appSlice";
import { useTheme, type Theme } from "@/components/theme-provider";

const themeMap = [
  {
    label: ThemeEnum.light,
    value: 'light',
  },
  {
    label: ThemeEnum.dark,
    value: 'dark',
  },
  {
    label: ThemeEnum.system,
    value: 'system',
  },
];

const languageMap = [
  {
    label: LanguageEnum.chinese,
    value: 'chinese',
  },
  {
    label: LanguageEnum.english,
    value: 'english',
  },
];
const UserInfo = () => {
  const { theme, setTheme: setProviderTheme } = useTheme();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { appConfig } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();
  const localUserInfo = JSON.parse(localStorage.getItem("userInfo")!);
  useRequest(() => userService.getUserInfo((localUserInfo as any)?.id), {
    onSuccess: (res) => {
      dispatch(setUserInfo(res));
    },
  });
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" className="p-0 px-2 h-9">
        <Bell style={{ width: "18px" }} />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="p-0 px-2 h-9">
              <Avatar className="w-[28px] h-[28px]">
                <AvatarImage src="https://avatars.githubusercontent.com/u/88611687?v=4" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>
            <div className="flex items-center gap-2">
              <Avatar className="w-[28px] h-[28px]">
                <AvatarImage src="https://avatars.githubusercontent.com/u/88611687?v=4" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <span className="text-sm overflow-ellipsis overflow-hidden whitespace-nowrap font-bold">
                {userInfo.username}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex justify-between">
                <div className="flex-1 flex justify-between items-center pr-1">
                  <span>外观</span>
                  <span className="text-[13px] text-[#444] dark:text-[#eee]">跟随系统</span>
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {themeMap.map((item) => (
                    <DropdownMenuItem key={item.value} className="flex justify-between items-center" onClick={() => {
                      setProviderTheme(item.value as Theme)
                      dispatch(setTheme(item.value))
                    }}>
                      <span>{item.label}</span>
                      {item.value === appConfig.theme && <Check style={{ width: '15px' }}/>}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex justify-between">
                <div className="flex-1 flex justify-between items-center pr-1">
                  <span>语言</span>
                  <span className="text-[13px] text-[#444] dark:text-[#eee]">简体中文</span>
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {languageMap.map((item) => (
                    <DropdownMenuItem key={item.value} className="flex justify-between items-center" onClick={() => dispatch(setLanguage(item.value))}>
                      <span>{item.label}</span>
                      {item.value === appConfig.language && <Check style={{ width: '15px' }}/>}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>账户设置</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => dispatch(logout())}>
            退出登陆
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserInfo;
