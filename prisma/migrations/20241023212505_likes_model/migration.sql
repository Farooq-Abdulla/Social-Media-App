-- CreateTable
CREATE TABLE "likes" (
    "userId" TEXT NOT NULL,
    "postID" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_postID_key" ON "likes"("userId", "postID");

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_postID_fkey" FOREIGN KEY ("postID") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
