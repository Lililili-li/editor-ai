import userService from "@/api/user-service";
import { setUserInfo } from "@/store/features/userSlice";
import { Button } from "@components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/form";
import { Input } from "@components/input";
import { Spinner } from "@components/spinner";
import { Avatar, Upload } from "@douyinfe/semi-ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRequest } from "ahooks";
import { Camera, UploadCloud } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import z from "zod";

const Profile = () => {
  const useInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const FormSchema = z.object({
    username: z.string().min(2, {
      message: "用户名最少两个字符",
    }),
    avatar: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: useInfo?.username || "",
      avatar: useInfo?.avatar || "",
    },
  });

  const dispatch = useDispatch();
  const { loading, run: onSubmit } = useRequest(
    () => userService.updateUser(useInfo?.id, form.getValues()),
    {
      manual: true,
      onSuccess: (result) => {
        localStorage.setItem("userInfo", JSON.stringify(result));
        dispatch(setUserInfo(result));
        toast.success("更新成功");
      },
    }
  );

  const [url, setUrl] = useState(
    `${import.meta.env.VITE_FILE_SERVER_URL}/${useInfo?.avatar || ""}`
  );
  const onSuccess = (response: any) => {
    const { data } = response;
    toast.success("头像更新成功");
    form.setValue("avatar", data?.path || "");
    setUrl(`${import.meta.env.VITE_FILE_SERVER_URL}/${data?.path || ""}`);
  };

  const style = {
    backgroundColor: "var(--semi-color-overlay-bg)",
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--semi-color-white)",
  };

  const hoverMask = (
    <div style={style}>
      <Camera />
    </div>
  );

  const api = import.meta.env.VITE_UPLOAD_IMAGE_API;
  return (
    <div className="profile-container h-dvh p-5 pl-[20%]">
      <div className="font-bold text-[18px]">个人信息</div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[50%] space-y-6 mt-6"
        >
          <FormField
            control={form.control}
            name="username"
            render={() => (
              <FormItem className="mb-6">
                <FormLabel className="text-[#666] dark:text-gray-100 gap-0.5 text-[16px]">
                  头像
                </FormLabel>
                <FormControl>
                  <div className="flex gap-5">
                    <Upload
                      className="avatar-upload"
                      name="file"
                      action={api}
                      onSuccess={onSuccess}
                      accept="image/*"
                      showUploadList={false}
                      onError={() => toast.error("上传失败")}
                      limit={1}
                      maxSize={1024 * 10}
                      // draggable={true}
                    >
                      <Avatar
                        src={url}
                        style={{ margin: 4, width: "100px", height: "100px" }}
                        hoverMask={hoverMask}
                      />
                    </Upload>
                    <div className="upload-btn flex flex-col gap-2 pt-4">
                      <Upload
                        name="file"
                        action={api}
                        onSuccess={onSuccess}
                        accept="image/*"
                        showUploadList={false}
                        onError={() => toast.error("上传失败")}
                        limit={1}
                        maxSize={1024 * 10}
                      >
                        <Button type="button" className="p-0 h-7 px-2 py-1">
                          <UploadCloud />  
                          点击上传
                        </Button>
                      </Upload>
                      <div className="tip text-[#666] dark:text-gray-100 text-[13px]">
                        支持jpg/png/gif等图片格式，不超过10MB
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#666] dark:text-gray-100 gap-0.5 text-[16px]">
                  用户名<span className="text-red-500">*</span>{" "}
                </FormLabel>
                <FormControl>
                  <Input placeholder="请输入用户名" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="p-0 h-8 px-4">
            {loading && <Spinner />}
            更新信息
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Profile;
