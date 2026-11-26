import { CareerDocumentForm } from "@/components/career-document-form";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center gap-6 px-6 py-16">
      <h1 className="text-2xl font-semibold">職務経歴書のアップロード</h1>
      <CareerDocumentForm />
    </main>
  );
}
