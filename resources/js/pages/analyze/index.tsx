import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { H3 } from "@/components/ui/typography";
import { AlertCircleIcon, Briefcase, FileText, Github, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import axios from 'axios';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type AnalyzeResult from "@/types/api/analyze";
import AnalyzeInformation from "./result";
import { Head } from "@inertiajs/react";

export default function () {
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isActiveTab, setIsActiveTab] = useState("text");

    const [cvFile, setCvFile] = useState<File | null>(null);
    const [vacancyFile, setVacancyFile] = useState<File | null>(null);
    const [vacancyText, setVacancyText] = useState<string>("");

    const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);

    const [error, setError] = useState<string>("");
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

    const resetState = () => {
        setAnalyzeResult(null);
        setCvFile(null);
        setVacancyFile(null);
        setVacancyText("");
        setError("");
        setValidationErrors({});
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        const formData = new FormData();
        if (cvFile) {
            formData.append('cv', cvFile);
        }
        if (isActiveTab === "file") {
            formData.append('vacancy', vacancyFile || '');
        }

        if (isActiveTab === "text") {
            formData.append('vacancy', vacancyText);
        }

        try {
            const response = await axios.post('/api/analyze/upload', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setIsProcessing(true);
            setTimeout(
                () => {
                    setIsUploading(false);
                    handleProcess();
                },
                1650
            )
        } catch (err: any) {
            if (err.response?.data?.errors) {
                setValidationErrors(err.response.data.errors);
                setError('Please check your input');
            } else {
                setError(err.response?.data?.message || 'An error occurred');
            }
        }
    };

    const handleProcess = async () => {
        try {
            const processResponse = await axios.post('/api/analyze/process', {}, {
                withCredentials: true,
            });

            setAnalyzeResult(processResponse?.data?.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred');
        } finally {
            setIsProcessing(false);
        }
    }



    const handleFileChange = ({ target: { name, files } }: React.ChangeEvent<HTMLInputElement>) => {
        const file = files?.[0];
        if (file) {
            if (name === "cv") {
                setCvFile(file);
            } else if (name === "vacancy") {
                setVacancyFile(file);
            }
        }
    };

    const handleVacancyTextChange = useDebouncedCallback(
        ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
            setVacancyText(value)
        },
        475
    )

    const handleTabChange = (value: string) => {
        setIsActiveTab(value);
    };

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
    }, []);

    if (isUploading) {
        return (
            <>
                <Head title="Analyze" />
                <div className="min-w-screen min-h-screen flex flex-col items-center justify-center gap-4 animate-fade-in">
                    <H3>Uploading your documents...</H3>
                    <p className="text-muted-foreground">This may take a moment. Please wait.</p>
                </div>
            </>
        )
    }

    if (isProcessing) {
        return (
            <>
                <Head title="Analyze" />
                <div className="min-w-screen min-h-screen flex flex-col items-center justify-center gap-4 animate-fade-in">
                    <H3>Analyzing your documents...</H3>
                    <p className="text-muted-foreground">This may take a moment. Please wait.</p>
                </div>
            </>
        )
    }

    if (analyzeResult) {
        return <>
            <Head title="Result" />
            <AnalyzeInformation result={analyzeResult} onReset={resetState} />
        </>
    }

    return (
        <>
            <Head title="Analyze" />
            <form onSubmit={handleUpload} className="min-w-screen min-h-screen flex flex-col items-center justify-center gap-8">
                <div className={isLoading ? "opacity-0" : "transition-opacity duration-[0.5s] ease-in opacity-100"}>
                    <H3>Analyze your CV with your dream job!</H3>
                </div>
                <div className={"flex flex-col align-center w-[40%] justify-center gap-4 " + (isLoading ? "opacity-0" : "transition-opacity duration-[1.8s] ease-in opacity-100")}>
                    {error && (<Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertTitle>{error}</AlertTitle>
                    </Alert>)}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-4">
                                <FileText className="h-5 w-5" />
                                Upload CV
                            </CardTitle>
                            <CardDescription>Upload a file(PDF,RTF,TXT)</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[20vh]">
                            <div
                                className={
                                    "h-full border-2 py-8 border-dashed rounded-lg flex flex-col items-center justify-center text-center transition-colors cursor-pointer "
                                    + (validationErrors?.hasOwnProperty('cv') ? "border-destructive hover:border-destructive/50" : "border-border hover:border-primary/50")
                                }
                                onDrop={() => { }}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => document.querySelector("[name='cv']")?.click()}
                            >
                                <div>
                                    <Input type="file" name="cv" accept=".pdf,.rtf,.txt" className="hidden" onChange={handleFileChange} />
                                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                                </div>
                                {cvFile ? (
                                    <div>
                                        <p className="text-sm font-medium">{cvFile.name}</p>
                                        <p className="text-xs text-muted-foreground mt-1">Ready to be analyzed</p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Drop or Choose your briliant CV</p>
                                        <p className="text-xs text-muted-foreground mt-1">Max. 2MB</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            {
                                validationErrors?.hasOwnProperty('cv') && (
                                    validationErrors.cv.map((message, index) => (
                                        <ul className="text-destructive">
                                            <li key={index}><small>{message}</small></li>
                                        </ul>
                                    ))
                                )
                            }
                        </CardFooter>
                    </Card>
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between gap-2">
                                <div>
                                    <CardTitle className="flex items-center gap-4">
                                        <Briefcase className="h-5 w-5" />
                                        Job Description
                                    </CardTitle>
                                    <CardDescription>Type or Upload a file (PDF,RTF,TXT)</CardDescription>
                                </div>
                                <div>
                                    <Select value={isActiveTab} onValueChange={handleTabChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Text" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="text">Text</SelectItem>
                                            <SelectItem value="file">File</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="h-full">
                            <Tabs defaultValue="text" value={isActiveTab} className="h-[20vh]">
                                <TabsContent value="text" className="h-full">
                                    <Textarea name="vacancy" className={"h-full resize-none " + (validationErrors?.hasOwnProperty('vacancy') ? "border-destructive hover:border-destructive/50" : "hover:border-primary/50")} rows={5} onInput={handleVacancyTextChange} placeholder="Type your dream job description here" />
                                </TabsContent>
                                <TabsContent value="file" className="h-full">
                                    <div
                                        className={
                                            "h-full border-2 py-8 border-dashed rounded-lg flex flex-col items-center justify-center text-center transition-colors cursor-pointer "
                                            + (validationErrors?.hasOwnProperty('vacancy') ? "border-destructive hover:border-destructive/50" : "border-border hover:border-primary/50")
                                        }
                                        onDrop={() => { }}
                                        onDragOver={(e) => e.preventDefault()}
                                        onClick={() => document.querySelector("[name='vacancy']")?.click()}
                                    >
                                        <div>
                                            <Input type="file" name="vacancy" accept=".pdf,.rtf,.txt" className="hidden" onChange={handleFileChange} />
                                            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                                        </div>
                                        {vacancyFile ? (
                                            <div>
                                                <p className="text-sm font-medium">{vacancyFile.name}</p>
                                                <p className="text-xs text-muted-foreground mt-1">Ready to be analyzed</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Drop or Choose your dream job description</p>
                                                <p className="text-xs text-muted-foreground mt-1">Max. 2MB</p>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                        <CardFooter>
                            {
                                validationErrors?.hasOwnProperty('vacancy') && (
                                    validationErrors.vacancy.map((message, index) => (
                                        <ul key={"ul-" + index} className="text-destructive">
                                            <li key={"li-" + index}><small>{message}</small></li>
                                        </ul>
                                    ))
                                )
                            }
                        </CardFooter>
                    </Card>
                    <Button type="submit" disabled={isProcessing}>
                        {isProcessing ? 'Analyzing...' : 'Analyze Now!'}
                    </Button>
                </div>
            </form>
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