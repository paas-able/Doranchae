"use client";

import React from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {SvgIcon} from "@mui/material";
import InfoOutlineRoundedIcon from '@mui/icons-material/InfoOutlineRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import EmailIcon from '@mui/icons-material/Email';
import ArticleIcon from '@mui/icons-material/Article';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Image from 'next/image'
import ieumi from '../../public/ieumi.png'

const BottomNav: React.FC = () => {
    const pathname = usePathname()

    return (
        <div className="fixed bottom-0 w-full h-fit">
            <nav className="flex bottom-0 w-full h-[70px] bg-green2 items-center z-10 justify-between px-[20px] text-gray1">
                {/*왼쪽 아이콘 묶음*/}
                <div className="flex justify-between w-[125px]">
                    <Link href="/welfare" className="flex flex-col items-center">
                        <SvgIcon className="" component={ pathname.includes('/welfare') ? InfoRoundedIcon : InfoOutlineRoundedIcon} sx={{ fontSize: 30 }}/>
                        <label className="block font-semibold">복지 정보</label>
                    </Link>
                    <Link href="/penpal" className="flex flex-col items-center">
                        <SvgIcon className="" component={ pathname.includes('/penpal') ? EmailIcon : EmailOutlinedIcon } sx={{ fontSize: 30 }}/>
                        <label className="block font-semibold">펜팔</label>
                    </Link>
                </div>

                {/*가운데 아이콘*/}
                <Link href="/ieumi" className="bg-brown2 border-2 border-green1 w-[80px] h-[80px] rounded-full mb-8 flex justify-center items-center">
                    <Image src={ieumi} alt="AI Chat Button" width={45} height={60}/>
                </Link>

                {/*오른쪽 아이콘 묶음*/}
                <div className="flex justify-between w-[125px]">
                    <Link href="/community" className="flex flex-col items-center">
                        <SvgIcon className="" component={ pathname.includes('/community') ? ArticleIcon : ArticleOutlinedIcon} sx={{ fontSize: 30 }}/>
                        <label className="block font-semibold">커뮤니티</label>
                    </Link>
                    <Link href="/mypage" className="flex flex-col items-center">
                        <SvgIcon className="" component={ pathname.includes('/mypage') ? AccountCircleIcon : AccountCircleOutlinedIcon } sx={{ fontSize: 30 }}/>
                        <label className="block font-semibold">내 정보</label>
                    </Link>
                </div>
            </nav>
        </div>
    )
}
export default BottomNav;
