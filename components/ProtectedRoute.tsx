'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getData } from "@/utils/api";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getData("/auth/profile");
        setIsAuth(true);
      } catch (error) {
        setIsAuth(false);
        router.push("/signIn");
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) return null;

  return <>{children}</>;
}