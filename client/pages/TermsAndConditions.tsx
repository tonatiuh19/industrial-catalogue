import React from "react";
import { Scale, Calendar } from "lucide-react";
import SEO from "../components/SEO";
import Header from "../components/Header";
import Footer from "../components/Footer";

const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Términos y Condiciones | Grupo Trenor"
        description="Términos y condiciones de uso del sitio web de Grupo Trenor S.A. DE C.V. - Soluciones industriales y suministro MRO."
      />

      <Header />

      {/* Hero Section */}
      <section className="bg-primary text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Scale className="h-12 w-12 text-accent mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Términos y Condiciones
            </h1>
            <p className="text-lg text-steel-200 max-w-2xl mx-auto">
              Condiciones de uso del sitio web de Grupo Trenor S.A. DE C.V.
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

            {/* Company Information */}
            <div>
              <h2 className="text-2xl text-gray-900 font-semibold mb-4">
                Información de la Empresa
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                El presente documento regula el acceso y uso del sitio web,
                propiedad de <strong>GRUPO TRENOR S.A. DE C.V.</strong>
              </p>

              <div className="ml-6 space-y-3">
                <div>
                  <p className="font-medium text-gray-900">Domicilio:</p>
                  <p className="text-gray-700">
                    Boulevard Montes Malaga número 236
                    <br />
                    Colonia Lomas Del Refugio
                    <br />
                    C.P. 37358, León, Guanajuato, México
                  </p>
                </div>

                <div>
                  <p className="text-gray-700">
                    <span className="font-medium text-gray-900">RFC:</span>{" "}
                    GTR260115V17
                  </p>
                </div>
              </div>
            </div>

            {/* Terms Sections */}
            <div className="space-y-6">
              {/* Section 1 */}
              <div>
                <h2 className="text-xl text-gray-900 font-semibold mb-4">
                  1. Aceptación de los términos
                </h2>
                <div className="ml-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Al acceder y utilizar este sitio web, el usuario acepta los
                    presentes términos y condiciones de manera íntegra y sin
                    reservas.
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Importante:</strong> Si no está de acuerdo con estos
                    términos, le recomendamos abstenerse de utilizar nuestros
                    servicios.
                  </p>
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-xl text-gray-900 font-semibold mb-4">
                  2. Objeto del sitio
                </h2>
                <div className="ml-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    El sitio tiene como finalidad proporcionar información sobre
                    productos, servicios, cotizaciones y soluciones industriales
                    ofrecidas por GRUPO TRENOR S.A. DE C.V.
                  </p>
                  <div className="space-y-3">
                    <p className="text-gray-700 text-sm">
                      <strong>Catálogo de productos:</strong> Información
                      detallada sobre refacciones, componentes y equipos
                      industriales
                    </p>
                    <p className="text-gray-700 text-sm">
                      <strong>Sistema de cotizaciones:</strong> Herramientas
                      para solicitar presupuestos personalizados
                    </p>
                    <p className="text-gray-700 text-sm">
                      <strong>Información comercial:</strong> Datos de contacto,
                      horarios y servicios disponibles
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-xl text-gray-900 font-semibold mb-4">
                  3. Uso adecuado del sitio
                </h2>
                <div className="ml-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    El usuario se compromete a utilizar el sitio de manera
                    lícita y conforme a la legislación mexicana vigente.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Uso Permitido
                      </h4>
                      <ul className="text-gray-700 text-sm space-y-1 ml-4">
                        <li>• Consultar información de productos</li>
                        <li>• Solicitar cotizaciones legítimas</li>
                        <li>• Contactar para consultas comerciales</li>
                        <li>• Navegar con fines informativos</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Uso Prohibido
                      </h4>
                      <ul className="text-gray-700 text-sm space-y-1 ml-4">
                        <li>• Actividades ilegales o fraudulentas</li>
                        <li>• Spam o comunicaciones masivas</li>
                        <li>• Interferir con el funcionamiento</li>
                        <li>• Extraer datos automáticamente</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="text-xl text-gray-900 font-semibold mb-4">
                  4. Propiedad intelectual
                </h2>
                <div className="ml-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Todos los contenidos del sitio, incluyendo logotipos,
                    textos, imágenes y diseños, son propiedad de GRUPO TRENOR
                    S.A. DE C.V. y están protegidos por la legislación
                    aplicable.
                  </p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Elementos Protegidos:
                    </h4>
                    <ul className="text-gray-700 text-sm space-y-1 ml-4">
                      <li>• Logotipos y marcas registradas</li>
                      <li>• Fotografías de productos</li>
                      <li>• Diseño y estructura del sitio</li>
                      <li>• Contenido técnico especializado</li>
                    </ul>
                  </div>
                  <p className="text-gray-600 text-sm">
                    La utilización no autorizada de estos elementos puede
                    constituir una violación a los derechos de propiedad
                    intelectual.
                  </p>
                </div>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className="text-xl text-gray-900 font-semibold mb-4">
                  5. Limitación de responsabilidad
                </h2>
                <div className="ml-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    GRUPO TRENOR S.A. DE C.V. no será responsable por daños
                    derivados del uso indebido del sitio web.
                  </p>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Limitaciones específicas:
                    </h4>
                    <ul className="text-gray-700 text-sm space-y-2 ml-4">
                      <li>
                        • Interrupciones temporales del servicio por
                        mantenimiento
                      </li>
                      <li>
                        • Errores u omisiones en la información de productos
                      </li>
                      <li>
                        • Cambios en disponibilidad o precios sin previo aviso
                      </li>
                      <li>
                        • Pérdida de datos durante transmisión por Internet
                      </li>
                    </ul>
                  </div>
                  <p className="text-gray-700 text-sm mt-4">
                    <strong>Nota:</strong> Las cotizaciones y disponibilidad de
                    productos están sujetas a confirmación posterior por parte
                    de nuestro equipo comercial.
                  </p>
                </div>
              </div>

              {/* Section 6 */}
              <div>
                <h2 className="text-xl text-gray-900 font-semibold mb-4">
                  6. Legislación aplicable y jurisdicción
                </h2>
                <div className="ml-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Este documento se rige por las leyes de los Estados Unidos
                    Mexicanos. Para cualquier controversia, las partes se
                    someten a los tribunales competentes de León, Guanajuato,
                    México, renunciando a cualquier otro fuero que pudiera
                    corresponderles.
                  </p>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Resolución de controversias:
                    </h4>
                    <div className="space-y-2 text-gray-700 text-sm ml-4">
                      <p>
                        <strong>1. Mediación:</strong> Preferimos resolver
                        cualquier disputa a través de comunicación directa y
                        mediación
                      </p>
                      <p>
                        <strong>2. Jurisdicción:</strong> Tribunales competentes
                        de León, Guanajuato, México
                      </p>
                      <p>
                        <strong>3. Ley aplicable:</strong> Código Civil Federal
                        y legislación comercial mexicana
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 7 - Modifications */}
              <div>
                <h2 className="text-xl text-gray-900 font-semibold mb-4">
                  7. Modificaciones a estos términos
                </h2>
                <div className="ml-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    GRUPO TRENOR S.A. DE C.V. se reserva el derecho de modificar
                    estos términos y condiciones en cualquier momento.
                  </p>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Proceso de actualización:
                    </h4>
                    <ul className="text-gray-700 text-sm space-y-1 ml-4">
                      <li>• Publicación de cambios en el sitio web</li>
                      <li>• Actualización de fecha de "Última modificación"</li>
                      <li>• Notificación en caso de cambios sustanciales</li>
                    </ul>
                  </div>
                  <p className="text-gray-700 text-sm mt-4">
                    <strong>Su aceptación:</strong> El uso continuado del sitio
                    web después de cualquier modificación constituye su
                    aceptación de los nuevos términos.
                  </p>
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
                  Para consultas relacionadas con estos términos y condiciones:
                </p>

                <div className="space-y-3">
                  <div>
                    <span className="text-gray-700">
                      <strong>Email:</strong> ventas@grupotrenor.com
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

export default TermsAndConditions;
