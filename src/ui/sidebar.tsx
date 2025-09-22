"use client";

import * as React from "react";
import { PanelLeft, X } from "lucide-react";

interface SidebarContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(
  undefined
);

export function SidebarProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [open, setOpen] = React.useState(false);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function SidebarTrigger() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("SidebarTrigger must be used within a SidebarProvider");
  }

  return (
    <button
      onClick={() => context.setOpen(!context.open)}
      className="p-2 hover:bg-gray-100 rounded-md"
    >
      {context.open ? (
        <X className="h-4 w-4" />
      ) : (
        <PanelLeft className="h-4 w-4" />
      )}
    </button>
  );
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("Sidebar must be used within a SidebarProvider");
  }

  return (
    <div
      className={`fixed left-0 top-0 z-50 h-screen w-64 
                bg-gray-50 dark:bg-gray-900 
                border-r border-gray-200 dark:border-gray-700 
                transition-all duration-300 
                ${context.open ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Mobile close button */}
      <div className="flex justify-end p-4 md:hidden">
        <button
          onClick={() => context.setOpen(false)}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {children}
    </div>
  );
}

export function SidebarInset({ children }: { children: React.ReactNode }) {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("SidebarInset must be used within a SidebarProvider");
  }

  return (
    <main
      className={`flex-1 overflow-auto transition-all duration-300 ${
        context.open ? "ml-0 md:ml-64" : "ml-0"
      }`}
    >
      {children}
    </main>
  );
}
