-- Migration 010: Update FAQ Data with Trenor Company Information
-- Update existing FAQ categories and items with real company data

-- First, clear existing FAQ data
DELETE FROM `faq_items`;
DELETE FROM `faq_categories`;

-- Reset AUTO_INCREMENT for clean IDs
ALTER TABLE `faq_categories` AUTO_INCREMENT = 1;
ALTER TABLE `faq_items` AUTO_INCREMENT = 1;

-- Insert updated FAQ categories for Trenor
INSERT INTO `faq_categories` (`name`, `slug`, `description`, `sort_order`) VALUES
('Preguntas Generales', 'general', 'Información general sobre Grupo Trenor y nuestros servicios', 1),
('Productos y Servicios', 'productos', 'Preguntas sobre nuestro catálogo de refacciones y componentes industriales', 2),
('Cotizaciones y Pedidos', 'pedidos-cotizaciones', 'Información sobre cómo solicitar cotizaciones y realizar pedidos', 3),
('Soporte Técnico', 'soporte-tecnico', 'Asesoría técnica y resolución de problemas', 4),
('Entrega y Logística', 'entrega-logistica', 'Preguntas sobre tiempos de entrega y logística', 5);

-- Insert updated FAQ items with Trenor-specific information
INSERT INTO `faq_items` (`category_id`, `question`, `answer`, `sort_order`) VALUES
-- Preguntas Generales (category_id: 1)
(1, '¿Qué tipo de productos ofrece Trenor?', 'Ofrecemos refacciones, componentes, equipos y soluciones industriales para mantenimiento, producción y operación industrial (MRO). Nos especializamos en la industria manufacturera, automotriz y de mantenimiento.', 1),
(1, '¿Trenor fabrica sus propios productos?', 'No. Trenor es una empresa comercializadora e integradora de soluciones industriales que trabaja con marcas y fabricantes reconocidos a nivel nacional e internacional.', 2),
(1, '¿En qué sectores industriales trabajan?', 'Atendemos principalmente a la industria manufacturera, automotriz y de mantenimiento industrial (MRO), ofreciendo productos y soluciones adaptadas a cada necesidad específica.', 3),
(1, '¿Cuál es el objetivo de Trenor?', 'Trenor nace con el objetivo de convertirse en un aliado estratégico para la industria, ofreciendo soluciones integrales en refacciones, componentes y suministro industrial con un enfoque orientado a la continuidad operativa.', 4),

-- Productos y Servicios (category_id: 2)
(2, '¿Qué marcas y proveedores manejan?', 'Trabajamos con proveedores y marcas líderes a nivel nacional e internacional para ofrecer productos de alta calidad respaldados por fabricantes reconocidos en la industria.', 1),
(2, '¿Ofrecen asesoría técnica?', 'Sí, contamos con experiencia en el sector industrial y un enfoque orientado a la atención técnica y comercial. Nuestro equipo brinda asesoría especializada para ayudar a mantener la continuidad operativa de los procesos productivos.', 2),
(2, '¿Qué tipo de soluciones industriales ofrecen?', 'Ofrecemos soluciones integrales que incluyen refacciones, componentes especializados, equipos industriales y servicios de mantenimiento (MRO) adaptados a las necesidades específicas de cada cliente.', 3),
(2, '¿Cómo aseguran la calidad de sus productos?', 'Trabajamos únicamente con fabricantes y marcas reconocidas, y nuestro equipo técnico valida cada producto para garantizar que cumpla con los estándares requeridos para la aplicación industrial específica.', 4),

-- Cotizaciones y Pedidos (category_id: 3)
(3, '¿Realizan cotizaciones personalizadas?', 'Sí. Todas nuestras cotizaciones se elaboran de acuerdo con los requerimientos específicos del cliente, considerando las necesidades técnicas y operativas particulares de cada proyecto.', 1),
(3, '¿Atienden proyectos especiales?', 'Sí, apoyamos proyectos especiales y requerimientos técnicos bajo solicitud. Nuestro enfoque práctico nos permite adaptarnos a necesidades específicas de la industria.', 2),
(3, '¿Cómo puedo solicitar una cotización?', 'Puedes contactarnos a través de nuestro formulario en línea, por correo electrónico a ventas@grupotrenor.com, o llamando al 477 599 0905. Proporciónanos los detalles específicos de tu requerimiento.', 3),
(3, '¿Qué información necesito para solicitar una cotización?', 'Para brindar una cotización precisa, necesitamos conocer las especificaciones técnicas del producto, cantidades requeridas, aplicación específica y tiempos de entrega necesarios.', 4),

-- Soporte Técnico (category_id: 4)
(4, '¿Cómo puedo obtener asesoría técnica?', 'Nuestro equipo técnico está disponible para brindar asesoría especializada. Puedes contactarnos por teléfono al 477 599 0905 o por correo electrónico para recibir soporte técnico personalizado.', 1),
(4, '¿Qué tipo de soporte técnico ofrecen?', 'Ofrecemos asesoría en selección de productos, compatibilidad de componentes, especificaciones técnicas y recomendaciones para optimizar el mantenimiento y operación de equipos industriales.', 2),
(4, '¿Ayudan con la selección de productos?', 'Sí, nuestro equipo técnico te ayuda a seleccionar los productos más adecuados para tu aplicación específica, considerando factores como compatibilidad, rendimiento y costo-beneficio.', 3),
(4, '¿Ofrecen capacitación técnica?', 'Proporcionamos orientación técnica y recomendaciones sobre el uso adecuado de nuestros productos. También coordinamos con fabricantes cuando se requiere capacitación especializada.', 4),

-- Entrega y Logística (category_id: 5)
(5, '¿Cuál es el tiempo de entrega?', 'El tiempo de entrega depende del producto y disponibilidad en inventario. Se confirma el tiempo específico en cada cotización, siempre buscando cumplir con los plazos operativos del cliente.', 1),
(5, '¿Realizan entregas en toda la República Mexicana?', 'Sí, atendemos clientes en todo México. Los costos y tiempos de envío se calculan según la ubicación de destino y el tipo de producto.', 2),
(5, '¿Cómo rastreo mi pedido?', 'Una vez confirmado tu pedido, te proporcionamos información de seguimiento para que puedas monitorear el estado de tu entrega hasta su llegada a destino.', 3),
(5, '¿Manejan entregas urgentes?', 'Sí, entendemos las necesidades operativas de la industria y trabajamos para atender requerimientos urgentes cuando la disponibilidad del producto lo permite.', 4);