import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], display: "swap" });

export const metadata = {
  title: { default: "DSA Arena", template: "%s · DSA Arena" },
  description: "Personal practice arena for the 150-question DSA interview sheet.",
  robots: { index: false, follow: false },
};

export const viewport = {
  themeColor: "#0d0f14",
};

// Applies the saved reading size before first paint, so text never jumps.
const textSizeScript = `try{var s=JSON.parse(localStorage.getItem("arena:settings")||"{}");if(s.textSize)document.documentElement.dataset.text=s.textSize}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: textSizeScript }} />
      </head>
      <body className="min-h-full bg-bg text-text antialiased">{children}</body>
    </html>
  );
}
