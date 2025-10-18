"use client";

import React from 'react';
import WelfareElement from "@components/WelfareElement";

const WelfarePage = () => {
    return (
        <div className="flex h-full flex-col justify-center overflow-clip">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
                복지 정보 페이지
            </h1>
            <div className={'h-full overflow-scroll'}>
                <WelfareElement id={1} title={'title'} region={'region'} image={'url'} date={'2025-12-13'} tag={'tag'} likes={13} isScrap={false}/>
                <WelfareElement id={1} title={'title'} region={'region'} image={'url'} date={'2025-12-13'} tag={'tag'} likes={13} isScrap={true}/>
                <WelfareElement id={1} title={'title'} region={'region'} image={'url'} date={'2025-12-13'} tag={'tag'} likes={13} isScrap={true}/>
                <WelfareElement id={1} title={'title'} region={'region'} image={'url'} date={'2025-12-13'} tag={'tag'} likes={13} isScrap={true}/>
                <WelfareElement id={1} title={'title'} region={'region'} image={'url'} date={'2025-12-13'} tag={'tag'} likes={13} isScrap={true}/>
                <WelfareElement id={1} title={'title'} region={'region'} image={'url'} date={'2025-12-13'} tag={'tag'} likes={13} isScrap={true}/>
                <WelfareElement id={1} title={'title'} region={'region'} image={'url'} date={'2025-12-13'} tag={'tag'} likes={13} isScrap={true}/>
            </div>
        </div>
    );
};

export default WelfarePage;