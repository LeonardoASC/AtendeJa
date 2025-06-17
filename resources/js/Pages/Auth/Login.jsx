import React from "react";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), { onFinish: () => reset("password") });
    };

    const container = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.12, duration: 0.6, ease: "easeOut" },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    return (
        <GuestLayout>
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <motion.div
                    className="absolute left-1/2 top-[-15%] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 opacity-40 blur-3xl"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                />
                <motion.div
                    className="absolute bottom-[-15%] right-[-10%] h-[260px] w-[260px] rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 opacity-30 blur-3xl"
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
                />
            </div>

            <Head title="Entrar" />
            {status && (
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-6 rounded-lg bg-green-100 px-4 py-3 text-sm font-medium text-green-700 shadow-lg"
                >
                    {status}
                </motion.div>
            )}

            <motion.form
                onSubmit={submit}
                layout
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                <motion.header variants={item} className="text-center">
                    <motion.h1
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "backOut" }}
                        className="text-3xl font-extrabold text-gray-800"
                    >
                        Acesse sua conta
                    </motion.h1>
                    <motion.p
                        variants={item}
                        className="mt-2 text-sm text-gray-500"
                    >
                        Entre com seu e‑mail institucional
                    </motion.p>
                </motion.header>

                <motion.div variants={item} className="relative">
                    <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-all duration-300 peer-focus:text-sky-500" />
                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        autoComplete="username"
                        required
                        className="peer w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-11 pr-3 text-sm outline-none transition-colors duration-300 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/20"
                    />
                </motion.div>

                <motion.div variants={item} className="relative">
                    <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-all duration-300 peer-focus:text-sky-500" />
                    <input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Senha"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        autoComplete="current-password"
                        required
                        className="peer w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-11 pr-3 text-sm outline-none transition-colors duration-300 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/20"
                    />
                </motion.div>

                <motion.div
                    variants={item}
                    className="flex items-center justify-between text-sm"
                >
                    <label className="flex items-center gap-2 text-gray-600">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData("remember", e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                        />
                        Lembrar
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="font-medium text-sky-500 hover:underline"
                        >
                            Esqueceu a senha?
                        </Link>
                    )}
                </motion.div>

                <motion.button
                    variants={item}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    type="submit"
                    disabled={processing}
                    className="relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-black py-3 text-base font-semibold text-white shadow-xl focus:outline-none"
                >
                    <motion.span
                        className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30"
                        animate={{ scale: [0, 50], opacity: [0.5, 0] }}
                        transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut" }}
                    />
                    <span className="relative z-10 select-none">
                        {processing ? "Entrando..." : "Entrar"}
                    </span>
                </motion.button>

                {(errors.email || errors.password) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-1 text-center text-sm text-red-600"
                    >
                        {errors.email && <p>{errors.email}</p>}
                        {errors.password && <p>{errors.password}</p>}
                    </motion.div>
                )}

            </motion.form>
        </GuestLayout>
    );
}
