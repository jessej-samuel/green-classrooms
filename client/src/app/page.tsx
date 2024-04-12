"use client";
import React, { useEffect } from "react";
import LastWeekConsumption from "@/components/LastWeekConsumption";

const Home = () => {
  return (
    <>
      <nav className="mb-6 py-6 px-3 bg-green-400">
        <h1 className="text-4xl font-bold text-green-800">Green Classrooms</h1>
        <div className="flex items-baseline gap-4 ">
          <sub className="text-green-800 text-base font-normal">Dashboard</sub>
          <hr className="h-px border-none bg-green-800 w-full rounded-full" />
        </div>
      </nav>
      <main className="mx-12 grid grid-cols-9 grid-rows-6 max-h-screen">
        <div className="col-span-3 row-span-3 border rounded border-neutral-700 bg-neutral-800">
          <LastWeekConsumption />
        </div>
      </main>
    </>
  );
};

export default Home;
