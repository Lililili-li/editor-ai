import { Spinner } from "./spinner"

const ServiceLoading = (props: any) => {
  return (
    <div className={`h-full w-full bg-white/80 z-10 flex justify-center items-center ${props.className}`}>
      <Spinner className="size-8"/>
    </div>
  )
}

export default ServiceLoading