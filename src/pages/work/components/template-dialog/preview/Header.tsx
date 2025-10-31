import { Button } from "@components/button";
import { ChevronLeftCircle, XIcon } from "lucide-react";
import { memo, type FC } from "react";
import type { TemplateProps } from "../TemplateDialog";

interface HeaderProps {
  setDialogVisible: (visible: boolean) => void;
  onFallback: () => void;
  template: TemplateProps
}

const Header: FC<HeaderProps> = memo(({ setDialogVisible, onFallback, template }) => {
  return <div className="header flex justify-between px-4 py-2 items-center h-[70px] dark:bg-[#27272a]">
    <div className="header-left flex items-center gap-2">
      <Button variant='ghost' onClick={onFallback} className="py-0 px-1 h-[30px]">
        <ChevronLeftCircle style={{ width: '20px' }}/>
      </Button>
      <div className="name text-[22px] text-gray-600 font-bold h-[30px] dark:text-gray-100" style={{ fontFamily: 'kx', lineHeight: '30px' }}>
        { template.title }
      </div>
    </div>
    <div className="header-right">
      <Button variant='ghost' onClick={onFallback} className="py-0 px-1 h-[30px]">
        <XIcon style={{ width: '20px' }}/>
      </Button>
    </div>
  </div>;
});

export default Header;
