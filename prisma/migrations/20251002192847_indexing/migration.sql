/*
  Warnings:

  - A unique constraint covering the columns `[s3Key]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[s3ThumbKey]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `s3ThumbKey` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `s3ThumbUrl` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Image" ADD COLUMN     "s3ThumbKey" TEXT NOT NULL,
ADD COLUMN     "s3ThumbUrl" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Image_s3Key_key" ON "public"."Image"("s3Key");

-- CreateIndex
CREATE UNIQUE INDEX "Image_s3ThumbKey_key" ON "public"."Image"("s3ThumbKey");

-- CreateIndex
CREATE INDEX "Image_filename_idx" ON "public"."Image"("filename");

-- CreateIndex
CREATE INDEX "Image_status_idx" ON "public"."Image"("status");
