"use client";

import { Button } from "@/components/ui/button";
import { useGalleryData } from "@/hooks/useGalleryData";
import { useCurrentAccount, ConnectButton } from "@mysten/dapp-kit";

export default function Owner() {
  const currentAccount = useCurrentAccount();
  const { galleryData } = useGalleryData();

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-end items-center p-4 h-20">
        <ConnectButton />
      </div>

      <Button>Coletar dinheiro</Button>
      <Button>Publicar imagem</Button>
    </div>
  );
}
