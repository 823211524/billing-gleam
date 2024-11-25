-- AlterTable
ALTER TABLE "Reading" ADD COLUMN "imageLocation" JSONB,
ADD COLUMN "ocrConfidence" DOUBLE PRECISION,
ADD COLUMN "manualInput" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "validationErrors" TEXT[];

-- CreateIndex
CREATE INDEX "Reading_year_month_idx" ON "Reading"("year", "month");
CREATE INDEX "Reading_validated_idx" ON "Reading"("validated");
CREATE INDEX "Bill_paid_idx" ON "Bill"("paid");
CREATE INDEX "User_isEnabled_idx" ON "User"("isEnabled");