import React, { PropsWithChildren } from "react";

const PageWrapper: React.FC<PropsWithChildren> = ({ children }) => (
  <main className="container mx-auto">
    <div className="py-4">{children}</div>
  </main>
);

export default PageWrapper;
