import React from "react";
import { Shield, Calendar } from "lucide-react";
import SEO from "../components/SEO";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PrivacyPolicy: React.FC = () => {
  const personalData = [
    "Nombre completo",
    "Empresa",
    "RFC",
    "Dirección fiscal",
    "Correo electrónico",
    "Teléfono",
    "Información de facturación",
    "Datos bancarios (cuando aplique)",
    "Información comercial relacionada con cotizaciones y pedidos",
  ];

  const primaryPurposes = [
    "Elaboración de cotizaciones",
    "Procesamiento de pedidos",
    "Facturación",
    "Cumplimiento de obligaciones contractuales",
    "Atención a clientes",
    "Seguimiento comercial",
    "Cumplimiento de obligaciones fiscales",
  ];

  const secondaryPurposes = [
    "Envío de promociones",
    "Información comercial",
    "Encuestas de satisfacción",
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Política de Privacidad | Grupo Trenor"
        description="Aviso de privacidad integral de Grupo Trenor S.A. DE C.V. sobre el tratamiento y protección de datos personales."
      />

      <Header />

      {/* Hero Section */}
      <section className="bg-primary text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Política de Privacidad
            </h1>
            <p className="text-lg text-steel-200 max-w-2xl mx-auto">
              Aviso de Privacidad Integral - Protección de datos personales
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 space-y-8">
            {/* Last Updated */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">
                  Última actualización: 11 de febrero de 2026
                </span>
              </div>
            </div>

            {/* Introduction */}
            <div>
              <h2 className="text-2xl text-gray-900 font-semibold mb-4">
                Aviso de Privacidad Integral
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                <strong>GRUPO TRENOR S.A. DE C.V.</strong>, en cumplimiento con
                la Ley Federal de Protección de Datos Personales en Posesión de
                los Particulares (LFPDPPP) y su Reglamento, pone a su
                disposición el presente Aviso de Privacidad.
              </p>
            </div>

            {/* Company Identity */}
            <div>
              <h2 className="text-xl text-gray-900 font-semibold mb-4">
                1. Identidad y domicilio del responsable
              </h2>
              <div className="space-y-4 ml-6">
                <div>
                  <p className="font-medium text-gray-900 mb-1">Responsable:</p>
                  <p className="text-gray-700 text-lg">
                    GRUPO TRENOR S.A. DE C.V.
                  </p>
                </div>

                <div>
                  <p className="font-medium text-gray-900 mb-1">Domicilio:</p>
                  <p className="text-gray-700">
                    Boulevard Montes Malaga número 236
                    <br />
                    Colonia Lomas Del Refugio
                    <br />
                    C.P. 37358, León, Guanajuato, México
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-gray-900 mb-1">RFC:</p>
                    <p className="text-gray-700">GTR260115V17</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Teléfono:</p>
                    <p className="text-gray-700">477 599 0905</p>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-gray-900 mb-1">
                    Correo para temas de datos personales:
                  </p>
                  <p className="text-gray-700">administracion@trenor.com.mx</p>
                </div>
              </div>
            </div>

            {/* Personal Data Collection */}
            <div>
              <h2 className="text-xl text-gray-900 font-semibold mb-4">
                2. Datos personales que se recaban
              </h2>
              <div className="ml-6">
                <p className="text-gray-700 mb-6">
                  Podremos recabar los siguientes datos personales a través de
                  diferentes canales:
                </p>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Métodos de recolección:
                    </h4>
                    <ul className="text-gray-700 space-y-2 ml-4">
                      <li>
                        • <strong>Formularios web:</strong> Contacto,
                        cotizaciones, registro
                      </li>
                      <li>
                        • <strong>Comunicación directa:</strong> Email,
                        teléfono, reuniones
                      </li>
                      <li>
                        • <strong>Procesos comerciales:</strong> Facturación,
                        contratos
                      </li>
                      <li>
                        • <strong>Cookies:</strong> Preferencias y navegación
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Tipos de datos personales:
                    </h4>
                    <ul className="text-gray-700 space-y-1 ml-4">
                      {personalData.map((data, index) => (
                        <li key={index}>• {data}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Tiempo de conservación:
                    </h4>
                    <p className="text-gray-700 mb-2 ml-4">
                      Los datos personales se conservarán por el tiempo
                      necesario para cumplir con las finalidades establecidas y
                      las obligaciones legales:
                    </p>
                    <ul className="text-gray-700 space-y-1 ml-8">
                      <li>
                        • <strong>Datos comerciales:</strong> Mientras exista
                        relación comercial + 5 años
                      </li>
                      <li>
                        • <strong>Datos fiscales:</strong> Según legislación
                        fiscal vigente (5 años)
                      </li>
                      <li>
                        • <strong>Datos de marketing:</strong> Hasta solicitud
                        de baja del titular
                      </li>
                    </ul>
                  </div>

                  <p className="text-gray-700 font-medium ml-4">
                    Nota: No recabamos datos personales sensibles (origen
                    racial, creencias religiosas, estado de salud, etc.)
                  </p>
                </div>
              </div>
            </div>

            {/* Data Processing Purposes */}
            <div>
              <h2 className="text-xl text-gray-900 font-semibold mb-4">
                3. Finalidades del tratamiento de datos
              </h2>
              <div className="ml-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Finalidades primarias:
                  </h3>
                  <ul className="text-gray-700 space-y-1 ml-4">
                    {primaryPurposes.map((purpose, index) => (
                      <li key={index}>• {purpose}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Finalidades secundarias:
                  </h3>
                  <ul className="text-gray-700 space-y-1 ml-4">
                    {secondaryPurposes.map((purpose, index) => (
                      <li key={index}>• {purpose}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* ARCO Rights */}
            <div>
              <h2 className="text-xl text-gray-900 font-semibold mb-4">
                4. Derechos ARCO
              </h2>
              <div className="ml-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Como titular de datos personales, usted cuenta con los
                  siguientes derechos (Acceso, Rectificación, Cancelación y
                  Oposición):
                </p>

                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Acceso:</p>
                    <p className="text-gray-700 ml-4 text-sm">
                      Conocer qué datos personales tenemos sobre usted y cómo
                      los utilizamos
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">
                      Rectificación:
                    </p>
                    <p className="text-gray-700 ml-4 text-sm">
                      Solicitar la corrección de datos inexactos o incompletos
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">
                      Cancelación:
                    </p>
                    <p className="text-gray-700 ml-4 text-sm">
                      Eliminar sus datos cuando considere que no se requieren
                      para la finalidad
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">
                      Oposición:
                    </p>
                    <p className="text-gray-700 ml-4 text-sm">
                      Oponerse al uso de sus datos para finalidades específicas
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Requisitos para ejercer derechos ARCO:
                  </h4>
                  <ul className="text-gray-700 text-sm space-y-1 ml-4">
                    <li>
                      • Identificación oficial vigente del titular o
                      representante legal
                    </li>
                    <li>
                      • Descripción clara y precisa de los datos respecto de los
                      que busca ejercer el derecho
                    </li>
                    <li>
                      • Domicilio u otro medio para comunicar la respuesta
                    </li>
                    <li>
                      • Documentos que acrediten la identidad o representación
                    </li>
                  </ul>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Cómo ejercer sus derechos:
                  </h4>
                  <div className="space-y-3 ml-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        Correo electrónico:
                      </p>
                      <p className="text-gray-700">
                        administracion@trenor.com.mx
                      </p>
                      <p className="text-gray-600 text-sm">
                        Tiempo de respuesta: 20 días hábiles a partir de la
                        recepción
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-gray-900">Domicilio:</p>
                      <p className="text-gray-700">
                        Boulevard Montes Malaga número 236
                        <br />
                        Colonia Lomas del Refugio
                        <br />
                        C.P. 37358, León, Guanajuato, México
                      </p>
                      <p className="text-gray-600 text-sm">
                        Horario de atención: Lunes a viernes de 8:30 AM a 6:00
                        PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Transfer */}
            <div>
              <h2 className="text-xl text-gray-900 font-semibold mb-4">
                5. Transferencia de datos
              </h2>
              <div className="ml-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Sus datos personales no serán transferidos a terceros sin su
                  consentimiento, salvo las excepciones previstas en la LFPDPPP.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Transferencias permitidas sin consentimiento:
                    </h4>
                    <ul className="text-gray-700 text-sm space-y-1 ml-4">
                      <li>
                        • Cuando sea necesario para el cumplimiento de
                        obligaciones legales
                      </li>
                      <li>• Por disposición de autoridad competente</li>
                      <li>• Para proteger los intereses vitales del titular</li>
                      <li>
                        • En caso de transmisión corporativa (fusión,
                        adquisición)
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Terceros autorizados:
                    </h4>
                    <div className="space-y-2 text-gray-700 text-sm ml-4">
                      <p>
                        <strong>Proveedores de servicios:</strong> Solo cuando
                        sea necesario para brindar nuestros servicios
                        (logística, facturación electrónica, etc.)
                      </p>
                      <p>
                        <strong>Autoridades fiscales:</strong> Cumplimiento de
                        obligaciones tributarias
                      </p>
                      <p>
                        <strong>Socios comerciales:</strong> Únicamente con su
                        consentimiento expreso
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Measures */}
            <div>
              <h2 className="text-xl text-gray-900 font-semibold mb-4">
                6. Medidas de seguridad
              </h2>
              <div className="ml-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  GRUPO TRENOR S.A. DE C.V. implementa medidas administrativas,
                  técnicas y físicas para proteger sus datos personales.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Medidas Administrativas:
                    </h4>
                    <ul className="text-gray-700 text-sm space-y-1 ml-4">
                      <li>• Políticas de privacidad</li>
                      <li>• Capacitación del personal</li>
                      <li>• Control de acceso por roles</li>
                      <li>• Auditorías periódicas</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Medidas Técnicas:
                    </h4>
                    <ul className="text-gray-700 text-sm space-y-1 ml-4">
                      <li>• Cifrado de datos</li>
                      <li>• Conexiones seguras (SSL)</li>
                      <li>• Cortafuegos (Firewalls)</li>
                      <li>• Respaldos periódicos</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Medidas Físicas:
                    </h4>
                    <ul className="text-gray-700 text-sm space-y-1 ml-4">
                      <li>• Control de acceso a instalaciones</li>
                      <li>• Servidores en ubicaciones seguras</li>
                      <li>• Sistemas de videovigilancia</li>
                      <li>• Destrucción segura de documentos</li>
                    </ul>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mt-4">
                  <strong>Compromiso de seguridad:</strong> Revisamos y
                  actualizamos regularmente nuestras medidas de seguridad para
                  adaptarnos a nuevas amenazas y tecnologías.
                </p>
              </div>
            </div>

            {/* Changes to Privacy Notice */}
            <div>
              <h2 className="text-xl text-gray-900 font-semibold mb-4">
                7. Cambios al aviso de privacidad
              </h2>
              <div className="ml-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  El presente aviso puede sufrir modificaciones. Cualquier
                  cambio será publicado en nuestro sitio web oficial.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Proceso de notificación:
                    </h4>
                    <ol className="text-gray-700 text-sm space-y-2 ml-4">
                      <li>
                        1. Publicación en nuestro sitio web con 10 días de
                        anticipación
                      </li>
                      <li>
                        2. Notificación por email a clientes registrados
                        (cambios sustanciales)
                      </li>
                      <li>
                        3. Actualización de fecha de "Última modificación"
                      </li>
                    </ol>
                  </div>

                  <p className="text-gray-700 text-sm">
                    <strong>Su consentimiento:</strong> El uso continuado de
                    nuestros servicios después de la publicación de cambios
                    constituye su aceptación de las modificaciones realizadas.
                  </p>
                </div>
              </div>
            </div>

            {/* Cookies and Tracking */}
            <div>
              <h2 className="text-xl text-gray-900 font-semibold mb-4">
                8. Cookies y tecnologías de seguimiento
              </h2>
              <div className="ml-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Utilizamos cookies y tecnologías similares para mejorar su
                  experiencia en nuestro sitio web y proporcionar servicios
                  personalizados.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Cookies Esenciales:
                    </h4>
                    <p className="text-gray-700 text-sm mb-2 ml-4">
                      Necesarias para el funcionamiento del sitio:
                    </p>
                    <ul className="text-gray-700 text-sm space-y-1 ml-8">
                      <li>• Sesión de usuario</li>
                      <li>• Configuración de idioma</li>
                      <li>• Carrito de cotizaciones</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Cookies Analíticas:
                    </h4>
                    <p className="text-gray-700 text-sm mb-2 ml-4">
                      Para mejorar nuestros servicios:
                    </p>
                    <ul className="text-gray-700 text-sm space-y-1 ml-8">
                      <li>• Estadísticas de navegación</li>
                      <li>• Productos más consultados</li>
                      <li>• Rendimiento del sitio</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Control de cookies:
                    </h4>
                    <p className="text-gray-700 text-sm mb-2 ml-4">
                      Puede controlar y eliminar cookies a través de:
                    </p>
                    <ul className="text-gray-700 text-sm space-y-1 ml-8">
                      <li>• Configuración de su navegador web</li>
                      <li>• Panel de preferencias en nuestro sitio</li>
                      <li>• Herramientas de privacidad de terceros</li>
                    </ul>
                    <p className="text-gray-600 text-xs mt-2 ml-4">
                      <strong>Nota:</strong> Desactivar cookies esenciales puede
                      afectar la funcionalidad del sitio web.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl text-gray-900 font-semibold mb-4">
                Información de Contacto
              </h2>
              <div className="ml-6">
                <p className="text-gray-700 mb-4">
                  Para consultas relacionadas con el tratamiento de datos
                  personales:
                </p>

                <div className="space-y-3">
                  <div>
                    <span className="text-gray-700">
                      <strong>Email:</strong> administracion@trenor.com.mx
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-700">
                      <strong>Teléfono:</strong> 477 599 0905
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
