import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import mimeType from "mime-types";

interface UploadFileProps {
  bucketName: string;
  body: any;
  fileName: string;
  contentType?: string;
}

interface DeleteFileProps {
  bucketName: string;
  key: string;
}

interface S3ServiceOpts {
  cloudfrontDomain: string;
}

class S3Service {
  private opts: S3ServiceOpts;

  constructor(
    private readonly s3Client: S3Client,
    opts: S3ServiceOpts,
  ) {
    this.opts = opts;
  }

  async uploadFile(input: UploadFileProps) {
    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: input.bucketName,
        Key: input.fileName,
        Body: input.body,
        ContentType:
          input.contentType ||
          mimeType.lookup(input.fileName) ||
          "application/octet-stream",
      },
    });

    await upload.done();

    return `${this.opts.cloudfrontDomain}/${input.fileName}`;
  }

  async deleteFile(input: DeleteFileProps) {
    const delCommand = new DeleteObjectCommand({
      Bucket: input.bucketName,
      Key: input.key,
    });

    await this.s3Client.send(delCommand);
  }
}

export default S3Service;
