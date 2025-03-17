import { Clock, File } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

interface Card02Props {
  name?: string;
  email?: string;
  image?: string;
  resume_link: string;
  rating?: number;
}

export default function ProfileCard({
  name,
  email,
  image,
  resume_link,
  rating,
}: Card02Props) {
  function handleUpdateAccount() {
    redirect("/update/resume");
  }

  return (
    <div className="relative w-full">
      <div
        className="relative overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80
                bg-white/90 dark:bg-purple-100/10 backdrop-blur-xl rounded-2xl shadow-md"
      >
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-2 ring-zinc-100 dark:ring-zinc-800">
                {image ? (
                  <Image
                    src={image}
                    alt={name || ""}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                    <span className="text-zinc-500 dark:text-zinc-400 text-xl font-semibold">
                      {name?.charAt(0) || "U"}
                    </span>
                  </div>
                )}
              </div>
              <div
                className="absolute -bottom-1 -right-1 p-1.5 rounded-lg
                                bg-emerald-50 dark:bg-emerald-900/50
                                text-emerald-600 dark:text-emerald-400
                                ring-2 ring-white dark:ring-zinc-900"
              >
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 w-full text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-2 sm:gap-0">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {name}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate max-w-full">
                    {email}
                  </p>
                </div>
                <div
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full
                                    bg-zinc-100 dark:bg-zinc-800 mb-2 sm:mb-0"
                >
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {rating}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-0 mt-3 sm:mt-4">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm">
                  <File className="w-4 h-4 flex-shrink-0" />
                  <Link
                    href={resume_link}
                    target="_blank"
                    className="hover:underline truncate max-w-[180px] sm:max-w-full"
                  >
                    Resume
                  </Link>
                </div>

                <Button
                  onClick={handleUpdateAccount}
                  className={cn(
                    "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white",
                    "hover:from-violet-700 hover:to-fuchsia-700",
                    "flex px-4 py-2 rounded-lg items-center",
                    "w-full sm:w-auto justify-center sm:justify-start",
                  )}
                >
                  Update Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
