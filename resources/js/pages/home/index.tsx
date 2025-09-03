import { H1, P } from "@/components/ui/typography";
import TypewriterEffect from "typewriter-effect";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Head, Link } from "@inertiajs/react";

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


        </>
    )
}