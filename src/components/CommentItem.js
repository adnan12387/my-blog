"use client";

export default function CommentItem({ comment, currentUser, onDelete }) {
    const canDelete =
        currentUser &&
        (currentUser.id === comment.userId || currentUser.role === "admin");

    const roleLabels = {
        admin: "مدیر",
        author: "نویسنده",
        user: "کاربر",
    };

    const roleBadgeColors = {
        admin: "linear-gradient(135deg, #7c5cff, #ff5c9d)",
        author: "linear-gradient(135deg, #00c9ff, #92fe9d)",
        user: "transparent",
    };

    const createdAt = new Date(comment.createdAt).toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="comment-item">
            <div className="comment-header">
                <div className="comment-user">
                    <div className="comment-avatar">
                        {comment.user.avatar ? (
                            <img src={comment.user.avatar} alt={comment.user.name} />
                        ) : (
                            <i className="bi bi-person-fill"></i>
                        )}
                    </div>
                    <div>
                        <div className="comment-user-name">
                            {comment.user.name}
                            {comment.user.role !== "user" && (
                                <span
                                    className="comment-role-badge"
                                    style={{ background: roleBadgeColors[comment.user.role] }}
                                >
                                    {roleLabels[comment.user.role]}
                                </span>
                            )}
                        </div>
                        <div className="comment-date">{createdAt}</div>
                    </div>
                </div>

                {canDelete && (
                    <button
                        onClick={() => onDelete(comment.id)}
                        className="comment-delete"
                        title="حذف"
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                )}
            </div>

            <p className="comment-content">{comment.content}</p>
        </div>
    );
}