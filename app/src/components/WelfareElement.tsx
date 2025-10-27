import React from "react";
import {SvgIcon} from "@mui/material";
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import Link from "next/link";

type WelfareProps = {
    id: number
    title: string
    region: string
    date: string
    tag:string
    likes: number
    isScrap: boolean
}

const WelfareElement: React.FC<WelfareProps> = ({id, title, region, date, tag, likes, isScrap}): React.JSX.Element => {
    return (
        <Link href={`/welfare/${id}`} className="h-[120px] w-full border-b-[0.5px] border-gray7 px-[5px] py-4 flex">
            <div className="flex justify-between w-full">
                <div className={'justify-between flex flex-col ml-3'}> {/*제목, 지역, 날짜, 분야*/}
                    <div>
                        <label className={'text-2xl font-semibold text-gray1 block'}>{title}</label>
                        <label className={'text-gray1'}>{region + ' | ' + date}</label>
                    </div>
                    <label className={'text-gray3'}>{'#' + tag}</label>
                </div>
                <div className={'justify-between flex flex-col items-end'}> {/*스크랩여부, 좋아요*/}
                    <SvgIcon component={ isScrap ? BookmarkIcon : BookmarkBorderOutlinedIcon } sx={{ width: '28px', height: '28px'}}/>
                    <div className={'flex items-center'}>
                        <SvgIcon component={FavoriteBorderOutlinedIcon} />
                        <label className={'font-medium text-lg ml-[1px]'}>{likes}</label>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default WelfareElement