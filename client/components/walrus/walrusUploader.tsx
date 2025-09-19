"use client";
import { useWalrusUpload } from "@/hooks/useWalrusUpload";
import { Loader2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function WalrusUploader() {
  const { file, uploadFile, setFile, uploading } = useWalrusUpload();

  return (
    <div className="flex flex-col my-4 w-full justify-center max-w-[500px]">
      <div className="flex flex-col">
        <Label>Subir arquivo</Label>
        <Input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <Button onClick={() => uploadFile()} disabled={!file || uploading}>
        {uploading ? (
          <span className="flex gap-1">
            <Loader2Icon className="animate-spin" />
            Enviando
          </span>
        ) : (
          "Enviar"
        )}
      </Button>
    </div>
  );
}
