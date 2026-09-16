-- CreateTable
CREATE TABLE "DictionaryEntry" (
    "id" SERIAL NOT NULL,
    "english" TEXT NOT NULL,
    "mandarin" TEXT NOT NULL,
    "fuzhounese" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "DictionaryEntry_pkey" PRIMARY KEY ("id")
);
