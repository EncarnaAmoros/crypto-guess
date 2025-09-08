import { useState, useEffect } from "react";
import { MOBILE_BREAKPOINT } from "~/modules/Layout/constants/responsive";
import useGeneralLayoutStore from "~/modules/Layout/hooks/useGeneralLayoutStore";

const useGeneralLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const setIsMobile = useGeneralLayoutStore((state) => state.setIsMobile);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        setIsMobileSidebarOpen(false);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return {
    isMobileSidebarOpen,
    toggleMobileSidebar,
    closeMobileSidebar,
  };
};

export default useGeneralLayout;
