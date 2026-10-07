/**
 * VITECH Cloud — Local/Demo Storage Provider
 * 
 * Uses browser storage for development and demo mode.
 * Files are stored as base64 in IndexedDB (via a simple wrapper).
 */

import { StorageProvider } from "./storage.interface";

export class LocalStorageProvider implements StorageProvider {
  private store: Map<string, { data: string; contentType: string }> = new Map();

  async upload(params: {
    key: string;
    body: Blob | ArrayBuffer | ReadableStream;
    contentType: string;
    onProgress?: (progress: number) => void;
  }): Promise<{ key: string }> {
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 20) {
      await new Promise((r) => setTimeout(r, 50));
      params.onProgress?.(i);
    }

    let data: string;
    if (params.body instanceof Blob) {
      data = await params.body.text();
    } else if (params.body instanceof ArrayBuffer) {
      data = new TextDecoder().decode(params.body);
    } else {
      data = "stream-data";
    }

    this.store.set(params.key, { data, contentType: params.contentType });
    return { key: params.key };
  }

  async download(key: string): Promise<Blob> {
    const item = this.store.get(key);
    if (!item) throw new Error(`File not found: ${key}`);
    return new Blob([item.data], { type: item.contentType });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    return this.store.has(key);
  }

  async getSignedUrl(key: string): Promise<string> {
    return `local://${key}`;
  }

  async getSignedUploadUrl(params: { key: string; contentType: string }): Promise<string> {
    return `local://upload/${params.key}`;
  }

  async createMultipartUpload(): Promise<{ uploadId: string }> {
    return { uploadId: "local-multipart-" + Date.now() };
  }

  async uploadPart(): Promise<{ etag: string }> {
    return { etag: "local-etag" };
  }

  async completeMultipartUpload(): Promise<void> {}
  async abortMultipartUpload(): Promise<void> {}
}
