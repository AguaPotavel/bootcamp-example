"use client";

import {
  useSuiClient,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useEffect, useMemo, useState } from "react";

export const useGalleryData = () => {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();
  const [galleryInfo, setGalleryInfo] = useState<any>(null);
  const client = useSuiClient();

  const getGalleryData: any = async () => {
    const gallery: any = await client.getObject({
      id: process.env.NEXT_PUBLIC_GALLERY_OBJECT_ID as string,
      options: {
        showContent: true,
        showOwner: true,
        showDisplay: true,
      },
    });

    const adminCap: any = await client.getObject({
      id: process.env.NEXT_PUBLIC_ADMIN_CAP_ID as string,
      options: {
        showOwner: true,
      },
    });

    setGalleryInfo({
      ...gallery.data.content.fields,
      owner: adminCap.data?.owner?.AddressOwner || false,
    });
  };

  const payTogetAccess = async () => {
    const tx = new Transaction();

    const payment = tx.splitCoins(tx.gas, [
      tx.pure.u64(BigInt(galleryInfo.fee)),
    ]);

    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_CONTRACT_ID}::access::payAccess`,
      arguments: [
        tx.object(process.env.NEXT_PUBLIC_GALLERY_OBJECT_ID as string),
        payment,
      ],
    });

    await signAndExecuteTransaction({ transaction: tx });
  };

  const collectFee = async () => {
    const tx = new Transaction();

    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_CONTRACT_ID}::admin::withdraw_balance`,
      arguments: [
        tx.object(process.env.NEXT_PUBLIC_GALLERY_OBJECT_ID as string),
        tx.object(process.env.NEXT_PUBLIC_ADMIN_CAP_ID as string),
        tx.pure.u64(BigInt(galleryInfo.balance)),
      ],
    });

    await signAndExecuteTransaction({ transaction: tx });
  };

  useEffect(() => {
    getGalleryData();
  }, [currentAccount]);

  const isOwner = useMemo(() => {
    if (!galleryInfo || !currentAccount) return false;
    return galleryInfo.owner === currentAccount?.address;
  }, [currentAccount, galleryInfo]);

  return {
    galleryInfo,
    isOwner,
    payTogetAccess,
    collectFee,
  };
};
