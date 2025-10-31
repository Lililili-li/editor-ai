import { Spinner } from "./spinner";

const ServiceLoading = (props: any) => {
  return (
    <div
      className={`${
        props.className
          ? props.className
          : "h-full w-full bg-white/80 dark:bg-black/10 z-10 flex justify-center items-center "
      } `}
    >
      <Spinner className="size-8" />
    </div>
  );
};

export default ServiceLoading;
