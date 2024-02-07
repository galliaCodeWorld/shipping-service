-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productHandle" TEXT NOT NULL,
    "productVariantId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ltl" BOOLEAN NOT NULL DEFAULT false,
    "shipperZip" TEXT NOT NULL,
    "recipientZip" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "large" TEXT NOT NULL,
    "width" TEXT NOT NULL,
    "height" TEXT NOT NULL,
    "secure" BOOLEAN NOT NULL DEFAULT false,
    "secureValue" INTEGER NOT NULL DEFAULT 0,
    "pickup" BOOLEAN NOT NULL DEFAULT false,
    "international" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT NOT NULL,
    "shipperCountry" TEXT NOT NULL,
    "shipperState" TEXT NOT NULL,
    "shipperCity" TEXT NOT NULL,
    "recipientCountry" TEXT NOT NULL,
    "recipientState" TEXT NOT NULL,
    "recipientCity" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "_OrderToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_OrderToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_OrderToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrderToProduct_AB_unique" ON "_OrderToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderToProduct_B_index" ON "_OrderToProduct"("B");
