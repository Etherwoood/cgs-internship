-- AlterTable
ALTER TABLE "products" ADD COLUMN     "description" TEXT,
ADD COLUMN     "in_stock" INTEGER NOT NULL DEFAULT 0;
