import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  ArrowDownLeft,
  PartyPopper,
  File,
  type LucideIcon,
} from "lucide-react";

interface Transaction {
  id: string;
  title: string;
  email: string;
  type: "incoming" | "outgoing";
  category: string;
  icon: LucideIcon;
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

interface List02Props {
  transactions?: Transaction[];
  className?: string;
}

const categoryStyles = {
  shopping:
    "from-violet-600/10 via-violet-600/5 to-violet-600/0 text-violet-700 dark:from-violet-500/20 dark:via-violet-500/10 dark:to-transparent dark:text-violet-400",
  food: "from-orange-600/10 via-orange-600/5 to-orange-600/0 text-orange-700 dark:from-orange-500/20 dark:via-orange-500/10 dark:to-transparent dark:text-orange-400",
  transport:
    "from-blue-600/10 via-blue-600/5 to-blue-600/0 text-blue-700 dark:from-blue-500/20 dark:via-blue-500/10 dark:to-transparent dark:text-blue-400",
  entertainment:
    "from-pink-600/10 via-pink-600/5 to-pink-600/0 text-pink-700 dark:from-pink-500/20 dark:via-pink-500/10 dark:to-transparent dark:text-pink-400",
};

const TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    title: "Welcome to Jobverse AI",
    email: "jobverse.ai@gmail.com",
    type: "incoming",
    category: "shopping",
    icon: PartyPopper,
    timestamp: "Today, 2:45 PM",
    status: "completed",
  },
  {
    id: "2",
    title: "Resume Uploaded",
    email: "jobverse.ai@gmail.com",
    type: "incoming",
    category: "transport",
    icon: File,
    timestamp: "Today, 9:00 AM",
    status: "completed",
  },
];

export default function List({
  transactions = TRANSACTIONS,
  className,
}: List02Props) {
  return (
    <div
      className={cn(
        "w-full md:!max-w-3xl mx-auto",
        "bg-white dark:bg-purple-100/10",
        "border border-zinc-100 dark:border-zinc-800",
        "rounded-3xl shadow-xl",
        className,
      )}
    >
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-zinc-800 dark:text-zinc-100 flex flex-col gap-1 sm:gap-2">
            Recent Notifications
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-500">
              {transactions.length} Messages
            </p>
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-500">
              This Month
            </span>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className={cn(
                "group relative flex items-start sm:items-center gap-3 sm:gap-4",
                "p-3 -mx-3 rounded-2xl",
                "transition-all duration-300 ease-out",
                "hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                "hover:shadow-sm",
                "border border-transparent",
                "hover:border-zinc-200 dark:hover:border-zinc-700/50",
              )}
            >
              <div
                className={cn(
                  "relative",
                  "w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center",
                  "rounded-2xl",
                  "bg-gradient-to-br",
                  categoryStyles[
                    transaction.category as keyof typeof categoryStyles
                  ],
                  "transition-all duration-300",
                  "group-hover:scale-105",
                  "group-hover:shadow-md",
                  "border border-zinc-200/50 dark:border-zinc-700/50",
                  "shadow-sm",
                  "flex-shrink-0",
                )}
              >
                <transaction.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between min-w-0 w-full">
                <div className="space-y-1 min-w-0 mb-2 sm:mb-0">
                  <h3 className="text-sm sm:text-base font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {transaction.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    {transaction.timestamp}
                  </p>
                </div>

                <div
                  className={cn(
                    "flex items-center gap-1 sm:gap-2 flex-shrink-0 sm:pl-4",
                    "transition-transform duration-300",
                    "group-hover:scale-105",
                  )}
                >
                  <span
                    className={cn(
                      "text-sm sm:text-base font-semibold truncate max-w-[200px]",
                      transaction.type === "incoming"
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-zinc-900 dark:text-zinc-100",
                    )}
                  >
                    {transaction.email}
                  </span>
                  {transaction.type === "incoming" ? (
                    <ArrowDownLeft className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-500 flex-shrink-0" />
                  ) : (
                    <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 sm:p-4 border-t border-zinc-100 dark:border-zinc-800">
        <button
          type="button"
          className="w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium
                    text-zinc-700 dark:text-zinc-400
                    hover:bg-zinc-50 dark:hover:bg-zinc-800
                    transition-colors duration-200"
        >
          No Other Notifications
        </button>
      </div>
    </div>
  );
}
