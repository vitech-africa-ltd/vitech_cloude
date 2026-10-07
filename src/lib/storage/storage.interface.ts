/**
 * VITECH Cloud — Storage Provider Interface
 * 
 * This abstraction allows swapping storage backends (R2, local, MinIO, etc.)
 * without changing the application code.
 */

export interface StorageProvider {
  /**
   * Upload a file to storage
   */
  upload(params: {
    key: string;
    body: Blob | ArrayBuffer | ReadableStream;
    contentType: string;
    onProgress?: (progress: number) => void;
  }): Promise<{ key: string; etag?: string }>;

  /**
   * Download a file from storage
   */
  download(key: string): Promise<Blob>;

  /**
   * Delete a file from storage
   */
  delete(key: string): Promise<void>;

  /**
   * Check if a file exists in storage
   */
  exists(key: string): Promise<boolean>;

  /**
   * Get a signed URL for temporary access
   */
  getSignedUrl(key: string, expiresInSeconds?: number): Promise<string>;

  /**
   * Get a signed URL for uploading
   */
  getSignedUploadUrl(params: {
    key: string;
    contentType: string;
    expiresInSeconds?: number;
  }): Promise<string>;

  /**
   * Initiate a multipart upload for large files
   */
  createMultipartUpload(params: {
    key: string;
    contentType: string;
  }): Promise<{ uploadId: string }>;

  /**
   * Upload a part of a multipart upload
   */
  uploadPart(params: {
    key: string;
    uploadId: string;
    partNumber: number;
    body: Blob | ArrayBuffer;
  }): Promise<{ etag: string }>;

  /**
   * Complete a multipart upload
   */
  completeMultipartUpload(params: {
    key: string;
    uploadId: string;
    parts: { partNumber: number; etag: string }[];
  }): Promise<void>;

  /**
   * Abort a multipart upload
   */
  abortMultipartUpload(params: {
    key: string;
    uploadId: string;
  }): Promise<void>;
}

export interface StorageConfig {
  provider: "r2" | "local" | "supabase";
  bucket?: string;
  endpoint?: string;
  accountId?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  region?: string;
}
