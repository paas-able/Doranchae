"use client";

import React from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {SvgIcon} from "@mui/material";
import Image from 'next/image'
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SearchIcon from '@mui/icons-material/Search';
import logo from '@assets/drch_logo.png';

const Header: React.FC = () => {
    // const { pathname } = useRouter()

    return (
        <div className="w-full h-fit justify-between flex items-center px-[20px] py-[15px]">
            <Link href="/">
                <Image src={logo} alt="Home Button" width={55}/>
            </Link>
            <div className="flex w-[80px] justify-between">
                <div>
                    <SvgIcon component={NotificationsOutlinedIcon} sx={{ fontSize: 35 }}/>
                    <label className="block text-center font-semibold">알림</label>
                </div>
                <div>
                    <SvgIcon component={SearchIcon} sx={{ fontSize: 35 }}/>
                    <label className="block text-center font-semibold">검색</label>
                </div>
            </div>
        </div>
    )
}
export default Header;