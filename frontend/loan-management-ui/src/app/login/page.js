import AuthForm from "../../components/AuthForm";

export const metadata = {
  title: "Sign in | LoanFlow",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
