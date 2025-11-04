"use client";

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {fetchWithAuth} from "@libs/fetchWithAuth";
import CommentItem from "@components/CommentItem";

interface PostDetailPageProps {
    params: {
        id: string;
    };
}

interface PostDetail {
    title: string,
    content: string,
    createdAt: string,
    likes: number,
    isEdited: boolean
}

interface AuthorDetail {
    name: string,
    userId: string,
    isMe: boolean
}

interface Post {
    post: PostDetail,
    author: AuthorDetail,
    isLiked: boolean
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

export default function CommunityDetailPage({ params }: PostDetailPageProps) {
    const router = useRouter();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0)
    const [comment, setComment] = useState("")
    const [comments, setComments] = useState<NestedComment[]>([])
    const [createdDate, setCreatedDate] = useState("")
    const [activeReplyId, setActiveReplyId] = useState<string | null>(null)
    const postId = params.id

    const [post, setPost] = useState<Post>()

    const fetchComments = async () => {
        fetchWithAuth(`/api/community/comments/${postId}/list`)
            .then(res => {
                if (res.isSuccess) {
                    return res.data
                }
            })
            .then(data => {
                setComments(nestComments(data.comments))
            })
    }

    useEffect(() => {
        const fetchPost = async () => {
            fetchWithAuth(`/api/community/posts/${postId}`)
                .then(res => {
                    if (res.isSuccess) {
                        return res.data
                    }
                })
                .then(data => {
                    console.log("본인? : " + data.author.isMe)
                    setLiked(!data.isLiked)
                    setLikeCount(data.post.likes)
                    setPost(data)
                    setCreatedDate(data.post.createdAt.split('T')[0])
                })
        }

        fetchPost()
        fetchComments()
    }, []);

    const toggleLike = () => {
        console.log(liked)
        if (!liked) { // 좋아요 누르기
            fetchWithAuth(`/api/community/posts/${postId}/like`, {
                method: "POST"
            }).then(res => {
                if (res.isSuccess) {
                    setLiked(!liked)
                    setLikeCount(prevState => prevState + 1)
                }
            })
        } else {
            fetchWithAuth(`/api/community/posts/${postId}/like`, {
                method: "DELETE"
            }).then(res => {
                if (res.isSuccess) {
                    setLiked(!liked)
                    setLikeCount(prevState => prevState - 1)
                }
            })
        }
    };

    const submitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;
        fetchWithAuth(`/api/community/comments/${postId}`, {
            method: "POST",
            body: JSON.stringify({ content: comment, parentId: null })
        }).then(res => {
            if (res.isSuccess) {
                alert("댓글 작성을 완료했습니다.")
                setComment("");
                fetchComments()
            }
        })
    };

    const submitReply = (content: string, parentId: string) => {
        fetchWithAuth(`/api/community/comments/${postId}`, {
            method: 'POST',
            body: JSON.stringify({ content: content, parentId: parentId })
        })
            .then(res => {
                if (res.isSuccess) {
                    alert("대댓글 작성을 완료했습니다.")
                }
            })
    }

    const nestComments = (flatComments: Comment[]): NestedComment[] => {
        const rootComments: NestedComment[] = [];
        const commentMap = new Map<string, NestedComment>();

        flatComments.reverse().forEach(comment => {
            const nestedComment: NestedComment = { ...comment, replies: [] };
            commentMap.set(comment.id, nestedComment);
        });

        commentMap.forEach(comment => {
            if (comment.parentId === null) {
                rootComments.push(comment);
            } else {
                const parent = commentMap.get(comment.parentId);
                if (parent) {
                    parent.replies.push(comment);
                }
            }
        });

        return rootComments;
    }

    const deletePostHandler = () => {
        fetchWithAuth(`/api/community/post/${postId}`, {
            method: "DELETE"
        }).then(res => {
            if (res.isSuccess) {
                alert("글이 성공적으로 삭제되었습니다.")
                router.push("/community")
            }
        })
    }

    return (
        <div className="mx-auto w-full max-w-[430px] flex flex-col flex-1 min-h-[calc(100vh-130px)]">
            {/* 본문 */}
            <main className="flex-1 px-4">
                <section className="mt-4 flex flex-col">
                    {/* 뒤로가기 */}
                    <div className="mb-3">
                        <button
                            type="button"
                            onClick={() => router.push('/community')}
                            className="text-sm"
                            style={{color: "#808080"}}
                        >
                            뒤로가기
                        </button>
                    </div>

                    {/* 작성자 */}
                    <div
                        className="mt-4 flex items-center justify-between pb-4"
                        style={{borderColor: "#CCA57A"}}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="rounded-full"
                                style={{width: 36, height: 36, backgroundColor: "#E6E6E6"}}
                            />
                            <div>
                                <div className="text-[15px] font-medium">{post?.author.name}</div>
                                <div className="text-xs" style={{color: "#808080"}}>
                                    {createdDate}
                                </div>
                            </div>
                        </div>
                        <div className="flex text-sm" style={{color: "#808080"}}>
                            { post?.author.isMe ? <button onClick={deletePostHandler}>삭제하기</button> : <></> }
                        </div>
                    </div>

                    {/* 제목/본문 */}
                    <div>
                        <h1 className="text-[20px] font-bold leading-snug">{post?.post.title}</h1>
                        <p className="mt-3 text-[15px] leading-7">{post?.post.content}</p>
                    </div>

                    {/* 좋아요 영역 */}
                    <div
                        className="mt-1 flex items-center gap-4 px-1 py-3 border-b"
                        style={{borderColor: "#CCA57A"}}
                    >
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                aria-label="좋아요"
                                onClick={toggleLike}
                                className={`inline-flex items-center justify-center rounded-full `}
                                style={{
                                    width: 24,
                                    height: 24,
                                    border: "1px solid #CCCCCC",
                                    backgroundColor: liked ? "#EAEDCC" : "#FFFFFF",
                                }}
                            >
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/11881/11881363.png"
                                    alt="like"
                                    className="w-3.5 h-3.5"
                                />
                            </button>
                            <span className="text-sm">{likeCount}</span>
                        </div>
                        <button
                            type="button"
                            onClick={toggleLike}
                            className="text-sm"
                            style={{color: "#666666"}}
                        >
                            { liked ? "좋아요 취소하기" : "좋아요 누르기" }
                        </button>
                    </div>

                    {/* 댓글 */}
                    <ul className="scroll-auto">
                        {comments.map((c) => (
                            <CommentItem
                                key={c.id}
                                comment={c}
                                depth={0}
                                activeReplyId={activeReplyId}
                                setActiveReplyId={setActiveReplyId}
                                submitHandler={submitReply}
                            />
                        ))}
                    </ul>

                    {/* 댓글 입력 */}
                    <form onSubmit={submitComment} className="sticky bottom-[80px] pt-2">
                        <div
                            className="flex items-center justify-between rounded-full pl-4 pr-2 py-3 shadow"
                            style={{
                                backgroundColor: "#FDFAE3",
                                border: "1px solid #CED5B2",
                            }}
                        >
                            <input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="댓글 입력하기"
                                className="flex-1 bg-transparent outline-none text-[15px] mr-3"
                            />
                            <button
                                type="submit"
                                disabled={!comment.trim()}
                                className="px-3 py-2 text-sm font-semibold disabled:opacity-50"
                                style={{
                                    color: comment.trim() ? "#8B9744" : "#B3B3B3",
                                }}
                            >
                                ➤
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}
