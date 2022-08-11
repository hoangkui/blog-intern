import React from "react";
type LayoutProps = {
  children: React.ReactNode;
  title: string;
};
const Layout = ({ children, title }: LayoutProps) => {
  return (
    <div className="h-screen flex bg-gray-bg1">
      <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16">
        <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
};

export default Layout;
