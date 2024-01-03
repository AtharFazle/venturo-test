import React from "react";
import { MdFreeBreakfast } from "react-icons/md";
import Sidebar from "../Sidebar";


async function getVouchers () {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/vouchers`;
  const response = await fetch(url);

  if(!response.ok){
    throw new Error("failed to fetch vouchers");
  }

  return response.json();
}

const Header =async () => {
  const vouchers = await getVouchers();
  return (
    <div className="flex justify-between w-full">
      <div className="flex flex-row items-center gap-2 font-bold text-primary text-2xl">
        <MdFreeBreakfast className="text-4xl" />
        <h1>Main Course</h1>
      </div>
      <Sidebar vouchers={vouchers}/>
    </div>
  );
};

export default Header;
