"use client";

import React from "react";
import Link from "next/link";
import {SvgIcon} from "@mui/material";
import Image from "next/image";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../../public/drch_logo.png";

const Header: React.FC = () => {
    return (
        <div className="w-full h-fit justify-between flex items-center px-[20px] py-[15px]">
            <Link href="/">
                {/* 기존처럼 width만 지정해도 OK (static import라 원본 비율 유지) */}
                <Image src={logo} alt="Home Button" width={55} priority/>
            </Link>
            <div className="flex w-[80px] justify-between">
                <div>
                    <SvgIcon component={NotificationsOutlinedIcon} sx={{fontSize: 35}}/>
                    <label className="block text-center font-semibold">알림</label>
                </div>
                <div>
                    <SvgIcon component={SearchIcon} sx={{fontSize: 35}}/>
                    <label className="block text-center font-semibold">검색</label>
                </div>
            </div>
        </div>
    );
};

export default Header;
