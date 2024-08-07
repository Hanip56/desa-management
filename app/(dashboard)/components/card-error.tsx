import { Card } from "@/components/ui/card";
import { TriangleAlert } from "lucide-react";

const CardError = ({ error = "Terjadi kesalahan" }: { error?: string }) => {
  return (
    <Card className="mt-8 rounded-2xl h-80 overflow-hidden bg-primary-foreground flex justify-center items-center text-center text-red-500 p-2">
      <TriangleAlert className="w-12 h-12 mr-2" />
      <h2 className="font-bold text-xl lg:text-2xl">{error}</h2>
    </Card>
  );
};

export default CardError;
