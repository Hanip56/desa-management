import { VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { IconType } from "react-icons/lib";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CountUp } from "@/components/count-up";
import { Skeleton } from "@/components/ui/skeleton";

const boxVariant = cva("shrink-0 rounded-md p-3", {
  variants: {
    variant: {
      default: "bg-blue-500/20",
      success: "bg-emerald-500/20",
      danger: "bg-rose-500/20",
      warning: "bg-yellow-500/20",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const iconVariant = cva("size-6", {
  variants: {
    variant: {
      default: "fill-blue-500",
      success: "fill-emerald-500",
      danger: "fill-rose-500",
      warning: "fill-yellow-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type BoxVariants = VariantProps<typeof boxVariant>;
type iconVariants = VariantProps<typeof iconVariant>;

interface DataCardProps extends BoxVariants, iconVariants {
  icon: IconType;
  title: string;
  value?: number;
}

export const DataCard = ({
  icon: Icon,
  title,
  value = 0,
  variant,
}: DataCardProps) => {
  return (
    <Card className="border-none drop-shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          {title}
          <Icon className={cn(iconVariant({ variant }))} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="font-bold text-2xl pb-1 break-all">
          +<CountUp preserveValue start={0} end={value} />
        </h3>
        <p className={"text-muted-foreground text-sm line-clamp-1"}>
          Perolehan data yang masuk
        </p>
      </CardContent>
    </Card>
  );
};

export const DataCardLoading = () => {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4 pb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="size-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="shrink-0 h-6 w-24 mb-2" />
        <Skeleton className="shrink-0 h-4 w-40" />
      </CardContent>
    </Card>
  );
};
