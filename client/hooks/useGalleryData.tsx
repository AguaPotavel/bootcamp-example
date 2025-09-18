"use client";

import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect } from "react";

export const useGalleryData = () => {
  const currentAccount = useCurrentAccount();
  const client = useSuiClient();

  const galleryData = async () => {
    const gallery: any = await client.getObject({
      id: "0xc8fd6fcb325ae9628ef42e57ed4673b55c60283887885a0be14ff0113237ef52",
      options: {
        showContent: true,
        showOwner: true,
      },
    });

    return { ...gallery.data.content.fields };
  };

  return {
    galleryData,
  };
};
