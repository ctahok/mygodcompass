import QuizPageClient from "./QuizPageClient";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ru" }, { locale: "az" }];
}

export default async function QuizLocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <QuizPageClient locale={locale} />;
}