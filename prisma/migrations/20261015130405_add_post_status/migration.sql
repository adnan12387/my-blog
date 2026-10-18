-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL DEFAULT 'ناشناس',
    "date" TEXT NOT NULL,
    "readTime" TEXT NOT NULL DEFAULT '۳ دقیقه',
    "tag" TEXT NOT NULL DEFAULT 'bi-file-text',
    "status" TEXT NOT NULL DEFAULT 'published',
    "aiScore" INTEGER,
    "aiReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" INTEGER,
    "categoryId" INTEGER,
    CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Post_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("author", "authorId", "categoryId", "content", "createdAt", "date", "excerpt", "id", "readTime", "tag", "title") SELECT "author", "authorId", "categoryId", "content", "createdAt", "date", "excerpt", "id", "readTime", "tag", "title" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
