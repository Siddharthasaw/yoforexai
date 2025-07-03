'use client';


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getData } from "@/utils/api";
import Loading from "./Loading";

export default function ProtectedRoute({
  children,
  type = "protected"
}: {
  children: React.ReactNode;
  type?: "protected" | "public";
}) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getData("/auth/profile");
        setIsAuth(true);

        if (type === "public") {
          router.replace("/");
        }
      } catch {
        setIsAuth(false);
        if (type === "protected") {
          router.replace("/signIn");
        }
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) return <Loading />;

  if ((type === "protected" && !isAuth) || (type === "public" && isAuth)) return null;

  return <>{children}</>;
}