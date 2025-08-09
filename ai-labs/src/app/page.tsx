import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="grid gap-8">
      <section className="text-center py-12">
        <h1 className="text-3xl font-semibold">Расшифровка анализов и снимков с ИИ</h1>
        <p className="text-sm mt-3 text-black/70">Загрузите анализы, ответьте на несколько вопросов и получите понятный результат</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/analyze"><Button>Начать</Button></Link>
          <Link href="/pricing"><Button variant="white">Тарифы</Button></Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-medium">1. Опрос и загрузка</h3>
          <p className="text-sm text-black/70 mt-2">Ответьте на вопросы и приложите файлы: PDF, фото снимков, выписки</p>
        </Card>
        <Card>
          <h3 className="font-medium">2. Результат</h3>
          <p className="text-sm text-black/70 mt-2">Краткое резюме и список ключевых показателей с нормами</p>
        </Card>
        <Card>
          <h3 className="font-medium">3. Личный кабинет</h3>
          <p className="text-sm text-black/70 mt-2">История анализов, сравнение динамики, контроль показателей</p>
        </Card>
      </section>
    </div>
  );
}
