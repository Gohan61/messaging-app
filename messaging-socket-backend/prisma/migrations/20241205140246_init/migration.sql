-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(30) NOT NULL,
    "last_name" VARCHAR(30) NOT NULL,
    "username" TEXT NOT NULL,
    "password" VARCHAR(80) NOT NULL,
    "bio" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "sid" VARCHAR(30) NOT NULL,
    "recipients" TEXT NOT NULL,
    "date" VARCHAR(50) NOT NULL
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "ownerUsername" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "timestamp" VARCHAR(30) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_sid_key" ON "Chat"("sid");

-- CreateIndex
CREATE UNIQUE INDEX "Message_id_key" ON "Message"("id");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_recipients_fkey" FOREIGN KEY ("recipients") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_ownerUsername_fkey" FOREIGN KEY ("ownerUsername") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("sid") ON DELETE RESTRICT ON UPDATE CASCADE;
