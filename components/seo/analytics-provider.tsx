import Script from "next/script";
import { createPublicClient } from "@/lib/supabase/public";

export async function AnalyticsProvider() {
  let ga4Id: string | null = null;
  let metaPixelId: string | null = null;
  let searchConsoleCode: string | null = null;

  try {
    const supabase = createPublicClient();
    const { data: seo } = await supabase
      .from("seo_settings")
      .select("ga4_id, meta_pixel_id, search_console_code")
      .limit(1)
      .maybeSingle();

    if (seo) {
      ga4Id = seo.ga4_id || null;
      metaPixelId = seo.meta_pixel_id || null;
      searchConsoleCode = seo.search_console_code || null;
    }
  } catch (e) {
    console.error("Error reading SEO settings for analytics scripts:", e);
  }

  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Webspyra",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://webspyra.com",
    "logo": `${process.env.NEXT_PUBLIC_SITE_URL || "https://webspyra.com"}/icons/icon-512x512.png`,
    "description": "Award-winning web development agency creating fast, responsive, and animated business websites.",
    "telephone": "+91-89588-89538",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sector 62",
      "addressLocality": "Noida",
      "addressRegion": "Uttar Pradesh",
      "addressCountry": "IN"
    },
    "priceRange": "₹₹",
    "openingHours": "Mo-Su 00:00-24:00",
  };

  return (
    <>
      {/* Global JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
      />

      {/* Google Search Console Verification Meta */}
      {searchConsoleCode && (
        <meta name="google-site-verification" content={searchConsoleCode} />
      )}

      {/* Google Analytics 4 */}
      {ga4Id && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga4Id}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* Meta (Facebook) Pixel */}
      {metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
