"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/ui-button";
import { Input } from "@/components/ui/input";
import { signUp, signIn } from "@/lib/auth";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { refreshProfile } = useAuth();
  const toast = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    if (mode === "register") {
      if (!formData.name) {
        newErrors.name = "Nome é obrigatório";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "As senhas não coincidem";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const loadingToast = toast.loading("Fazendo login...");

    try {
      const result = await signIn(formData.email, formData.password);

      if (result.success) {
        toast.dismiss(loadingToast);
        toast.success("Login realizado com sucesso!");
        await refreshProfile();
        onClose();
        // Reset form
        setFormData({ email: "", password: "", name: "", confirmPassword: "" });
        setErrors({});
      } else {
        toast.dismiss(loadingToast);
        toast.error(result.error || "Erro ao fazer login");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Erro inesperado. Tente novamente.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const loadingToast = toast.loading("Criando conta...");

    try {
      const result = await signUp(
        formData.email,
        formData.password,
        formData.name
      );

      if (result.success) {
        toast.dismiss(loadingToast);
        toast.success("Conta criada com sucesso! Bem-vindo ao ISPmedia!");
        await refreshProfile();
        onClose();
        // Reset form
        setFormData({ email: "", password: "", name: "", confirmPassword: "" });
        setErrors({});
      } else {
        toast.dismiss(loadingToast);
        toast.error(result.error || "Erro ao criar conta");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Erro inesperado. Tente novamente.");
      console.error("Register error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Entrar no ISPmedia"
      size="md"
    >
      <div className="space-y-6">
        {" "}
        {/* Mode Toggle */}
        <div className="flex bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all cursor-hover ${
              mode === "login"
                ? "bg-primary-500 text-gray-900 shadow-md"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all cursor-hover ${
              mode === "register"
                ? "bg-primary-500 text-gray-900 shadow-md"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            Cadastrar
          </button>
        </div>{" "}
        {/* Login Form */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                className={
                  errors.email ? "border-red-500 focus:ring-red-500" : ""
                }
                required
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder="Senha"
                value={formData.password}
                onChange={(e) => updateFormData("password", e.target.value)}
                className={
                  errors.password ? "border-red-500 focus:ring-red-500" : ""
                }
                required
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full cursor-hover"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        )}{" "}
        {/* Register Form */}
        {mode === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Nome completo"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                className={
                  errors.name ? "border-red-500 focus:ring-red-500" : ""
                }
                required
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                className={
                  errors.email ? "border-red-500 focus:ring-red-500" : ""
                }
                required
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder="Senha"
                value={formData.password}
                onChange={(e) => updateFormData("password", e.target.value)}
                className={
                  errors.password ? "border-red-500 focus:ring-red-500" : ""
                }
                required
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder="Confirmar senha"
                value={formData.confirmPassword}
                onChange={(e) =>
                  updateFormData("confirmPassword", e.target.value)
                }
                className={
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full cursor-hover"
              disabled={isLoading}
            >
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>
        )}
        {/* Social Login */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-center text-white/60 text-sm mb-4">
            Ou continue com
          </p>{" "}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              disabled={isLoading}
              className="cursor-hover"
            >
              Google
            </Button>
            <Button
              variant="outline"
              disabled={isLoading}
              className="cursor-hover"
            >
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
