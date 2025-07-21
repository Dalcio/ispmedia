"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Header, Layout } from "@/components/layout";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card } from "@/components/ui";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Layout>
        {user ? (
          <div className="space-y-6">
            <Card>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to ISPMedia
              </h1>
              <p className="text-gray-600">You are signed in as {user.email}</p>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Getting Started
              </h2>
              <ul className="space-y-2 text-gray-600">
                <li>• Your Firebase authentication is working</li>
                <li>• Express server routes are ready at /server/routes</li>
                <li>• Reusable UI components are in /components/ui</li>
                <li>• Add your features in dedicated component folders</li>
              </ul>
            </Card>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <LoginForm />
          </div>
        )}
      </Layout>
    </div>
  );
}
