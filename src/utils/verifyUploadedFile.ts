export function verifyUploadedFile(
  fileSizeKiloByte: number,
  fileSizeMegaByte: number,
  fileType: string,
  type: string
): boolean {
  if ((fileSizeKiloByte > 500 || fileSizeKiloByte < 0) && type !== "payment") {
    return false;
  }

  if ((fileSizeMegaByte > 2.0 || fileSizeMegaByte < 0) && type === "payment") {
    return false;
  }

  if (
    fileType !== "image/jpeg" &&
    fileType !== "image/png" &&
    fileType !== "application/pdf"
  ) {
    return false;
  }

  return true;
}
