import PostForm from "@/components/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">پست جدید</h1>
          <p className="admin-subtitle">یه پست جدید بنویس و منتشر کن</p>
        </div>
      </div>

      <PostForm />
    </div>
  );
}