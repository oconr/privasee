"use client";

import { useState } from "react";
import { LuTrash } from "react-icons/lu";
import { Button } from "ui/components/ui/button";
import { Input } from "ui/components/ui/input";

type Property = {
  key: string;
  value: string;
};

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);

  function addNew() {
    setProperties([...properties, { key: "", value: "" }]);
  }

  function remove(index: number) {
    setProperties(properties.filter((_, i) => i !== index));
  }

  function updateKey(index: number, value: string) {
    setProperties(
      properties.map((p, i) => (i === index ? { ...p, key: value } : p))
    );
  }

  function updateValue(index: number, value: string) {
    setProperties(
      properties.map((p, i) => (i === index ? { ...p, value } : p))
    );
  }

  return (
    <div className="w-100 flex flex-col gap-2">
      <div className="w-100 flex flex-row justify-between items-center gap-2">
        <p className="text-md font-semibold text-slate-600">Properties</p>
        <Button variant="secondary" onClick={addNew} className="h-7">
          Add new
        </Button>
      </div>
      <input
        type="text"
        name="properties"
        value={properties.map((p) => `${p.key}:${p.value}`).join(",")}
        className="hidden"
      />
      {properties.map((p, i) => (
        <div className="flex flex-row gap-2" key={i}>
          <Input
            placeholder="Key"
            defaultValue={p.key}
            onChange={(e) => updateKey(i, e.target.value)}
          />
          <Input
            placeholder="Value"
            defaultValue={p.value}
            onChange={(e) => updateValue(i, e.target.value)}
          />
          <Button variant="destructive" onClick={() => remove(i)}>
            <LuTrash />
          </Button>
        </div>
      ))}
      {properties.length === 0 && (
        <p className="w-100 text-center bg-slate-50 py-1 rounded-lg text-sm font-medium">
          No properties are set
        </p>
      )}
    </div>
  );
}
