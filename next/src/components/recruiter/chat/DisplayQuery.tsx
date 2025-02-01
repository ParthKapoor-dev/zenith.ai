import React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";

interface StructuredDataPanelProps {
  data: Record<string, any>;
  query: string | null;
  onClose: () => void;
  isOpen: boolean; // New prop to control visibility
}

const StructuredDataPanel: React.FC<StructuredDataPanelProps> = ({
  data,
  query,
  onClose,
  isOpen,
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  console.log(data)

  const renderValue = (value: any) => {
    if (Array.isArray(value)) {
      return value.map((item, index) => (
        <Badge key={index} variant="secondary" className="mr-1 mb-1">
          {item}
        </Badge>
      ));
    }
    if (typeof value === "string")
      return (
        <Badge variant="secondary" className="mr-1 mb-1">
          {value}
        </Badge>
      );
    return "N/A";
  };

  const PanelContent = () => (
    <div className="space-y-4">
      {query && <div className="my-2 border-y-2 text-lg py-2">{query}</div>}
      <div>
        {Object.entries(data).map(
          ([key, value]) =>
            value !== null && (
              <div key={key} className="mb-3">
                <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">
                  {key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </h3>
                <div className="text-sm text-zinc-800 dark:text-zinc-200">
                  {renderValue(value)}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Job Requirements</SheetTitle>
          </SheetHeader>
          <Separator className="my-4" />
          <div className="overflow-y-auto h-[calc(100vh-8rem)]">
            <PanelContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className={`w-96 bg-white dark:bg-zinc-900 border-l dark:border-zinc-700 
        h-full overflow-hidden shadow-lg transition-all duration-300 ease-in-out`}
    >
      <Card className="h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CardTitle className="text-lg font-semibold">
            Job Requirements
          </CardTitle>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300
              transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>
        <Separator />
        <CardContent className="p-4 overflow-y-auto h-[calc(100vh-8rem)]">
          <PanelContent />
        </CardContent>
      </Card>
    </div>
  );
};

export default StructuredDataPanel;
