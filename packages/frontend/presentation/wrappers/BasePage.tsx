import { PropsWithChildren } from "react";
import PageWrapper from "./PageWrapper";

const BasePage: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <PageWrapper>{children}</PageWrapper>
    </>
  );
};

export default BasePage;
