import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // create new user with email "alice" and password "password"
  const newUser = await prisma.user.create({
    data: {
      email: "alice@localhost",
      password: "password",
    },
  });
  console.log(`Created new user: ${newUser.email} (ID: ${newUser.id})`);

  //   create new invite with invite "invite" and user "alice"

  const newInvite = await prisma.invite.create({
    data: {
      invite: "invite",
      CreatedBy: {
        connect: {
          id: newUser.id,
        },
      },
    },
  });

  console.log(newUser);
  console.log();
  console.log(newInvite);
}

main();
