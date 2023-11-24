import { Container } from "nhsuk-react-components";
import React, { PropsWithChildren } from "react";

const PageWrapper: React.FC<PropsWithChildren> = ({ children }) => (
  <main className="nhsuk-main-wrapper">
    <Container style={{ minHeight: 400, minWidth: "55vw" }}>
      {children}
    </Container>
  </main>
);

export default PageWrapper;
