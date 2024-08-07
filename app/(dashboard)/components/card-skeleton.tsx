import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CardSkeleton = () => {
  return (
    <Card className="mt-8 rounded-2xl overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row justify-between py-8">
        <Skeleton className="w-full sm:w-60 h-10" />
        <Skeleton className="w-full sm:w-60 h-10" />
      </CardHeader>
      <CardContent className="pb-10">
        <Skeleton className="w-full sm:w-96 h-10 mb-4" />
        <Skeleton className="w-full sm:w-full h-60" />
      </CardContent>
    </Card>
  );
};

export default CardSkeleton;
