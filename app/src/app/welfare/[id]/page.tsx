"use client";

import React, {useEffect, useState} from "react";
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import IosShareIcon from '@mui/icons-material/IosShare';
import {SvgIcon} from "@mui/material";

const WelfarePage: React.FC = () => {

    useEffect(() => {
        // api로 받아오는 로직
    }, []);

    const [isScrap, setIsScrap] = useState(false)
    const [isLike, setIsLike] = useState(false)
    const scrapCount = 10
    const likeCount = 20

    const title: String = '에어컨 무료 설치'
    // 추후 내용에 따라 변수 추가
    const content: String = "경기도청이 중장년층 1인 가구를 대상으로 찾아가는 어쩌구를 시행합니다"

    return (
        <div className={"px-4"}>
            <div className={"py-[15px] text-[26px] font-medium"}>{title}</div>
            <div className={"min-h-[500px] py-[15px] border-y-[1px] border-brown1 font-medium text-[16px]"}>{content}</div>
            <div className={"flex items-end w-full justify-between py-4 px-6"}>
                <div className={"flex items-center"} onClick={() => {setIsLike(!isLike)}}>
                    <SvgIcon component={ isLike ? FavoriteIcon : FavoriteBorderOutlinedIcon } sx={{ width: '20px', height: '20px'}} className={"mr-[5px]"}/>
                    <div className={"mr-[5px]"}>{scrapCount}</div>
                    <div>좋아요</div>
                </div>
                <div className={"flex items-center"} onClick={() => {setIsScrap(!isScrap)}}>
                    <SvgIcon component={ isScrap ? BookmarkIcon : BookmarkBorderOutlinedIcon } sx={{ width: '20px', height: '20px'}} className={"mr-[5px]"}/>
                    <div className={"mr-[5px]"}>{likeCount}</div>
                    <div>스크랩</div>
                </div>
                <div className={"flex items-center"}>
                    <SvgIcon component={ IosShareIcon } sx={{ width: '20px', height: '20px'}} className={"mr-[5px]"}/>
                    <div>공유하기</div>
                </div>
            </div>
        </div>
    )
}

export default WelfarePage