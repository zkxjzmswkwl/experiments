import { ActionFunctionArgs, createCookie } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { selectUserByUsername } from "~/selectors/users.selectors";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  if (typeof username !== "string" || typeof password !== "string") {
    return new Response("Username and password are required", { status: 400 });
  }

  const user = await selectUserByUsername(username);
  if (!user || user.password !== password) {
    return new Response("Unable to login with the provided credentials", { status: 401 });
  }

  const cookie = createCookie("user", {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30
  });

  const headers = new Headers();
  headers.append("Set-Cookie", await cookie.serialize(user.id));

  return redirect("/");
};

export default function Login() {
  return (
    <div>
      <h1>Login</h1>
      <Form method="post">
        <input type="text" name="username" />
        <input type="password" name="password" />
        <button type="submit">Login</button>
      </Form>
    </div>
  );
}
