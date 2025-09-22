import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "@/app/dashboard/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("@/hooks/useData", () => ({
  useDashboardMetrics: jest.fn(),
  useChartData: jest.fn(),
}));

import { useDashboardMetrics, useChartData } from "@/hooks/useData";

const queryClient = new QueryClient();

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("Dashboard Metrics", () => {
  beforeEach(() => {
    (useDashboardMetrics as jest.Mock).mockReturnValue({
      data: {
        revenue: 5000,
        orders: 50,
        aov: 100,
        conversionRate: 0.1,
      },
      isLoading: false,
      isError: false,
    });

    (useChartData as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
  });

  it("renders metrics correctly", () => {
    render(<Dashboard />, { wrapper: Wrapper });

    expect(screen.getByText(/Выручка/i)).toBeInTheDocument();
    expect(screen.getByText("5 000 ₸")).toBeInTheDocument();
    expect(screen.getByText(/Заказы/i)).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });
});

it("updates filter select values", async () => {
  render(<Dashboard />, { wrapper: Wrapper });

  const periodSelect = screen.getByLabelText(/Выбор периода/i);
  await userEvent.selectOptions(periodSelect, "7d");

  expect(periodSelect).toHaveValue("7d");

  const channelSelect = screen.getByLabelText(/Фильтр по каналу/i);
  await userEvent.selectOptions(channelSelect, "Web");
  expect(channelSelect).toHaveValue("Web");

  const citySelect = screen.getByLabelText(/Фильтр по городу/i);
  await userEvent.selectOptions(citySelect, "Астана");
  expect(citySelect).toHaveValue("Астана");
});
