import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/shared/back-button";

function ErrorPage({
  icon: Icon,
  iconClass,
  title,
  description,
}: {
  icon: React.ElementType;
  iconClass: string;
  title: string;
  description: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#08090f] text-zinc-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center border-zinc-800 bg-zinc-900/60 backdrop-blur-xl space-y-4">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ${iconClass}`}
        >
          <Icon className="h-7 w-7" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-white">
            {title}
          </h1>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>
        <div className="pt-2 flex justify-center">
          <BackButton />
        </div>
      </Card>
    </main>
  );
}

export default ErrorPage;