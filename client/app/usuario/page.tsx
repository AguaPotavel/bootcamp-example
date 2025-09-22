"use client";

import { Button } from "@/components/ui/button";
import { useGalleryData } from "@/hooks/useGalleryData";
import { useWalrusDownloader } from "@/hooks/useWalrusDownloader";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { useMemo } from "react";

export default function Home() {
  const { galleryInfo, payTogetAccess } = useGalleryData();
  const { downloadFiles } = useWalrusDownloader();
  const currentAccount = useCurrentAccount();

  const hasAccess = useMemo(() => {
    if (!galleryInfo || !currentAccount) return false;

    return galleryInfo.addresses.includes(currentAccount.address);
  }, [galleryInfo]);

  return (
    <div className="flex flex-col h-screen w-full items-center">
      <div className="w-full flex justify-end items-center p-4 h-20">
        <ConnectButton />
      </div>

      <div className="w-40 h-40">
        <Button onClick={payTogetAccess}>Pagar para ter acesso</Button>
      </div>

      {hasAccess && galleryInfo.blobs && (
        <div className="flex flex-row gap-2 flex-wrap">
          {galleryInfo.blobs.map((blob: any) => {
            return (
              <div className="w-fit flex flex-col gap-2 h-20">
                <span>{blob}</span>
                <Button onClick={() => downloadFiles(blob)}>
                  Download Blob
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
