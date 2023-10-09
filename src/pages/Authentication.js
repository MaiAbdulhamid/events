import { json, redirect } from "react-router-dom";
import AuthForm from "../components/AuthForm";

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({ request }) {
  //Extract search query
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login";
  if (mode !== "login" && mode !== "signup") {
    throw json({ message: "Unsupported Path" }, { status: 422 });
  }
  //Extract user Data
  const data = await request.formData();
  const authData = {
    email: data.get("email"),
    password: data.get("password"),
  };

  //Send Request
  const response = await fetch("http://localhost:8080/" + mode, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  const resData = await response.json()
  const token = resData.token;

  //Validate Response
  if (response.status === 422 || response.status === 401) {
    return response;
  }
  if (!response.ok) {
    return json({ message: "Could not Authenticate User" }, { status: 500 });
  }

  localStorage.setItem('token', token);
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);
  localStorage.setItem('expire', expiration.toISOString())
  return redirect('/')
}
