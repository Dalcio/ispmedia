"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Modal isOpen={true} onClose={() => {}}>
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="p-8"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">
            {isLogin ? "Entrar" : "Criar Conta"}
          </h2>

          <form className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                placeholder="Nome completo"
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#FDC500]/50 outline-none"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#FDC500]/50 outline-none"
            />
            <input
              type="password"
              placeholder="Senha"
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#FDC500]/50 outline-none"
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-[#FDC500] text-black py-4 rounded-xl font-semibold text-lg hover:bg-[#FDC500]/90 primary-glow"
            >
              {isLogin ? "Entrar" : "Criar Conta"}
            </motion.button>
          </form>

          <p className="text-center mt-6 text-zinc-400">
            {isLogin ? "Não tem conta?" : "Já tem conta?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? "Criar agora" : "Fazer login"}
            </button>
          </p>
        </motion.div>
      </Modal>
    </div>
  );
}
