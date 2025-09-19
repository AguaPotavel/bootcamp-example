"use client";

import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { WalrusClient, WalrusFile } from "@mysten/walrus";
import {
  useSignAndExecuteTransaction,
  useCurrentAccount,
  useSuiClient,
} from "@mysten/dapp-kit";
import { useState } from "react";
import { Transaction } from "@mysten/sui/transactions";

const client = new SuiClient({
  url: getFullnodeUrl("testnet"),
  network: "testnet",
});

const walrusClient = new WalrusClient({
  network: "testnet",
  suiClient: client,
  uploadRelay: {
    host: "https://upload-relay.testnet.walrus.space",
    sendTip: {
      max: 1_000,
    },
  },
  wasmUrl:
    "https://unpkg.com/@mysten/walrus-wasm@latest/web/walrus_wasm_bg.wasm",
});

export function useWalrusUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();

  async function uploadFile() {
    if (!file) {
      return;
    }
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    if (!currentAccount) {
      throw "Current account not found";
    }

    setUploading(true);

    try {
      const files = [
        WalrusFile.from({
          contents: uint8Array,
          identifier: file.name,
          tags: {
            mimeType: file.type,
          },
        }),
      ];

      const flow = walrusClient.writeFilesFlow({
        files,
      });

      await flow.encode();

      const { digest } = await signAndExecuteTransaction({
        transaction: flow.register({
          deletable: true,
          epochs: 1,
          owner: currentAccount?.address,
        }),
      });

      await flow.upload({ digest });

      const { digest: digest2 } = await signAndExecuteTransaction({
        transaction: flow.certify(),
      });

      console.log(digest, digest2);

      const result = await flow.listFiles();

      await storeBlob(result[0].blobId);

      console.log(result);
    } catch (e) {
      console.log("error", e);
    } finally {
      setUploading(false);
    }
  }

  const storeBlob = async (blobId: string) => {
    const tx = new Transaction();

    tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_CONTRACT_ID}::admin::add_blob`,
      arguments: [
        tx.object(process.env.NEXT_PUBLIC_GALLERY_OBJECT_ID as string),
        tx.object(process.env.NEXT_PUBLIC_ADMIN_CAP_ID as string),
        tx.pure.string(blobId),
      ],
    });

    await signAndExecuteTransaction({ transaction: tx });
  };

  return { setFile, uploadFile, file, uploading };
}
