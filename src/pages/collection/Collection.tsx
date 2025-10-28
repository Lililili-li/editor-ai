import { ListFilter, Search } from "lucide-react";
import { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@components/input-group";

const Collection = () => {
  const [searchInputVisible, setSearchInputVisible] = useState(false);
  return (
    <section className="home-container h-dvh p-5">
      <div className="flex justify-between">
        <div className="font-bold text-[18px]">我的收藏</div>
        <div className="flex gap-2 items-center">
          <div className="flex relative items-center">
            <Search
              onClick={() => setSearchInputVisible(true)}
              className={`${
                searchInputVisible
                  ? "opacity-0"
                  : "transition-all duration-300 w-[18px]"
              } cursor-pointer`}
            ></Search>
            <InputGroup
              className={`${
                searchInputVisible
                  ? "w-[200px]"
                  : "w-0 border-0 [&_.search-icon]:hidden opacity-0"
              } transition-all duration-300 h-[32px] rounded-[6px]`}
              
            >
              <InputGroupInput
                placeholder="请输入"
                onBlur={() => setSearchInputVisible(false)}
                style={{ padding: searchInputVisible?'': '0px' }}
                className={`${
                  searchInputVisible
                    ? ""
                    : "p-0"
                }`}
              />
              <InputGroupAddon className="search-icon">
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <ListFilter style={{ width: '18px' }} className="cursor-pointer"></ListFilter>
        </div>
      </div>
    </section>
  );
};

export default Collection;
