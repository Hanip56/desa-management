import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CardSkeleton = () => {
  return (
    <Card className="mt-8 rounded-2xl overflow-hidden">
      <CardHeader className="flex flex-col md:flex-row items-center gap-2 justify-between py-8">
        <Skeleton className="w-full md:w-60 h-10" />
        <div className="flex gap-2 items-center">
          <Skeleton className="w-10 h-10" />
          <Skeleton className="w-60 h-10" />
        </div>
      </CardHeader>
      <CardContent className="pb-10">
        <div className="flex flex-col md:flex-row gap-4 items-center md:items-end mb-4">
          <Skeleton className="w-full md:w-96 h-10" />
          <Skeleton className="w-full md:w-36 h-10" />
        </div>
        <Skeleton className="w-full md:w-full h-96" />
      </CardContent>
    </Card>
  );
};

export default CardSkeleton;
