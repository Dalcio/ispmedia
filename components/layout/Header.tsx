"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">ISPMedia</h1>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700">{user.email}</span>
                <Button onClick={logout} variant="outline" size="sm">
                  Sign Out
                </Button>
              </>
            ) : (
              <Button size="sm">Sign In</Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
