"use client";

import React from "react";
import Link from "next/link";
import Image from 'next/image'
import logo from '@assets/drch_logo.png';

const Header: React.FC = () => {

    return (
        <div className="w-full h-[60px] justify-center flex items-center px-[20px] py-[15px] fixed bg-white z-1000">
            <Link href="/">
                <Image src={logo} alt="Home Button" width={55}/>
            </Link>
            {/*<div className="flex w-[80px] justify-between">
                <div>
                    <SvgIcon component={NotificationsOutlinedIcon} sx={{ fontSize: 35 }}/>
                    <label className="block text-center font-semibold">알림</label>
                </div>
                <div>
                    <SvgIcon component={SearchIcon} sx={{ fontSize: 35 }}/>
                    <label className="block text-center font-semibold">검색</label>
                </div>
            </div>*/}
        </div>
    )
}
export default Header;