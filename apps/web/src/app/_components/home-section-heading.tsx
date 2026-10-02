import {
  sectionTitleClassName,
  sectionDescriptionClassName,
} from './home-typography';

export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = true,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}>
      {eyebrow ? (
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-status-success">
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`mt-2 ${sectionTitleClassName}`}>{title}</h2>
      {description ? (
        <p className={`mt-3 ${sectionDescriptionClassName}`}>{description}</p>
      ) : null}
    </div>
  );
}
