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

export function useWalrusDownloader() {
  const currentAccount = useCurrentAccount();

  async function downloadFiles(blobId: string) {
    const blob = await walrusClient.getBlob({
      blobId: blobId,
    });

    const files = await blob.files();

    for (const file of files) {
      const bytes = await file.bytes();
      const name = await file.getIdentifier();
      const tags = await file.getTags();

      const downloadFilename = name || `blob-${blobId}`;
      const downloadMymeType = tags?.mimeType || "application/octet-stream";

      const blob2 = new Blob([bytes], { type: downloadMymeType });
      const url = URL.createObjectURL(blob2);

      const link = document.createElement("a");
      link.href = url;
      link.download = downloadFilename;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  return { downloadFiles };
}
