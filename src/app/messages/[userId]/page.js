import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/getUser";
import { prisma } from "@/lib/prisma";
import ChatBox from "@/components/ChatBox";

export const dynamic = "force-dynamic";

export default async function ChatPage({ params }) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    const { userId } = await params;
    const otherUserId = Number(userId);

    if (otherUserId === currentUser.id) {
        redirect("/messages");
    }

    const otherUser = await prisma.user.findUnique({
        where: { id: otherUserId },
        select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
            role: true,
        },
    });

    if (!otherUser) {
        notFound();
    }

    return (
        <div className="container py-5">
            <div className="chat-page">
                {/* هدر چت */}
                <div className="chat-header">
                    <Link href="/messages" className="chat-back">
                        <i className="bi bi-arrow-right"></i>
                    </Link>

                    <Link href={`/users/${otherUser.id}`} className="chat-user-info">
                        <div className="chat-user-avatar">
                            {otherUser.avatar ? (
                                <img src={otherUser.avatar} alt={otherUser.name} />
                            ) : (
                                <i className="bi bi-person-fill"></i>
                            )}
                        </div>
                        <div>
                            <div className="chat-user-name">{otherUser.name}</div>
                            {otherUser.bio && (
                                <div className="chat-user-bio">{otherUser.bio}</div>
                            )}
                        </div>
                    </Link>
                </div>

                {/* چت */}
                <ChatBox
                    currentUserId={currentUser.id}
                    otherUser={otherUser}
                />
            </div>
        </div>
    );
}