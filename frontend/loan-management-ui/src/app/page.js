import LoanDashboard from "@/components/loans/LoanDashboard";
import RequireAuth from "@/components/auth/RequireAuth";

export const metadata = {
  title: "Loan applications | LoanFlow",
};

export default function HomePage() {
  return (
    <RequireAuth>
      <LoanDashboard />
    </RequireAuth>
  );
}
