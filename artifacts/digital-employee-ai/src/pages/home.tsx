import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { useStream } from "@/hooks/use-stream";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Copy, Download, RefreshCw, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type TaskType = 'social_media' | 'email' | 'summarize' | 'product_description' | 'customer_query';

export default function Home() {
  const [taskType, setTaskType] = useState<TaskType>('social_media');
  const [fields, setFields] = useState<Record<string, string>>({});
  const { generate, stop, clear, result, isLoading, error } = useStream();
  const { toast } = useToast();

  const handleGenerate = () => {
    generate(taskType, fields);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({ title: "Copied to clipboard", description: "The content has been copied to your clipboard." });
  };

  const downloadText = () => {
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `generated-${taskType}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateField = (name: string, value: string) => {
    setFields(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/20">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold font-mono">AI</span>
            </div>
            <span className="font-semibold tracking-tight">Digital Employee AI</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-5xl">
        <section className="mb-10 md:mb-16 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
            Your autonomous AI assistant for everyday business tasks.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Streamline your workflow with powerful, context-aware content generation. Select a task, provide the details, and let the AI do the heavy lifting.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <Tabs value={taskType} onValueChange={(v) => setTaskType(v as TaskType)} className="w-full">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Configuration</h2>
                  </div>
                  <TabsList className="grid grid-cols-2 md:grid-cols-3 h-auto gap-2 bg-transparent p-0 mb-6">
                    <TabsTrigger value="social_media" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border bg-muted/50 py-2">Social Post</TabsTrigger>
                    <TabsTrigger value="email" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border bg-muted/50 py-2">Email</TabsTrigger>
                    <TabsTrigger value="summarize" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border bg-muted/50 py-2">Summarize</TabsTrigger>
                    <TabsTrigger value="product_description" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border bg-muted/50 py-2">Product Desc.</TabsTrigger>
                    <TabsTrigger value="customer_query" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border bg-muted/50 py-2">Support</TabsTrigger>
                  </TabsList>
                  
                  <div className="space-y-4 min-h-[300px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={taskType}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {taskType === 'social_media' && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="productName">Product/Topic Name</Label>
                              <Input id="productName" placeholder="e.g., New AI Feature" value={fields.productName || ''} onChange={e => updateField('productName', e.target.value)} onKeyDown={handleKeyDown} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="targetAudience">Target Audience</Label>
                              <Input id="targetAudience" placeholder="e.g., Tech Founders" value={fields.targetAudience || ''} onChange={e => updateField('targetAudience', e.target.value)} onKeyDown={handleKeyDown} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Platform</Label>
                                <Select value={fields.platform} onValueChange={v => updateField('platform', v)}>
                                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Twitter">Twitter</SelectItem>
                                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                    <SelectItem value="Instagram">Instagram</SelectItem>
                                    <SelectItem value="Facebook">Facebook</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Tone</Label>
                                <Select value={fields.tone} onValueChange={v => updateField('tone', v)}>
                                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Professional">Professional</SelectItem>
                                    <SelectItem value="Casual">Casual</SelectItem>
                                    <SelectItem value="Humorous">Humorous</SelectItem>
                                    <SelectItem value="Inspirational">Inspirational</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        )}

                        {taskType === 'email' && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="recipient">Recipient</Label>
                              <Input id="recipient" placeholder="e.g., John (Investor)" value={fields.recipient || ''} onChange={e => updateField('recipient', e.target.value)} onKeyDown={handleKeyDown} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="purpose">Purpose</Label>
                              <Input id="purpose" placeholder="e.g., Follow up after meeting" value={fields.purpose || ''} onChange={e => updateField('purpose', e.target.value)} onKeyDown={handleKeyDown} />
                            </div>
                            <div className="space-y-2">
                              <Label>Tone</Label>
                              <Select value={fields.tone} onValueChange={v => updateField('tone', v)}>
                                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Professional">Professional</SelectItem>
                                  <SelectItem value="Formal">Formal</SelectItem>
                                  <SelectItem value="Friendly">Friendly</SelectItem>
                                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}

                        {taskType === 'summarize' && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Label htmlFor="textToSummarize">Text to Summarize</Label>
                                <span className="text-xs text-muted-foreground">{(fields.text || '').length} chars</span>
                              </div>
                              <Textarea id="textToSummarize" placeholder="Paste your text here..." className="min-h-[200px] resize-y" value={fields.text || ''} onChange={e => updateField('text', e.target.value)} />
                            </div>
                          </div>
                        )}

                        {taskType === 'product_description' && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="prodName">Product Name</Label>
                              <Input id="prodName" placeholder="e.g., Quantum Coffee Maker" value={fields.productName || ''} onChange={e => updateField('productName', e.target.value)} onKeyDown={handleKeyDown} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="features">Key Features</Label>
                              <Textarea id="features" placeholder="e.g., Auto-brew, 12 cups, app controlled..." className="min-h-[100px]" value={fields.features || ''} onChange={e => updateField('features', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="targetCustomers">Target Customers</Label>
                              <Input id="targetCustomers" placeholder="e.g., Coffee enthusiasts" value={fields.targetCustomers || ''} onChange={e => updateField('targetCustomers', e.target.value)} onKeyDown={handleKeyDown} />
                            </div>
                          </div>
                        )}

                        {taskType === 'customer_query' && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Label htmlFor="question">Customer Question/Issue</Label>
                                <span className="text-xs text-muted-foreground">{(fields.question || '').length} chars</span>
                              </div>
                              <Textarea id="question" placeholder="Paste the customer's message..." className="min-h-[200px]" value={fields.question || ''} onChange={e => updateField('question', e.target.value)} />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  
                  <div className="pt-6 mt-6 border-t">
                    <Button 
                      className="w-full h-12 text-base font-semibold" 
                      onClick={handleGenerate} 
                      disabled={isLoading}
                      data-testid="button-generate"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          AI is thinking...
                        </>
                      ) : (
                        "Generate Content"
                      )}
                    </Button>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7 flex flex-col h-full">
            <Card className="flex-1 flex flex-col border shadow-sm overflow-hidden bg-muted/20 relative min-h-[400px]">
              <div className="flex items-center justify-between border-b bg-background px-4 py-3">
                <h3 className="font-semibold text-sm">Output</h3>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyToClipboard} disabled={!result} title="Copy">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={downloadText} disabled={!result} title="Download">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleGenerate} disabled={!result || isLoading} title="Regenerate">
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={clear} disabled={!result && !error} title="Clear">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-0 flex-1 flex flex-col">
                {error && (
                  <div className="p-4">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Generation Failed</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </div>
                )}
                
                <div className="flex-1 p-6 overflow-y-auto">
                  {!result && !isLoading && !error && (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                        <span className="font-mono text-2xl font-bold">AI</span>
                      </div>
                      <p>Your generated content will appear here.</p>
                    </div>
                  )}
                  
                  {result && (
                    <div className="prose dark:prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap font-mono text-sm bg-transparent p-0 m-0 text-foreground">{result}</pre>
                    </div>
                  )}
                  
                  {isLoading && !result && (
                    <div className="h-full flex flex-col items-center justify-center space-y-4 text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm font-medium animate-pulse">Consulting the neural networks...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
