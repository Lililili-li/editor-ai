import Sidebar from "@/layout/Sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@components/resizable";
import Content from "./Content";

export default function Home() {

  return (
    <section className="home-container w-dvw h-dvh">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={18} minSize={15} maxSize={30} className="min-w-[250px]">
          <Sidebar />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={82} minSize={70} maxSize={85}>
          <Content></Content>
        </ResizablePanel>
      </ResizablePanelGroup>
    </section>
  );
}
