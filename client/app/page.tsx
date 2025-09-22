"use client";

import { Button } from "@/components/ui/button";
import { useGalleryData } from "@/hooks/useGalleryData";
import { ConnectButton } from "@mysten/dapp-kit";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { isOwner } = useGalleryData();

  const handleOwnerLogin = () => {
    router.push("/dono");
  };

  const handleUserLogin = () => {
    router.push("/usuario");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-end items-center p-4 h-20">
        <ConnectButton />
      </div>

      <div className="flex gap-2">
        {isOwner && (
          <Button onClick={handleOwnerLogin}>Entrar como dono</Button>
        )}
        <Button onClick={handleUserLogin}>Entrar como usuário</Button>
      </div>
    </div>
  );
}
