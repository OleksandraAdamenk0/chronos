"use client";

import { HexColorPicker } from "react-colorful";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

type Props = {
  value: string;
  onChange: (color: string) => void;
};

export default function ColorPicker({ value, onChange }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
    <button
      className="w-8 h-8 rounded-sm mb-3 border cursor-pointer"
  style={{ backgroundColor: value }}
  />
  </PopoverTrigger>

  <PopoverContent className="p-3 w-auto">
  <HexColorPicker color={value} onChange={onChange} />
  </PopoverContent>
  </Popover>
);
}
