import { PrismaClient } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { NeuButton } from "~/components/ui/neubutton";
import { doesUserExist } from "~/selectors/users.selectors";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const username = formData.get("username");
  if (typeof username !== "string") {
    return new Response("Username is required", { status: 400 });
  }

  const prisma = new PrismaClient();
  const isAvailable = await doesUserExist(username, prisma);

  if (!isAvailable) {
    return new Response("Username is already taken", { status: 400 });
  }

  await prisma.user.create({
    data: { username, password: "password" }
  });
  await prisma.$disconnect();

  return redirect("/login");
};

export default function Register() {
  return (
    <div className="w-1/2 mx-auto mt-8">
      <Form method="post" className="flex flex-col">
        <label htmlFor="username">Username</label>
        <input type="text" name="username" />
        <NeuButton type="submit" text="Register"/>
      </Form>
    </div>
  );
}
