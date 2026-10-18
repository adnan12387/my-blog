import { prisma } from "@/lib/prisma";
import RequestCard from "@/components/RequestCard";

export const dynamic = "force-dynamic";

export default async function AdminRequestsPage() {
    const requests = await prisma.authorRequest.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                    role: true,
                },
            },
        },
    });

    const pending = requests.filter((r) => r.status === "pending");
    const approved = requests.filter((r) => r.status === "approved");
    const rejected = requests.filter((r) => r.status === "rejected");

    return (
        <div>
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">درخواست‌های نویسندگی</h1>
                    <p className="admin-subtitle">
                        درخواست‌های کاربران برای نویسنده شدن رو اینجا مدیریت کن
                    </p>
                </div>
            </div>

            {/* آمار */}
            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: "linear-gradient(135deg, #f857a6, #ff5858)" }}>
                            <i className="bi bi-hourglass-split"></i>
                        </div>
                        <div>
                            <div className="stat-number">{pending.length}</div>
                            <div className="stat-label">در انتظار</div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: "linear-gradient(135deg, #00c9ff, #92fe9d)" }}>
                            <i className="bi bi-check-circle"></i>
                        </div>
                        <div>
                            <div className="stat-number">{approved.length}</div>
                            <div className="stat-label">تأیید شده</div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: "linear-gradient(135deg, #7c5cff, #ff5c9d)" }}>
                            <i className="bi bi-x-circle"></i>
                        </div>
                        <div>
                            <div className="stat-number">{rejected.length}</div>
                            <div className="stat-label">رد شده</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* لیست درخواست‌ها */}
            {requests.length === 0 ? (
                <div className="admin-empty">
                    <i className="bi bi-inbox"></i>
                    <h3>هیچ درخواستی نداری</h3>
                    <p>وقتی کاربری درخواست نویسندگی بده، اینجا نشون داده می‌شه.</p>
                </div>
            ) : (
                <div className="requests-list">
                    {requests.map((request) => (
                        <RequestCard key={request.id} request={request} />
                    ))}
                </div>
            )}
        </div>
    );
}