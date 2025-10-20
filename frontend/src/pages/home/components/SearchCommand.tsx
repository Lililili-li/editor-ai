import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useImperativeHandle, useState, type FC, type ForwardedRef } from "react";
const SearchCommand:FC<{ ref: ForwardedRef<{ openModal: () => void }> }> = ({ref}) => {
  const [visible, setVisible] = useState(false)
  const openModal = () => {
    setVisible(true)
  }
  useImperativeHandle(ref, () => {
    return {
      openModal
    }
  })

  return (
    <CommandDialog open={visible} onOpenChange={setVisible}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem>
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
      </CommandList>
    </CommandDialog>
  );
}

export default SearchCommand;
