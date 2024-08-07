import BreadcrumbNav from "@/components/breadcrumb-nav";
import { cn } from "@/lib/utils";

type HeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
  withBreadcrumb?: boolean;
  breadcrumbClassName?: string;
};

const Header = ({
  title,
  subtitle,
  className,
  withBreadcrumb,
  breadcrumbClassName,
}: HeaderProps) => {
  return (
    <div className={cn("text-white py-8", className)}>
      <h1 className="text-3xl md:text-4xl font-medium  mb-3">{title}</h1>
      {withBreadcrumb && (
        <div className={breadcrumbClassName}>
          <BreadcrumbNav />
        </div>
      )}
      <p className="text-sm text-muted">{subtitle}</p>
    </div>
  );
};

export default Header;
