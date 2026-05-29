-- AlterTable
ALTER TABLE "Rule" ALTER COLUMN "volume" DROP NOT NULL;

-- CreateTable
CREATE TABLE "UserProduct" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "productSlug" VARCHAR NOT NULL,
    "productName" VARCHAR NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "UserProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InteractiveMapping" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userProductId" UUID NOT NULL,
    "functionName" VARCHAR NOT NULL,
    "label" VARCHAR,
    "giftId" INTEGER,

    CONSTRAINT "InteractiveMapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProduct_userId_productSlug_key" ON "UserProduct"("userId", "productSlug");

-- CreateIndex
CREATE UNIQUE INDEX "InteractiveMapping_userProductId_functionName_key" ON "InteractiveMapping"("userProductId", "functionName");

-- AddForeignKey
ALTER TABLE "UserProduct" ADD CONSTRAINT "UserProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteractiveMapping" ADD CONSTRAINT "InteractiveMapping_userProductId_fkey" FOREIGN KEY ("userProductId") REFERENCES "UserProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
