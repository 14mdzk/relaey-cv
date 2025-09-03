import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { H3 } from "@/components/ui/typography";
import type AnalyzeResult from "@/types/api/analyze";
import { Copy, Github, Info } from "lucide-react";

export default function AnalyzeInformation({ result, onReset }: { result: AnalyzeResult, onReset: () => void }) {
    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'tinggi': return 'destructive';
            case 'sedang': return 'default';
            default: return 'default';
        }
    };

    const getColorBadge = (priority: string) => {
        switch (priority) {
            case 'tinggi': return 'bg-red-400 dark:bg-red-600';
            case 'sedang': return 'text-white bg-yellow-400 dark:bg-yellow-600';
            default: return 'text-white bg-green-400 dark:bg-green-600';
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Consider adding a toast notification for better UX
    };

    return (
        <div className="min-w-screen min-h-screen flex flex-col items-center justify-center gap-8 py-12 animate-fade-in">
            <div className="w-[60%] flex flex-col gap-8">
                <div className="text-center">
                    <H3>Analysis Complete</H3>
                    <p className="text-muted-foreground">Here's the breakdown of your CV's compatibility.</p>
                </div>

                <Card className="text-center">
                    <CardHeader>
                        <CardTitle>Compatibility Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-48 h-48 mx-auto">
                            <svg className="w-full h-full" viewBox="0 0 36 36" transform="rotate(-90 18 18)">
                                <path className="text-border" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                <path className="text-primary transition-all duration-1000 ease-out" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${result?.skor_kecocokan?.nilai}, 100`} strokeLinecap="round" />
                            </svg>
                            <div className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold">
                                {result?.skor_kecocokan?.nilai}<span className="text-2xl text-muted-foreground">%</span>
                            </div>
                        </div>
                        <p className="mt-12 text-muted-foreground max-w-md mx-auto">{result?.skor_kecocokan?.alasan}</p>
                    </CardContent>
                </Card>

                <Tabs defaultValue="improvements" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="improvements">CV Improvements</TabsTrigger>
                        <TabsTrigger value="keywords">Missing Keywords</TabsTrigger>
                        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                        <TabsTrigger value="updated-cv">Updated CV</TabsTrigger>
                    </TabsList>

                    <TabsContent value="improvements" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>CV Improvements</CardTitle>
                                <CardDescription>Actionable feedback to enhance your CV sections.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {result?.perbaikan?.map((item, index) => (
                                        <AccordionItem value={`item-${index}`} key={index}>
                                            <AccordionTrigger>{item.bagian}</AccordionTrigger>
                                            <AccordionContent>
                                                <p className="font-semibold text-destructive">Issue:</p>
                                                <p className="mb-2 text-muted-foreground">{item.masalah}</p>
                                                <p className="font-semibold text-primary">Suggestion:</p>
                                                <p className="text-muted-foreground">{item.saran}</p>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="keywords" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Missing Keywords</CardTitle>
                                <CardDescription>Keywords from the job description that are missing in your CV.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-2">
                                {result?.kata_kunci_hilang?.map((keyword, index) => (
                                    <Badge key={index} variant="secondary">{keyword}</Badge>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="recommendations" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Strategic Recommendations</CardTitle>
                                <CardDescription>High-level actions to improve your candidacy.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Theme</TableHead>
                                            <TableHead>Action</TableHead>
                                            <TableHead>Impact</TableHead>
                                            <TableHead className="text-right">Priority</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {result?.rekomendasi?.map((rec, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{rec.tema}</TableCell>
                                                <TableCell>{rec.aksi}</TableCell>
                                                <TableCell>{rec.dampak}</TableCell>
                                                <TableCell className="text-right"><Badge className={getColorBadge(rec.prioritas)} variant={getPriorityBadge(rec.prioritas)}>{rec.prioritas}</Badge></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="updated-cv" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>ATS-Friendly Updated CV</CardTitle>
                                <CardDescription>A revised version of your CV, optimized for Applicant Tracking Systems.</CardDescription>
                            </CardHeader>
                            <CardContent className="relative">
                                <Button size="sm" variant="outline" className="absolute top-6 right-4 z-10" onClick={() => copyToClipboard(result?.cv_diperbarui?.konten)}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy
                                </Button>
                                <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm max-h-[400px]">
                                    <code>{result?.cv_diperbarui?.konten}</code>
                                </pre>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {result?.catatan?.length > 0 && (
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Notes & Assumptions</AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc pl-5 mt-2">
                                {result?.catatan?.map((note, index) => (
                                    <li key={index}>{note}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                <Button onClick={onReset} variant="outline" className="w-full">Analyze Another</Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-16 animate-fade-up">
                <div className="flex items-center justify-center">
                    <Button onClick={() => window.open("https://github.com/14mdzk/relaey-cv", "_blank")} className="text-sm hover:cursor-pointer">
                        <Github className="h-4 w-4" />
                        <span className="">Source Code</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};