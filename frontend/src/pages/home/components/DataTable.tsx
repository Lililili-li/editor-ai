import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronDown,
  Ellipsis,
  Grid2X2,
  HeartPlus,
  Link,
  Share2,
  Trash2,
} from "lucide-react";
import { memo, useState, type FC } from "react";
import StaticIcon from "../../../components/icon/StaticIcon";
import documentIcon from "../images/document.svg";

enum TypeEnum {
  ALL = "1",
  DOC = "2",
  TABLE = "3",
}

enum BelongEnum {
  ALL = "1",
  MY = "2",
}

enum TimeEnum {
  ALL = "1",
  WEEK = "2",
  MONTH = "3",
}
type DocumentProp = {
  type: string;
  belong: string;
  time: string;
  id: number;
};
type DataTableProps = {
  documents: DocumentProp[];
};

const Column = memo(({ document }: { document: DocumentProp }) => {
  const columns = [
    {
      type: "custom",
      props: {
        className: "flex items-center gap-2",
      },
      render: (
        <>
          <img src={documentIcon} alt="" className="w-[18px]" />
          <div className="flex items-center gap-1">
            <span>{document.type}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <StaticIcon
                  className="static text-gray-500 cursor-pointer opacity-0"
                  style={{ width: "16px" }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>置顶</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </>
      ),
    },
    {
      field: "belong",
    },
    {
      field: "time",
    },
    {
      type: "custom",
      props: {
        className: "text-right",
      },
      render: (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 p-0 px-1 rounded-[4px]">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <Share2 style={{ width: "16px" }} />
                分享
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Link style={{ width: "16px" }} />
                复制链接
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <HeartPlus style={{ width: "16px" }} />
                收藏
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <StaticIcon style={{ width: "16px" }} />
                添加到置顶
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <Trash2 style={{ width: "16px" }} className="text-red-500" />
                <span className="text-red-500">删除</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <TableRow>
      {columns.map((item, index) => {
        if (item.type === "custom") {
          return (
            <TableCell key={index} {...item.props}>
              {item.render}
            </TableCell>
          );
        } else {
          return (
            <TableCell key={index}>
              {document[item.field as keyof DocumentProp]}
            </TableCell>
          );
        }
      })}
    </TableRow>
  );
});

const DataTable: FC<DataTableProps> = ({ documents }) => {
  const [filterState, setFilterState] = useState({
    type: "1",
    belong: "1",
    time: "2",
  });

  return (
    <div className="relative">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1">
                    <span>
                      {filterState.type === TypeEnum.ALL
                        ? "全部类型"
                        : filterState.type === TypeEnum.DOC
                        ? "文档"
                        : "表格"}
                    </span>
                    <ChevronDown size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuRadioGroup
                    value={filterState.type}
                    onValueChange={(type: string) =>
                      setFilterState((prev) => ({ ...prev, type }))
                    }
                  >
                    <DropdownMenuRadioItem value={TypeEnum.ALL}>
                      全部类型
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={TypeEnum.DOC}>
                      文档
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={TypeEnum.TABLE}>
                      表格
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableHead>
            <TableHead>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 outline-0">
                    <span>
                      {filterState.belong === BelongEnum.ALL
                        ? "不限归属"
                        : "我的文档"}
                    </span>
                    <ChevronDown size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuRadioGroup
                    value={filterState.belong}
                    onValueChange={(belong: string) =>
                      setFilterState((prev) => ({ ...prev, belong }))
                    }
                  >
                    <DropdownMenuRadioItem value={BelongEnum.ALL}>
                      不限归属
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={BelongEnum.MY}>
                      我的文档
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableHead>
            <TableHead>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 outline-0">
                    <span>
                      {filterState.time === TimeEnum.ALL
                        ? "不限时间"
                        : filterState.time === TimeEnum.WEEK
                        ? "最近一周"
                        : "最近一月"}
                    </span>
                    <ChevronDown size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuRadioGroup
                    value={filterState.time}
                    onValueChange={(time: string) =>
                      setFilterState((prev) => ({ ...prev, time }))
                    }
                  >
                    <DropdownMenuRadioItem value={TimeEnum.ALL}>
                      不限时间
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={TimeEnum.WEEK}>
                      最近一周
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={TimeEnum.MONTH}>
                      最近一月
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="hover:[&_.static]:opacity-100">
          {documents.map((document) => (
            <Column document={document} key={document.id}/>
          ))}
        </TableBody>
      </Table>
      <div className="switch absolute right-0 top-2 pr-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" className="h-6 p-0 px-1 rounded-[4px]">
              <Grid2X2 style={{ width: "16px" }} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>切换表格视图</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default DataTable;
