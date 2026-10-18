import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getUser";
import ConversationsList from "@/components/ConversationsList";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    return (
        <div className="container py-5">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">پیام‌ها</h1>
                    <p className="admin-subtitle">مکالماتت رو اینجا ببین</p>
                </div>
            </div>

            <ConversationsList currentUserId={currentUser.id} />
        </div>
    );
}