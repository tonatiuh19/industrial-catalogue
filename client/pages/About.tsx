import React from "react";
import {
  Building2,
  Target,
  Users,
  Cog,
  Award,
  Handshake,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import SEO from "../components/SEO";
import Header from "../components/Header";
import Footer from "../components/Footer";

const About: React.FC = () => {
  const industries = [
    "Industria manufacturera",
    "Sector automotriz",
    "Mantenimiento industrial (MRO)",
    "Procesos productivos especializados",
  ];

  const keyStrengths = [
    "Asesoría técnica especializada",
    "Suministro oportuno y confiable",
    "Soluciones adaptadas a cada necesidad",
    "Respaldo de marcas líderes",
  ];

  const approach = [
    {
      icon: Target,
      title: "Práctico",
      description: "Soluciones directas y efectivas",
    },
    {
      icon: Cog,
      title: "Eficiente",
      description: "Optimización de procesos y recursos",
    },
    {
      icon: Award,
      title: "Orientado a Resultados",
      description: "Enfoque en la productividad del cliente",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Acerca de Nosotros | Grupo Trenor"
        description="Conoce la historia, misión y enfoque de Grupo Trenor S.A. DE C.V. - Tu aliado estratégico en soluciones industriales, refacciones y suministro MRO."
      />

      <Header />

      {/* Hero Section */}
      <section className="bg-primary text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Building2 className="h-12 w-12 text-accent mb-6" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Acerca de Grupo Trenor
            </h1>
            <p className="text-xl text-steel-200 leading-relaxed">
              Tu aliado estratégico en soluciones industriales, refacciones y
              suministro MRO
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Company Origin */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Nuestra Historia
            </h2>
            <p className="text-xl text-steel-600 leading-relaxed">
              Trenor nace con el objetivo de convertirse en un aliado
              estratégico para la industria, ofreciendo soluciones integrales en
              refacciones, componentes y suministro industrial.
            </p>
          </div>

          <div className="bg-steel-50 rounded-xl p-8 mb-12">
            <div className="flex items-start gap-4">
              <Target className="h-8 w-8 text-accent mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">
                  Nuestra Misión
                </h3>
                <p className="text-steel-700 leading-relaxed text-lg">
                  Brindar soluciones industriales confiables y eficientes a
                  nuestros clientes, mediante el suministro oportuno de
                  refacciones, componentes y equipos industriales, apoyados en
                  asesoría técnica especializada y un enfoque orientado a la
                  productividad y continuidad operativa.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Experience & Expertise */}
        <div className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Experiencia y Especialización
              </h2>
              <p className="text-xl text-steel-600">
                Respaldados por experiencia en el sector industrial y un enfoque
                orientado a la atención técnica y comercial
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white border-2 border-steel-100 rounded-xl p-8 hover:border-accent/20 transition-colors">
                <Users className="h-10 w-10 text-accent mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-3">
                  Atención Especializada
                </h3>
                <p className="text-steel-700 leading-relaxed">
                  Ayudamos a nuestros clientes a mantener la continuidad
                  operativa de sus procesos productivos con asesoría técnica y
                  comercial especializada.
                </p>
              </div>

              <div className="bg-white border-2 border-steel-100 rounded-xl p-8 hover:border-accent/20 transition-colors">
                <Handshake className="h-10 w-10 text-accent mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-3">
                  Aliados Estratégicos
                </h3>
                <p className="text-steel-700 leading-relaxed">
                  Trabajamos con proveedores y marcas líderes a nivel nacional e
                  internacional para ofrecer las mejores soluciones
                  industriales.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Industries We Serve */}
        <div className="bg-primary text-white py-16 -mx-4 sm:-mx-6 lg:-mx-8 mb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                Sectores que Atendemos
              </h2>
              <p className="text-xl text-steel-200 mb-12">
                Ofrecemos productos y soluciones adaptadas a cada necesidad
                industrial
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {industries.map((industry, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center"
                  >
                    <CheckCircle className="h-8 w-8 text-accent mx-auto mb-3" />
                    <h3 className="font-semibold text-white">{industry}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Our Approach */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Nuestro Enfoque
            </h2>
            <p className="text-xl text-steel-600 mb-8">
              En Trenor trabajamos con un enfoque práctico, eficiente y
              orientado a resultados
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {approach.map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-steel-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Strengths */}
        <div className="bg-steel-50 rounded-xl p-8 mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">
              Nuestras Fortalezas Clave
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {keyStrengths.map((strength, index) => (
                <div key={index} className="flex items-center gap-3">
                  <ArrowRight className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-steel-700 font-medium">{strength}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What We Are Not */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-blue-50 border-l-4 border-accent rounded-r-xl p-8">
            <h3 className="text-2xl font-semibold text-primary mb-4">
              Modelo de Negocio
            </h3>
            <p className="text-steel-700 text-lg leading-relaxed">
              <strong>
                Trenor es una empresa comercializadora e integradora
              </strong>{" "}
              de soluciones industriales que trabaja con marcas y fabricantes
              reconocidos. No fabricamos productos propios, sino que nos
              enfocamos en ofrecer las mejores soluciones disponibles en el
              mercado, respaldadas por nuestra experiencia técnica y comercial.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-primary text-white py-12 rounded-xl">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para Optimizar tus Procesos Industriales?
          </h2>
          <p className="text-xl text-steel-200 mb-8 max-w-2xl mx-auto">
            Déjanos ser tu aliado estratégico en soluciones industriales.
            Contáctanos y descubre cómo podemos apoyar la continuidad operativa
            de tu empresa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors inline-flex items-center gap-2"
            >
              Solicitar Cotización
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="/catalogue"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
            >
              Ver Catálogo
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
