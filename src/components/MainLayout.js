export default function MainLayout({ children, sidebar }) {
    return (
      <div className="container py-5">
        <div className="layout-with-sidebar">
          <div className="layout-main">{children}</div>
          {sidebar}
        </div>
      </div>
    );
  }