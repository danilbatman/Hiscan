"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, name }) });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Ошибка");
    router.push("/dashboard");
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-xl font-semibold mb-4">Регистрация</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя" className="w-full border border-black rounded px-3 py-2 bg-white" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border border-black rounded px-3 py-2 bg-white" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" type="password" className="w-full border border-black rounded px-3 py-2 bg-white" />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <Button type="submit">Создать аккаунт</Button>
      </form>
    </div>
  );
}