"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "ui/components/ui/select";

type SelectFieldProps = {
  data: {
    id: number;
    name: string;
  }[];
  label: string;
  name: string;
  placeholder: string;
  disabled?: boolean;
  defaultValue?: string;
};

export function SelectField({
  data,
  label,
  name,
  placeholder,
  disabled = false,
  defaultValue,
}: SelectFieldProps) {
  return (
    <Select name={name} disabled={disabled} defaultValue={defaultValue}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {data.map((item) => (
            <SelectItem value={`${item.id}-${item.name}`} key={item.id}>
              {item.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
