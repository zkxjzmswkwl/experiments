import { PrismaClient } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { isUsernameAvailable } from "~/selectors/users.selectors";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const username = formData.get("username");
  if (typeof username !== "string") {
    return new Response("Username is required", { status: 400 });
  }
  const isAvailable = await isUsernameAvailable(username);

  if (!isAvailable) {
    return new Response("Username is already taken", { status: 400 });
  }

  const prisma = new PrismaClient();
  await prisma.user.create({
    data: { username, password: "password" }
  });
  await prisma.$disconnect();

  return redirect("/login");
};

export default function Register() {
  return (
    <div>
      <h1>Register</h1>
      <Form method="post">
        <input type="text" name="username" />
        <button type="submit">Register</button>
      </Form>
    </div>
  );
}
