import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  price?: number;
  currency?: string;
  availability?: "in stock" | "out of stock";
  sku?: string;
  noindex?: boolean;
}

const SEO = ({
  title = "Industrial - Catálogo de Productos Industriales",
  description = "Encuentra herramientas y equipamiento industrial de calidad. Innovación y durabilidad en cada producto.",
  image = "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200",
  url = window.location.href,
  type = "website",
  price,
  currency = "MXN",
  availability = "in stock",
  sku,
  noindex = false,
}: SEOProps) => {
  const siteName = "Industrial";
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Product-specific meta tags */}
      {type === "product" && (
        <>
          <meta property="og:type" content="product" />
          {price && (
            <>
              <meta
                property="product:price:amount"
                content={price.toString()}
              />
              <meta property="product:price:currency" content={currency} />
            </>
          )}
          {availability && (
            <meta property="product:availability" content={availability} />
          )}
          {sku && <meta property="product:retailer_item_id" content={sku} />}
        </>
      )}

      {/* Additional SEO */}
      <meta
        name="robots"
        content={noindex ? "noindex, nofollow" : "index, follow"}
      />
      <meta name="language" content="Spanish" />
      <meta name="author" content="Industrial" />
    </Helmet>
  );
};

export default SEO;
