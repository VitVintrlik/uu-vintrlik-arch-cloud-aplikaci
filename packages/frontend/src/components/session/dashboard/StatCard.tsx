import { Card } from '@uu/kinetic-ui';

export type StatCardProps = {
  title: string;
  value: string | number;
  unit?: string;
  footerIcon: React.ReactNode;
  footerLabel: string;
  footerClassName?: string;
  bgIcon: React.ReactNode;
};

export const StatCard = ({
  title,
  value,
  unit,
  footerIcon,
  footerLabel,
  footerClassName,
  bgIcon,
}: StatCardProps) => (
  <Card className="bg-surface-container-high rounded-xl p-6 border-white/5 flex flex-col justify-between relative overflow-hidden group h-32">
    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
      {bgIcon}
    </div>
    <Card.Header className="border-b-0 pb-0 mb-0">
      <Card.Title className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] relative z-10 font-sans">
        {title}
      </Card.Title>
    </Card.Header>
    <Card.Content className="relative z-10 flex items-baseline gap-1 mt-auto">
      <span className="text-4xl font-black text-white tracking-tighter font-sans">{value}</span>
      {unit && <span className="text-lg font-bold text-primary-fixed font-sans">{unit}</span>}
    </Card.Content>
    <Card.Footer
      className={`mt-2 pt-0 border-t-0 flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest ${footerClassName}`}
    >
      {footerIcon}
      <span>{footerLabel}</span>
    </Card.Footer>
  </Card>
);
