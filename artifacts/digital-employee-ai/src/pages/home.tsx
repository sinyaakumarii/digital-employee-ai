import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Markdown from "react-markdown";
import * as Icons from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useStream } from "@/hooks/use-stream";
import { useToast } from "@/hooks/use-toast";
import { useDEAIState } from "@/hooks/use-deai-state";
import { CONTENT_TYPES, AI_ACTIONS, TaskType, ContentType } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

function IconRenderer({ name, className }: { name: string, className?: string }) {
  const Icon = (Icons as any)[name] || Icons.HelpCircle;
  return <Icon className={className} />;
}

export default function Home() {
  const { toast } = useToast();
  const {
    settings, setSettings,
    history, addHistory, deleteHistory, clearHistory,
    stats, updateStats,
    lastContentType, updateLastContentType
  } = useDEAIState();

  const [activeType, setActiveType] = useState<ContentType>(
    CONTENT_TYPES.find(c => c.id === lastContentType) || CONTENT_TYPES[0]
  );
  
  const [fields, setFields] = useState<Record<string, string>>(activeType.preset);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState("");
  
  const { generate, stop, clear, result, isLoading, error, setResult } = useStream();

  const prevResultRef = useRef("");

  useEffect(() => {
    if (!isLoading && result && result !== prevResultRef.current) {
      prevResultRef.current = result;
      const wordCount = result.trim().split(/\s+/).filter(Boolean).length;
      updateStats(wordCount);
      addHistory({
        contentTypeId: activeType.id,
        result,
        fields,
        taskType: activeType.taskType,
      });
    }
  }, [isLoading, result]);

  const handleSelectType = (ct: ContentType) => {
    setActiveType(ct);
    updateLastContentType(ct.id);
    setFields(ct.preset);
    clear();
  };

  const handleGenerate = () => {
    const payload = {
      ...fields,
      temperature: settings.temperature.toString(),
      maxTokens: settings.maxTokens.toString(),
      outputLength: settings.outputLength,
    };
    generate(activeType.taskType, payload);
  };

  const handleActionGenerate = (modifier: string) => {
    const payload = {
      ...fields,
      modifier: `\n\nRewrite or modify the previous output with this instruction: ${modifier}`,
      previousOutput: result, // Add previous result to context if backend uses all fields
      temperature: settings.temperature.toString(),
      maxTokens: settings.maxTokens.toString(),
      outputLength: settings.outputLength,
    };
    generate(activeType.taskType, payload);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const copyToClipboard = (text: string = result) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Content copied to clipboard." });
  };

  const downloadTxt = () => {
    if (!result) return;
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deai-${activeType.id}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded", description: "Text file saved successfully." });
  };

  const downloadMd = () => {
    if (!result) return;
    const blob = new Blob([result], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deai-${activeType.id}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded", description: "Markdown file saved successfully." });
  };

  const downloadPdf = () => {
    if (!result) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Digital Employee AI — ${activeType.label}</title><style>body{font-family:Inter,sans-serif;max-width:800px;margin:40px auto;padding:0 24px;line-height:1.6;color:#111}pre{white-space:pre-wrap;word-break:break-word}</style></head><body><h2>${activeType.label}</h2><pre>${result.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></body></html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 300);
    toast({ title: "Print dialog opened", description: "Save as PDF from the print dialog." });
  };

  const updateField = (name: string, value: string) => {
    setFields(prev => ({ ...prev, [name]: value }));
  };

  const renderFormFields = () => {
    switch (activeType.taskType) {
      case 'social_media':
        return (
          <>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="productName">Topic or Product</Label>
              </div>
              <Input id="productName" value={fields.productName || ''} onChange={e => updateField('productName', e.target.value)} onKeyDown={handleKeyDown} placeholder="e.g. Acme CRM Launch" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input id="targetAudience" value={fields.targetAudience || ''} onChange={e => updateField('targetAudience', e.target.value)} onKeyDown={handleKeyDown} placeholder="e.g. Startup Founders" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Input value={fields.platform || ''} onChange={e => updateField('platform', e.target.value)} placeholder="e.g. LinkedIn" />
              </div>
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={fields.tone || 'Professional'} onValueChange={v => updateField('tone', v)}>
                  <SelectTrigger><SelectValue placeholder="Select tone" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Casual">Casual</SelectItem>
                    <SelectItem value="Humorous">Humorous</SelectItem>
                    <SelectItem value="Inspirational">Inspirational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
      case 'email':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input id="recipient" value={fields.recipient || ''} onChange={e => updateField('recipient', e.target.value)} onKeyDown={handleKeyDown} placeholder="e.g. John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Input id="purpose" value={fields.purpose || ''} onChange={e => updateField('purpose', e.target.value)} onKeyDown={handleKeyDown} placeholder="e.g. Follow up on Tuesday's meeting" />
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={fields.tone || 'Professional'} onValueChange={v => updateField('tone', v)}>
                <SelectTrigger><SelectValue placeholder="Select tone" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case 'summarize':
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="text">Text to Process</Label>
              <span className="text-xs text-muted-foreground font-mono">{(fields.text || '').length} chars</span>
            </div>
            <Textarea id="text" className="min-h-[200px]" value={fields.text || ''} onChange={e => updateField('text', e.target.value)} placeholder="Paste your text here..." />
          </div>
        );
      case 'product_description':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input id="productName" value={fields.productName || ''} onChange={e => updateField('productName', e.target.value)} onKeyDown={handleKeyDown} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="features">Key Features</Label>
                <span className="text-xs text-muted-foreground font-mono">{(fields.features || '').length} chars</span>
              </div>
              <Textarea id="features" className="min-h-[100px]" value={fields.features || ''} onChange={e => updateField('features', e.target.value)} placeholder="List main features, comma separated..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetCustomers">Target Customers</Label>
              <Input id="targetCustomers" value={fields.targetCustomers || ''} onChange={e => updateField('targetCustomers', e.target.value)} onKeyDown={handleKeyDown} />
            </div>
          </>
        );
      case 'customer_query':
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="question">Customer Message</Label>
              <span className="text-xs text-muted-foreground font-mono">{(fields.question || '').length} chars</span>
            </div>
            <Textarea id="question" className="min-h-[200px]" value={fields.question || ''} onChange={e => updateField('question', e.target.value)} placeholder="Paste customer email or message..." />
          </div>
        );
    }
  };

  const filteredHistory = history.filter(h => 
    CONTENT_TYPES.find(c => c.id === h.contentTypeId)?.label.toLowerCase().includes(searchHistory.toLowerCase()) ||
    h.result.toLowerCase().includes(searchHistory.toLowerCase())
  );

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/20">
      {/* HEADER */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <Icons.Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg tracking-tight hidden sm:inline-block">Digital Employee AI</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground font-medium">
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-wider opacity-70">Today</span>
                <span className="text-foreground">{stats.todayGenerations} Gens</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-wider opacity-70">Words</span>
                <span className="text-foreground">{stats.wordsGenerated.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Icons.History className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
                  <SheetHeader className="p-6 border-b">
                    <SheetTitle>Generation History</SheetTitle>
                    <div className="relative mt-2">
                      <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search history..." 
                        className="pl-9 bg-muted/50" 
                        value={searchHistory}
                        onChange={e => setSearchHistory(e.target.value)}
                      />
                    </div>
                  </SheetHeader>
                  <ScrollArea className="flex-1 p-4">
                    {filteredHistory.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Icons.Inbox className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>No history found.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredHistory.map((item) => {
                          const ct = CONTENT_TYPES.find(c => c.id === item.contentTypeId);
                          return (
                            <div key={item.id} className="group flex flex-col gap-2 p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                  {ct && <IconRenderer name={ct.icon} className="h-4 w-4 text-primary" />}
                                  {ct?.label || 'Unknown'}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(item.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                {item.result}
                              </p>
                              <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="secondary" className="h-8 flex-1" onClick={() => {
                                  if (ct) {
                                    handleSelectType(ct);
                                    setFields(item.fields);
                                    setResult(item.result);
                                  }
                                }}>Load Fields</Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => copyToClipboard(item.result)}>
                                  <Icons.Copy className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => deleteHistory(item.id)}>
                                  <Icons.Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Input & Config */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Selector Grid */}
            <div className="bg-card border rounded-2xl p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between px-1">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Select Task</h2>
              </div>
              <ScrollArea className="h-[220px] pr-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CONTENT_TYPES.map(ct => (
                    <button
                      key={ct.id}
                      onClick={() => handleSelectType(ct)}
                      className={`flex flex-col items-center justify-center p-3 gap-2 text-center rounded-xl border transition-all duration-200 ${
                        activeType.id === ct.id 
                          ? 'bg-primary/10 border-primary/50 text-primary shadow-sm' 
                          : 'bg-muted/30 border-transparent hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <IconRenderer name={ct.icon} className={`h-5 w-5 ${activeType.id === ct.id ? 'text-primary' : 'opacity-70'}`} />
                      <span className="text-[11px] font-medium leading-tight">{ct.label}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Dynamic Form */}
            <Card className="shadow-sm border-0 ring-1 ring-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <IconRenderer name={activeType.icon} className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">{activeType.label}</h2>
                    <p className="text-xs text-muted-foreground">Fill in the details below to generate.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeType.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-5"
                    >
                      {renderFormFields()}
                    </motion.div>
                  </AnimatePresence>

                  {/* Advanced Settings */}
                  <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen} className="border rounded-xl mt-6">
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 font-medium text-sm hover:bg-muted/50 transition-colors rounded-xl">
                      <div className="flex items-center gap-2">
                        <Icons.SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                        Advanced Settings
                      </div>
                      <Icons.ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isAdvancedOpen ? 'rotate-180' : ''}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 pt-0 space-y-6">
                      <div className="space-y-3 pt-2">
                        <div className="flex justify-between">
                          <Label className="text-xs">Temperature ({settings.temperature})</Label>
                        </div>
                        <Slider 
                          value={[settings.temperature]} 
                          max={1} step={0.1} 
                          onValueChange={v => setSettings({...settings, temperature: v[0]})} 
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Label className="text-xs">Max Tokens ({settings.maxTokens})</Label>
                        </div>
                        <Slider 
                          value={[settings.maxTokens]} 
                          max={2048} min={256} step={128} 
                          onValueChange={v => setSettings({...settings, maxTokens: v[0]})} 
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-xs">Target Length</Label>
                        <RadioGroup 
                          value={settings.outputLength} 
                          onValueChange={v => setSettings({...settings, outputLength: v as any})}
                          className="flex gap-4"
                        >
                          {['Short', 'Medium', 'Long'].map(len => (
                            <div key={len} className="flex items-center space-x-2">
                              <RadioGroupItem value={len} id={`len-${len}`} />
                              <Label htmlFor={`len-${len}`} className="text-xs font-normal cursor-pointer">{len}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Button 
                    className="w-full h-12 text-base font-semibold shadow-sm" 
                    onClick={handleGenerate} 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Icons.Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Icons.Zap className="mr-2 h-5 w-5" />
                        Generate Content
                      </>
                    )}
                  </Button>
                  <p className="text-center text-[10px] text-muted-foreground">Press <kbd className="font-sans px-1 rounded bg-muted">Ctrl</kbd> + <kbd className="font-sans px-1 rounded bg-muted">Enter</kbd> to generate</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: Output Panel */}
          <div className="lg:col-span-7 flex flex-col h-full min-h-[600px]">
            <Card className="flex-1 flex flex-col shadow-sm border-0 ring-1 ring-border overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between border-b bg-muted/20 px-4 py-3">
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Icons.FileText className="h-4 w-4 text-primary" />
                    Result
                  </h3>
                  {result && !isLoading && (
                    <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground border-l pl-4 font-mono">
                      <span>{result.trim().split(/\s+/).filter(Boolean).length} words</span>
                      <span>{result.length} chars</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard()} disabled={!result}>
                          <Icons.Copy className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleGenerate} disabled={!result || isLoading}>
                          <Icons.RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Regenerate</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={downloadTxt} disabled={!result}>
                          <Icons.FileDown className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download TXT</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={downloadMd} disabled={!result}>
                          <Icons.Code className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download Markdown</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={downloadPdf} disabled={!result}>
                          <Icons.FileText className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download PDF</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              
              <div className="flex-1 relative flex flex-col bg-background">
                {error && (
                  <div className="p-4 m-4 border border-destructive/50 bg-destructive/10 rounded-xl text-destructive text-sm flex items-start gap-3">
                    <Icons.AlertTriangle className="h-5 w-5 shrink-0" />
                    <div>
                      <span className="font-semibold block mb-1">Generation Error</span>
                      {error}
                    </div>
                  </div>
                )}
                
                <ScrollArea className="flex-1 p-6 lg:p-8 prose-container">
                  {!result && !isLoading && !error && (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-60 py-20">
                      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6 ring-1 ring-border shadow-inner">
                        <Icons.Cpu className="h-8 w-8 text-primary/60" />
                      </div>
                      <p className="font-medium text-foreground mb-1">Ready for instructions</p>
                      <p className="text-sm">Select a task and click generate to begin.</p>
                    </div>
                  )}
                  
                  {result && (
                    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-semibold">
                      <Markdown>{result}</Markdown>
                    </div>
                  )}
                  
                  {isLoading && !result && (
                    <div className="space-y-4 max-w-2xl py-4">
                      <div className="h-4 bg-muted rounded-md w-3/4 animate-pulse" />
                      <div className="h-4 bg-muted rounded-md w-full animate-pulse" />
                      <div className="h-4 bg-muted rounded-md w-5/6 animate-pulse" />
                      <div className="h-4 bg-muted rounded-md w-full animate-pulse" />
                      <div className="h-4 bg-muted rounded-md w-2/3 animate-pulse" />
                      <div className="flex items-center gap-3 pt-4 text-sm text-primary font-medium animate-pulse">
                        <Icons.Sparkles className="h-4 w-4" />
                        Drafting response...
                      </div>
                    </div>
                  )}
                  
                  {isLoading && result && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <Icons.Loader2 className="h-4 w-4 animate-spin" />
                      <span className="animate-pulse">Typing...</span>
                    </div>
                  )}
                </ScrollArea>
              </div>

              {/* AI Actions Footer */}
              {result && !isLoading && (
                <div className="border-t bg-muted/10 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Icons.Wand2 className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Polish Actions</span>
                  </div>
                  <ScrollArea className="pb-2">
                    <div className="flex items-center gap-2 w-max">
                      {AI_ACTIONS.map(action => (
                        <Button 
                          key={action.label} 
                          variant="outline" 
                          size="sm" 
                          className="h-8 rounded-full text-xs bg-background hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-colors"
                          onClick={() => handleActionGenerate(action.modifier)}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
