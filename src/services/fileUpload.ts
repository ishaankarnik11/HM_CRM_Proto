// File Upload Service for MyHealthMeter CRM
// Supports multiple storage providers (S3, Azure Blob, Local, etc.)

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  metadata?: Record<string, any>;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadOptions {
  folder?: string;
  allowedTypes?: string[];
  maxSize?: number; // in bytes
  generateThumbnail?: boolean;
  metadata?: Record<string, any>;
}

export interface StorageProvider {
  upload(file: File, options?: UploadOptions): Promise<UploadedFile>;
  delete(fileId: string): Promise<void>;
  getDownloadUrl(fileId: string): Promise<string>;
  getFileInfo(fileId: string): Promise<UploadedFile>;
}

// Mock S3 Storage Provider
export class MockS3StorageProvider implements StorageProvider {
  private files: Map<string, UploadedFile> = new Map();

  async upload(file: File, options: UploadOptions = {}): Promise<UploadedFile> {
    // Validate file type
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`);
    }

    // Validate file size
    if (options.maxSize && file.size > options.maxSize) {
      throw new Error(`File size ${file.size} exceeds maximum allowed size ${options.maxSize}`);
    }

    // Simulate upload progress
    await this.simulateUploadProgress(file.size);

    const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const uploadedFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file), // Mock URL - in production, this would be the S3 URL
      uploadedAt: new Date().toISOString(),
      metadata: {
        ...options.metadata,
        folder: options.folder || 'dc-bills',
        originalName: file.name
      }
    };

    this.files.set(fileId, uploadedFile);
    return uploadedFile;
  }

  async delete(fileId: string): Promise<void> {
    if (!this.files.has(fileId)) {
      throw new Error(`File ${fileId} not found`);
    }
    this.files.delete(fileId);
  }

  async getDownloadUrl(fileId: string): Promise<string> {
    const file = this.files.get(fileId);
    if (!file) {
      throw new Error(`File ${fileId} not found`);
    }
    return file.url;
  }

  async getFileInfo(fileId: string): Promise<UploadedFile> {
    const file = this.files.get(fileId);
    if (!file) {
      throw new Error(`File ${fileId} not found`);
    }
    return file;
  }

  private async simulateUploadProgress(fileSize: number): Promise<void> {
    const chunks = Math.ceil(fileSize / 1024); // 1KB chunks
    for (let i = 0; i <= chunks; i++) {
      await new Promise(resolve => setTimeout(resolve, 10)); // Simulate upload time
      const progress: UploadProgress = {
        loaded: Math.min(i * 1024, fileSize),
        total: fileSize,
        percentage: Math.min((i * 1024 / fileSize) * 100, 100)
      };
      // In real implementation, you would emit progress events here
    }
  }
}

// AWS S3 Storage Provider (for production use)
export class AWSS3StorageProvider implements StorageProvider {
  private region: string;
  private bucket: string;
  private accessKey: string;
  private secretKey: string;

  constructor(config: {
    region: string;
    bucket: string;
    accessKey: string;
    secretKey: string;
  }) {
    this.region = config.region;
    this.bucket = config.bucket;
    this.accessKey = config.accessKey;
    this.secretKey = config.secretKey;
  }

  async upload(file: File, options: UploadOptions = {}): Promise<UploadedFile> {
    // Note: This is a template implementation
    // In production, you would use the AWS SDK
    
    const key = `${options.folder || 'uploads'}/${Date.now()}-${file.name}`;
    
    // AWS S3 upload logic would go here
    // const s3 = new AWS.S3({
    //   region: this.region,
    //   accessKeyId: this.accessKey,
    //   secretAccessKey: this.secretKey
    // });
    
    // const uploadParams = {
    //   Bucket: this.bucket,
    //   Key: key,
    //   Body: file,
    //   ContentType: file.type,
    //   Metadata: options.metadata || {}
    // };
    
    // const result = await s3.upload(uploadParams).promise();
    
    // Mock implementation for now
    const uploadedFile: UploadedFile = {
      id: key,
      name: file.name,
      size: file.size,
      type: file.type,
      url: `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`,
      uploadedAt: new Date().toISOString(),
      metadata: options.metadata
    };

    return uploadedFile;
  }

  async delete(fileId: string): Promise<void> {
    // AWS S3 delete logic
    // const s3 = new AWS.S3({...});
    // await s3.deleteObject({ Bucket: this.bucket, Key: fileId }).promise();
    throw new Error('Method not implemented in mock');
  }

  async getDownloadUrl(fileId: string): Promise<string> {
    // AWS S3 signed URL generation
    // const s3 = new AWS.S3({...});
    // return s3.getSignedUrl('getObject', { Bucket: this.bucket, Key: fileId, Expires: 3600 });
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${fileId}`;
  }

  async getFileInfo(fileId: string): Promise<UploadedFile> {
    // AWS S3 head object
    // const s3 = new AWS.S3({...});
    // const result = await s3.headObject({ Bucket: this.bucket, Key: fileId }).promise();
    throw new Error('Method not implemented in mock');
  }
}

// File Upload Service
export class FileUploadService {
  private provider: StorageProvider;
  private defaultOptions: UploadOptions;

  constructor(provider: StorageProvider, defaultOptions: UploadOptions = {}) {
    this.provider = provider;
    this.defaultOptions = {
      maxSize: 10 * 1024 * 1024, // 10MB default
      allowedTypes: [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ],
      ...defaultOptions
    };
  }

  async uploadFile(file: File, options: UploadOptions = {}): Promise<UploadedFile> {
    const mergedOptions = { ...this.defaultOptions, ...options };
    
    try {
      return await this.provider.upload(file, mergedOptions);
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }

  async uploadMultipleFiles(files: File[], options: UploadOptions = {}): Promise<UploadedFile[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, options));
    return Promise.all(uploadPromises);
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.provider.delete(fileId);
    } catch (error) {
      console.error('File deletion failed:', error);
      throw error;
    }
  }

  async getDownloadUrl(fileId: string): Promise<string> {
    try {
      return await this.provider.getDownloadUrl(fileId);
    } catch (error) {
      console.error('Failed to get download URL:', error);
      throw error;
    }
  }

  async getFileInfo(fileId: string): Promise<UploadedFile> {
    try {
      return await this.provider.getFileInfo(fileId);
    } catch (error) {
      console.error('Failed to get file info:', error);
      throw error;
    }
  }

  // Utility methods
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  validateFile(file: File, options: UploadOptions = {}): { valid: boolean; error?: string } {
    const mergedOptions = { ...this.defaultOptions, ...options };

    // Check file type
    if (mergedOptions.allowedTypes && !mergedOptions.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${mergedOptions.allowedTypes.join(', ')}`
      };
    }

    // Check file size
    if (mergedOptions.maxSize && file.size > mergedOptions.maxSize) {
      return {
        valid: false,
        error: `File size ${this.formatFileSize(file.size)} exceeds maximum allowed size ${this.formatFileSize(mergedOptions.maxSize)}`
      };
    }

    return { valid: true };
  }

  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  getFileTypeIcon(fileType: string): string {
    const iconMap: Record<string, string> = {
      'application/pdf': '📄',
      'image/jpeg': '🖼️',
      'image/png': '🖼️',
      'image/gif': '🖼️',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
      'application/vnd.ms-excel': '📊',
      'text/csv': '📊',
      'application/msword': '📝',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝'
    };

    return iconMap[fileType] || '📁';
  }
}

// Configuration for different environments
export const createFileUploadService = (environment: 'development' | 'production' = 'development'): FileUploadService => {
  let provider: StorageProvider;

  if (environment === 'production') {
    // Production S3 configuration
    provider = new AWSS3StorageProvider({
      region: process.env.AWS_REGION || 'us-east-1',
      bucket: process.env.AWS_S3_BUCKET || 'myhealthmeter-files',
      accessKey: process.env.AWS_ACCESS_KEY_ID || '',
      secretKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    });
  } else {
    // Development mock provider
    provider = new MockS3StorageProvider();
  }

  return new FileUploadService(provider, {
    folder: 'dc-bills',
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ]
  });
};

// Export singleton instance
export const fileUploadService = createFileUploadService(
  process.env.NODE_ENV === 'production' ? 'production' : 'development'
);