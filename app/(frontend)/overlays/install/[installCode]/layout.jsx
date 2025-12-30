import { getOverlayPreviewFromDB } from "@/app/lib/database";

export async function generateMetadata({ params }, request) {

  const overlay = await getOverlayPreviewFromDB({ code: params.installCode });
  if (!overlay.success) return {};

  return {
    title: `New overlay shared: ${overlay.details[0]?.name || "Overlay"}`,
    description: "An overlay was shared with you. Click to install it!",

    openGraph: {
      title: `New overlay shared: ${overlay.details[0]?.name || "Overlay"}`,
      description: "An overlay was shared with you. Click to install it!",
      type: "website",

      images: [
        {
          url: overlay.details[0]?.image || "https://seapi.c4ldas.com.br/images/logo.webp",
          /* width: 800,
          height: 600, */
        },
      ],
    },
  }

}

export default function Layout({ children }) {
  return (
    <>
      {children}
    </>
  );
}