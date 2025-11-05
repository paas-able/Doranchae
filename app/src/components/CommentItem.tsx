import React, {useState} from "react";

interface AuthorDetail {
    name: string,
    userId: string
}

interface Comment {
    id: string,
    author: AuthorDetail,
    content: string,
    createdAt: string,
    isAuthor: boolean,
    parentId: string | null
}

type NestedComment = Comment & {
    replies: NestedComment[];
};

interface CommentItemProps {
    comment: NestedComment;
    depth: number;
    activeReplyId?: string | null;
    setActiveReplyId?: (id: string | null) => void;
    submitHandler?: (content: string, parentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({comment, depth, activeReplyId, setActiveReplyId, submitHandler}) => {
    const [reply, setReply] = useState("")
    // [!!] marginClass는 JSX에서 ${} 안에 사용되므로 const로 유지합니다.
    const marginClass = depth > 0 ? `ml-${depth * 6}` : ''; 

    const isReplyActive = activeReplyId === comment.id;
    const isTopLevel = depth === 0;
    
    const handleReplyClick = (commentId: string) => { 
        if (setActiveReplyId) {
            setActiveReplyId(isReplyActive ? null : commentId)
        }
    }

    const handleReplySubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        if (submitHandler) {
            submitHandler(reply, comment.id)
            setReply("")
        }
    }

    return (
        <li key={comment.id} className={`${marginClass}`}>
            <div className={`border-b-brown1 border-b`} style={{ paddingLeft: `${depth * 20}px` }}>
                <div className={"flex justify-between mt-2.5 items-center"}>
                    <div className={"flex items-center"}>
                        <div
                            className={"rounded-full"}
                            style={{width: 36, height: 36, backgroundColor: "#E6E6E6"}}
                        />
                        <p className={"text-[15px] font-medium mx-2"}>{comment.author.name}</p>
                        <p className={"text-xs"}>{comment.createdAt.split('T')[0]}</p>
                    </div>
                </div>
                <div className={"my-2.5 text-[16px] font-medium"}>{comment.content}</div>
                { isTopLevel ?
                    <button
                        className={"text-[14px] font-medium mt-2 mb-2.5"}
                        onClick={() => handleReplyClick(comment.id)}
                    >
                        {isReplyActive ? '답글 취소' : '답글 달기'}
                    </button> :
                    <></>
                }
                {isReplyActive && isTopLevel && (
                    <form onSubmit={handleReplySubmit} className="mb-3">
                        <div
                            className="flex items-center justify-between rounded-full pl-4 pr-2"
                            style={{
                                backgroundColor: "#FDFAE3",
                                border: "1px solid #CED5B2",
                            }}
                        >
                            <input
                                type="text"
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                placeholder="댓글 입력하기"
                                className="flex-1 bg-transparent outline-none text-[15px] mr-3"
                            />
                            <button
                                type="submit"
                                disabled={!reply.trim()}
                                className="px-3 py-2 text-sm font-semibold disabled:opacity-50"
                                style={{
                                    color: reply.trim() ? "#8B9744" : "#B3B3B3",
                                }}
                            >
                                ➤
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {comment.replies.length > 0 && (
                <ul>
                    {comment.replies.map(reply => (
                        <CommentItem 
                            key={reply.id} 
                            comment={reply} 
                            depth={depth + 1} 
                            // [!!] null 대신 undefined를 사용하여 Prop 생략
                            activeReplyId={undefined} 
                            setActiveReplyId={undefined} 
                            submitHandler={undefined}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default CommentItem
