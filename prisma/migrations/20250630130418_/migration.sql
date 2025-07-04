-- CreateTable
CREATE TABLE "board_user_access" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "boardId" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'editor',

    CONSTRAINT "board_user_access_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "board_user_access_userId_boardId_key" ON "board_user_access"("userId", "boardId");

-- AddForeignKey
ALTER TABLE "board_user_access" ADD CONSTRAINT "board_user_access_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board_user_access" ADD CONSTRAINT "board_user_access_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
