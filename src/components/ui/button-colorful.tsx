import { Button } from "./button";
import { cn } from "./utils";
import { ArrowUpRight } from "lucide-react";

interface ButtonColorfulProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
}

export function ButtonColorful({
    className,
    label = "Explore",
    ...props
}: ButtonColorfulProps) {
    return (
        <div className="relative inline-flex group/btn">
            {/* Persistent glow halo — uses exact site brand colors, sharpens on hover */}
            <div
                className="absolute -inset-[3px] rounded-xl opacity-50 blur group-hover/btn:opacity-90 group-hover/btn:blur-md transition-all duration-500"
                style={{
                    background: 'linear-gradient(to right, #1A56DB, #38bdf8, #00A63E)',
                }}
            />

            <Button
                className={cn(
                    "relative h-12 px-8 text-base font-semibold overflow-hidden rounded-xl",
                    "bg-[#0d1f3c] hover:bg-[#0d1f3c]",
                    "border-0 transition-all duration-300",
                    className
                )}
                {...props}
            >
                {/* Inner gradient wash — gives depth matching site blue→green palette */}
                <div
                    className="absolute inset-0 opacity-25 group-hover/btn:opacity-50 transition-opacity duration-500"
                    style={{
                        background: 'linear-gradient(to right, #1A56DB, #38bdf8, #00A63E)',
                    }}
                />

                {/* Label + icon */}
                <div className="relative flex items-center gap-2">
                    <span className="text-white font-semibold tracking-wide">{label}</span>
                    <ArrowUpRight
                        className="w-4 h-4 text-white/90 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300"
                    />
                </div>
            </Button>
        </div>
    );
}
