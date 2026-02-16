import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SEO from "@/components/SEO";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAdmin } from "@/context/AdminContext";
import { adminAuthApi } from "@/services/admin.service";
import { Loader2, ShieldCheck, Mail, KeyRound } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAdmin();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await adminAuthApi.checkUser(email);

      if (!data.exists) {
        setError("No se encontró cuenta de administrador con este correo");
        setLoading(false);
        return;
      }

      setUserId(data.admin.id);
      await adminAuthApi.sendCode(data.admin.id, email);

      setSuccess("Código de verificación enviado a tu correo");
      setStep("code");
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Ocurrió un error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await adminAuthApi.verifyCode(userId!, code);
      login(data.admin);
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Verificación fallida",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!userId) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await adminAuthApi.sendCode(userId, email);
      setSuccess("Código de verificación reenviado a tu correo");
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Ocurrió un error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-screen overflow-hidden flex">
      <SEO
        title="Inicio de Sesión | Panel de Administración"
        description="Acceso seguro al panel de administración del catálogo industrial."
        noindex={true}
      />
      {/* Left Column - Colored Background with Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-[#9e4629] to-accent relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative flex flex-col justify-center space-y-8 p-12 xl:p-16">
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center space-x-4">
              <img
                src="https://disruptinglabs.com/data/trenor/assets/images/logo_white_trenor.png"
                alt="Trenor Logo"
                className="h-16 w-auto object-contain"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="group flex items-start space-x-4 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 shadow-lg group-hover:bg-white/30 transition-all border border-white/30">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">
                  Gestionar Productos
                </h3>
                <p className="text-white/80 text-sm mt-1">
                  Agrega, edita y organiza tu catálogo de productos fácilmente
                </p>
              </div>
            </div>

            <div className="group flex items-start space-x-4 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 shadow-lg group-hover:bg-white/30 transition-all border border-white/30">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">
                  Revisar Cotizaciones
                </h3>
                <p className="text-white/80 text-sm mt-1">
                  Visualiza y gestiona solicitudes de cotización eficientemente
                </p>
              </div>
            </div>

            <div className="group flex items-start space-x-4 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 shadow-lg group-hover:bg-white/30 transition-all border border-white/30">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">
                  Gestión de Usuarios
                </h3>
                <p className="text-white/80 text-sm mt-1">
                  Administra usuarios con acceso basado en roles
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-8 border-t border-white/20">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-sm text-white/80 font-medium">
              Autenticación segura sin contraseña para administradores
            </p>
          </div>

          <div className="pt-6 text-center">
            <p className="text-xs text-white/60 font-medium">
              Powered by{" "}
              <a
                href="https://disruptinglabs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors underline decoration-white/40 hover:decoration-white"
              >
                DisruptingLabs.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - White Background with Login Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-br from-primary to-accent rounded-full p-3 shadow-xl">
                <ShieldCheck className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Panel de Administración
            </h1>
          </div>

          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="space-y-4 pb-6 px-0">
              <div className="text-center space-y-2">
                <CardTitle className="text-3xl font-bold text-slate-900">
                  {step === "email" ? "Bienvenido" : "Verificar Código"}
                </CardTitle>
                <CardDescription className="text-base text-slate-600">
                  {step === "email"
                    ? "Ingresa tu correo para recibir un código de verificación"
                    : "Ingresa el código de 6 dígitos enviado a tu correo"}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pb-0 px-0">
              {error && (
                <Alert
                  variant="destructive"
                  className="border-red-200 bg-red-50 animate-shake"
                >
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-900 border-green-200 animate-fade-in">
                  <AlertDescription className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{success}</span>
                  </AlertDescription>
                </Alert>
              )}

              {step === "email" ? (
                <form onSubmit={handleCheckEmail} className="space-y-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="email"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Correo Electrónico
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-accent transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        className="pl-12 h-12 border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-xl transition-all"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Enviando código...
                      </>
                    ) : (
                      <>
                        Continuar
                        <svg
                          className="ml-2 w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyCode} className="space-y-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="code"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Código de Verificación
                    </Label>
                    <div className="relative group">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-accent transition-colors" />
                      <Input
                        id="code"
                        type="text"
                        placeholder="000000"
                        value={code}
                        onChange={(e) =>
                          setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        required
                        disabled={loading}
                        maxLength={6}
                        className="pl-12 h-12 text-center text-2xl tracking-[0.5em] font-bold border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-xl transition-all"
                      />
                    </div>
                    <p className="text-xs text-slate-500 flex items-center space-x-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>El código expira en 10 minutos</span>
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      <>
                        <svg
                          className="mr-2 w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Verificar e Ingresar
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("email");
                        setCode("");
                        setError("");
                        setSuccess("");
                      }}
                      className="text-sm text-slate-600 hover:text-accent font-medium transition-colors flex items-center space-x-1"
                      disabled={loading}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      <span>Atrás</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="text-sm text-accent hover:text-accent/80 font-medium transition-colors flex items-center space-x-1"
                      disabled={loading}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span>Reenviar código</span>
                    </button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
