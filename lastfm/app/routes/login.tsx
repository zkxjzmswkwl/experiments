import { PrismaClient } from "@prisma/client";
import { ActionFunctionArgs, createCookie } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { NeuButton } from "~/components/ui/neubutton";
import { selectUserByUsername } from "~/selectors/users.selectors";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  if (typeof username !== "string" || typeof password !== "string") {
    return new Response("Username and password are required", { status: 400 });
  }

  let user = await selectUserByUsername(username, new PrismaClient());
  if (!user || user.password !== password) {
    return new Response("Unable to login with the provided credentials", { status: 401 });
  }

  let cookie = createCookie("user", {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30
  });

  let headers = new Headers();
  headers.append("Set-Cookie", await cookie.serialize(user.id));
  return redirect("/");
};

export default function Login() {
  return (
    <div className="w-1/2 mx-auto mt-8">
      <Form method="post" className="flex flex-col">
        <label htmlFor="username">Username</label>
        <input type="text" name="username" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" />
        <NeuButton type="submit" text="login" />
      </Form>
    </div>
  );
}
