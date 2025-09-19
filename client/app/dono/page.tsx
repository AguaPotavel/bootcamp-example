"use client";

import { Button } from "@/components/ui/button";
import { WalrusUploader } from "@/components/walrus/walrusUploader";
import { useGalleryData } from "@/hooks/useGalleryData";
import { useCurrentAccount, ConnectButton } from "@mysten/dapp-kit";
import { useState } from "react";

export default function Owner() {
  const { galleryData } = useGalleryData();
  const [estado, setEstado] = useState(0);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-end items-center p-4 h-20">
        <ConnectButton />
      </div>

      <div className="flex gap-2">
        <Button>Coletar dinheiro</Button>
        <Button onClick={() => setEstado(2)}>Publicar imagem</Button>
      </div>

      {estado === 2 && <WalrusUploader />}
    </div>
  );
}
