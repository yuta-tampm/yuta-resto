export function StepIntro({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="text-center">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      <p className="mx-auto mt-6 max-w-sm text-sm text-secondary">
        {description}
      </p>
    </header>
  );
}
