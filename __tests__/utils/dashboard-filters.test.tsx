import Dashboard from "@/app/dashboard/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const queryClient = new QueryClient();

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("Dashboard Filters", () => {
  it("updates chart/table when filters are applied", async () => {
    render(
      <Wrapper>
        <Dashboard />
      </Wrapper>
    );

    const periodSelect = screen.getByLabelText(/Выбор периода/i);
    await userEvent.selectOptions(periodSelect, "7d");

    expect(periodSelect).toHaveValue("7d");

    const revenueCard = await screen.findByText(/Выручка/i);
    expect(revenueCard).toBeInTheDocument();
  });
});
