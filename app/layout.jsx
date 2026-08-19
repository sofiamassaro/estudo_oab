import "./globals.css";

export const metadata = {
  title: "Estudo OAB",
  description: "Banco pessoal de questões da OAB por tema, com dúvidas e progresso.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-50 text-slate-800 antialiased">{children}</body>
    </html>
  );
}
