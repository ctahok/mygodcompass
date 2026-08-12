import LocaleApp from "./LocaleApp";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ru" }, { locale: "az" }];
}

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <LocaleApp locale={locale} />;
}
