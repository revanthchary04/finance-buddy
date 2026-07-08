"use client";

import { useState, useEffect } from "react";

export function RefreshWrapper({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode;
  fallback: React.ReactNode;
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const handleRefreshChange = (e: any) => {
      if (e.detail !== undefined) {
        setIsRefreshing(e.detail);
      }
    };
    
    window.addEventListener("refreshStateChange", handleRefreshChange);
    return () => window.removeEventListener("refreshStateChange", handleRefreshChange);
  }, []);

  if (isRefreshing) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
