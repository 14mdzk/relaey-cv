import { H1, P } from "@/components/ui/typography";
import TypewriterEffect from "typewriter-effect";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Head, Link } from "@inertiajs/react";
import { Github } from "lucide-react";

export default function Home() {

    const [isTyping, setIsTyping] = useState(true);

    return (
        <>
            <Head title="Home" />
            <div className="min-h-screen flex items-center justify-center">
                <div>
                    <H1>
                        <TypewriterEffect onInit={(typewriter) => {
                            typewriter
                                .typeString("Achieve your career potential.")
                                .start()
                                .callFunction(() => setIsTyping(false))
                        }}
                        />
                    </H1>
                    <P className={isTyping ? "opacity-0" : "transition-opacity duration-[1.2s] ease-in opacity-100"}>Secure your CV for your dream jobs!</P>
                    <Button className={"mt-5 opacity-0" + (isTyping ? "" : "transition-opacity duration-[1.2s] ease-in opacity-100")}>
                        <Link href="/analyze">Start Now!</Link>
                    </Button>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-16 animate-fade-up">
                <div className="flex items-center justify-center">
                    <Button onClick={() => window.open("https://github.com/14mdzk/relaey-cv", "_blank")} className="text-sm hover:cursor-pointer">
                        <Github className="h-4 w-4" />
                        <span className="">Source Code</span>
                    </Button>
                </div>
            </div>
        </>
    )
}