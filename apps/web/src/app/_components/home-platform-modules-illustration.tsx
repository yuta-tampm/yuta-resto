import { BarChart3, Bell, FileCheck2, MessageCircle } from 'lucide-react';

export function PlatformModulesIllustration() {
  const floatingIcons = [
    {
      icon: BarChart3,
      className: 'left-5 top-9',
    },
    {
      icon: MessageCircle,
      className: 'left-1/2 top-0 -translate-x-1/2',
    },
    {
      icon: FileCheck2,
      className: 'right-6 top-9',
    },
    {
      icon: Bell,
      className: 'right-2 top-[5.7rem]',
    },
  ];

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto hidden h-44 w-56 lg:block"
    >
      <div className="absolute bottom-1 left-1/2 h-28 w-48 -translate-x-1/2 rounded-full bg-brand-100/70 blur-2xl" />
      {floatingIcons.map((item, index) => {
        const Icon = item.icon;
        return (
          <span
            key={index}
            className={`absolute z-40 grid h-8 w-8 place-items-center rounded-full border border-brand-100 bg-brand-50 shadow-sm ${item.className}`}
          >
            <Icon className="h-4 w-4 text-status-success stroke-[1.8]" />
          </span>
        );
      })}

      <div className="absolute bottom-0 left-1/2 z-10 h-16 w-40 -translate-x-1/2 drop-shadow-lg">
        <span className="absolute inset-0 bg-brand-50 [clip-path:polygon(50%_0%,100%_25%,50%_50%,0%_25%)]" />
        <span className="absolute inset-0 bg-brand-200 [clip-path:polygon(0%_25%,50%_50%,50%_100%,0%_75%)]" />
        <span className="absolute inset-0 bg-brand-100 [clip-path:polygon(100%_25%,50%_50%,50%_100%,100%_75%)]" />
      </div>

      <div className="absolute bottom-7 left-1/2 z-20 h-20 w-28 -translate-x-1/2 drop-shadow-md">
        <span className="absolute inset-0 bg-surface [clip-path:polygon(50%_0%,100%_25%,50%_50%,0%_25%)]" />
        <span className="absolute inset-0 bg-brand-100 [clip-path:polygon(0%_25%,50%_50%,50%_100%,0%_75%)]" />
        <span className="absolute inset-0 bg-brand-50 [clip-path:polygon(100%_25%,50%_50%,50%_100%,100%_75%)]" />
      </div>

      <div className="absolute bottom-[4.6rem] left-1/2 z-30 h-16 w-16 -translate-x-1/2 drop-shadow-lg">
        <span className="absolute inset-0 bg-brand-500 [clip-path:polygon(50%_0%,100%_25%,50%_50%,0%_25%)]" />
        <span className="absolute inset-0 bg-brand-700 [clip-path:polygon(0%_25%,50%_50%,50%_100%,0%_75%)]" />
        <span className="absolute inset-0 bg-brand-600 [clip-path:polygon(100%_25%,50%_50%,50%_100%,100%_75%)]" />
      </div>
    </div>
  );
}
