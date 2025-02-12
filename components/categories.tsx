import React from "react";

export default function Categories() {
  return (
    <div className="flex flex-col gap-0.5 items-end absolute bottom-0.5 right-0.5">
      <button className="button uppercase flex items-start gap-x-[3px] rounded-full px-4 py-3 bg-gray-100 border border-gray-200 text-xs">
        <span className="translate-y-[1px]">All</span>
        <small className="text-8 mt-[0px]">144</small>
      </button>
      <button className="button uppercase flex items-start gap-x-[3px] rounded-full px-4 py-3 bg-gray-100 border border-gray-200 text-xs">
        <span className="translate-y-[1px]">Graphic Identity</span>
        <small className="text-8 mt-[0px]">43</small>
      </button>
      <button className="button uppercase flex items-start gap-x-[3px] rounded-full px-4 py-3 bg-gray-100 border border-gray-200 text-xs">
        <span className="translate-y-[1px]">Site design</span>
        <small className="text-8 mt-[0px]">25</small>
      </button>
      <button className="button uppercase flex items-start gap-x-[3px] rounded-full px-4 py-3 bg-gray-100 border border-gray-200 text-xs">
        <span className="translate-y-[1px]">AI</span>
        <small className="text-8 mt-[0px]">61</small>
      </button>
      <button className="button uppercase flex items-start gap-x-[3px] rounded-full px-4 py-3 bg-gray-100 border border-gray-200 text-xs">
        <span className="translate-y-[1px]">Video</span>
        <small className="text-8 mt-[0px]">14</small>
      </button>
      <button className="button uppercase flex items-start gap-x-[3px] rounded-full px-4 py-3 bg-gray-100 border border-gray-200 text-xs">
        <span className="translate-y-[1px]">3D</span>
        <small className="text-8 mt-[0px]">17</small>
      </button>
    </div>
  );
}
