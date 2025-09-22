import OrdersPage from "@/app/orders/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

const queryClient = new QueryClient();

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("Orders Table", () => {
  it("allows search input", async () => {
    render(
      <Wrapper>
        <OrdersPage />
      </Wrapper>
    );

    const searchInput = screen.getByPlaceholderText(
      /Поиск по Order ID или имени клиента/i
    );

    await userEvent.type(searchInput, "test");

    expect(searchInput).toHaveValue("test");
  });
});
