import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Lightbulb, Filter } from "lucide-react";
import { codingPrompts, allTopics, difficultyColors } from "@/data/questions";

export default function CodingPage() {
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [revealedHints, setRevealedHints] = useState<Map<string, number>>(new Map());

  const filtered = codingPrompts.filter((c) => {
    if (selectedTopic !== "all" && c.topic !== selectedTopic) return false;
    if (selectedDifficulty !== "all" && c.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const toggleOpen = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const revealNextHint = (id: string, maxHints: number) => {
    setRevealedHints((prev) => {
      const next = new Map(prev);
      const current = next.get(id) || 0;
      if (current < maxHints) {
        next.set(id, current + 1);
      }
      return next;
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight" data-testid="text-coding-title">
            Hands-on Coding Prompts
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Practice coding challenges with starter code and progressive hints
          </p>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedTopic} onValueChange={setSelectedTopic}>
            <SelectTrigger className="w-44" data-testid="select-coding-topic-filter">
              <SelectValue placeholder="All Topics" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {allTopics.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-36" data-testid="select-coding-difficulty-filter">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground">
            {filtered.length} prompt{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="space-y-3">
          {filtered.map((c) => {
            const isOpen = openItems.has(c.id);
            const hintsRevealed = revealedHints.get(c.id) || 0;

            return (
              <Collapsible
                key={c.id}
                open={isOpen}
                onOpenChange={() => toggleOpen(c.id)}
              >
                <Card data-testid={`card-coding-${c.id}`}>
                  <CollapsibleTrigger className="w-full text-left">
                    <CardContent className="flex items-start gap-3 p-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs shrink-0">
                            {c.topic}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={`text-xs shrink-0 ${difficultyColors[c.difficulty]}`}
                          >
                            {c.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm font-semibold">{c.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {c.description}
                        </p>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </CardContent>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t px-4 pb-4 pt-3 space-y-4">
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Problem Description
                        </p>
                        <p className="text-sm leading-relaxed">{c.description}</p>
                      </div>

                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Constraints
                        </p>
                        <ul className="space-y-1">
                          {c.constraints.map((con, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Starter Code
                        </p>
                        <div className="overflow-x-auto rounded-md bg-muted p-3">
                          <pre className="text-xs leading-relaxed font-mono whitespace-pre">
                            <code>{c.starterCode}</code>
                          </pre>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Hints ({hintsRevealed}/{c.hints.length})
                          </p>
                          {hintsRevealed < c.hints.length && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                revealNextHint(c.id, c.hints.length);
                              }}
                              data-testid={`button-hint-${c.id}`}
                            >
                              <Lightbulb className="mr-1.5 h-3.5 w-3.5" />
                              Reveal Hint {hintsRevealed + 1}
                            </Button>
                          )}
                        </div>
                        {hintsRevealed > 0 ? (
                          <div className="space-y-2">
                            {c.hints.slice(0, hintsRevealed).map((hint, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 rounded-md bg-primary/5 p-3 text-sm"
                              >
                                <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                                <span>{hint}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-md bg-muted/50 p-3 text-center text-xs text-muted-foreground">
                            Try solving it first, then reveal hints progressively
                          </div>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      </div>
    </div>
  );
}
