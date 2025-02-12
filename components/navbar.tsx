import React from "react";

export default function Navbar() {
  return (
    <div className="flex items-center gap-0.5 absolute left-0.5 top-0.5">
      <button className="button text-xs uppercase flex w-fit bg-gray-100 border border-gray-200 items-start gap-x-[2px] rounded-[0.375rem] pl-2.5 pr-10 py-2 pt-10">
        Unveil Projects
      </button>
      <button className="button text-xs uppercase flex w-fit bg-gray-100 border border-gray-200 items-start gap-x-[2px] rounded-[0.375rem] pl-2.5 pr-10 py-2 pt-10">
        Studio
      </button>
      <button className="button text-xs uppercase flex w-fit bg-gray-100 border border-gray-200 items-start gap-x-[2px] rounded-[0.375rem] pl-2.5 pr-10 py-2 pt-10">
        Contact
      </button>
    </div>
  );
}
