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
import { ChevronDown, MessageCircle, ChevronRight, Eye, EyeOff, Filter } from "lucide-react";
import { followUps, allTopics } from "@/data/questions";

export default function FollowupsPage() {
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [revealedFollowUps, setRevealedFollowUps] = useState<Map<string, Set<number>>>(new Map());

  const filtered = followUps.filter((f) => {
    if (selectedTopic !== "all" && f.topic !== selectedTopic) return false;
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

  const toggleFollowUpReveal = (scenarioId: string, followUpIndex: number) => {
    setRevealedFollowUps((prev) => {
      const next = new Map(prev);
      const currentSet = next.get(scenarioId) || new Set();
      const newSet = new Set(currentSet);
      if (newSet.has(followUpIndex)) {
        newSet.delete(followUpIndex);
      } else {
        newSet.add(followUpIndex);
      }
      next.set(scenarioId, newSet);
      return next;
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight" data-testid="text-followups-title">
            Interviewer Follow-ups
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Realistic interview scenarios with progressive follow-up questions
          </p>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedTopic} onValueChange={setSelectedTopic}>
            <SelectTrigger className="w-44" data-testid="select-followup-topic-filter">
              <SelectValue placeholder="All Topics" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {allTopics.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground">
            {filtered.length} scenario{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="space-y-3">
          {filtered.map((f) => {
            const isOpen = openItems.has(f.id);
            const revealed = revealedFollowUps.get(f.id) || new Set();

            return (
              <Collapsible
                key={f.id}
                open={isOpen}
                onOpenChange={() => toggleOpen(f.id)}
              >
                <Card data-testid={`card-followup-${f.id}`}>
                  <CollapsibleTrigger className="w-full text-left">
                    <CardContent className="flex items-start gap-3 p-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs shrink-0">
                            {f.topic}
                          </Badge>
                          <Badge variant="secondary" className="text-xs shrink-0">
                            {f.followUps.length} follow-ups
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {f.scenario}
                        </p>
                        <p className="text-sm font-medium leading-relaxed">
                          {f.initialQuestion}
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
                    <div className="border-t px-4 pb-4 pt-3">
                      <div className="mb-3 rounded-md bg-muted/50 p-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Scenario Context
                        </p>
                        <p className="text-sm">{f.scenario}</p>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-start gap-2 mb-3">
                          <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <div>
                            <p className="text-xs font-medium text-primary mb-0.5">Interviewer Opens With</p>
                            <p className="text-sm font-medium">{f.initialQuestion}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Follow-up Chain
                        </p>
                        {f.followUps.map((fu, i) => {
                          const isRevealed = revealed.has(i);
                          return (
                            <div
                              key={i}
                              className="rounded-md border bg-card p-3"
                              data-testid={`followup-item-${f.id}-${i}`}
                            >
                              <div className="flex items-start gap-2">
                                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                  {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start gap-2 mb-2">
                                    <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                                    <p className="text-sm font-medium">{fu.question}</p>
                                  </div>
                                  <div className="ml-5">
                                    <div className="flex items-center justify-between mb-1">
                                      <p className="text-xs text-muted-foreground">
                                        What the interviewer expects
                                      </p>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleFollowUpReveal(f.id, i);
                                        }}
                                        data-testid={`button-reveal-followup-${f.id}-${i}`}
                                      >
                                        {isRevealed ? (
                                          <>
                                            <EyeOff className="mr-1 h-3 w-3" />
                                            Hide
                                          </>
                                        ) : (
                                          <>
                                            <Eye className="mr-1 h-3 w-3" />
                                            Show
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                    {isRevealed ? (
                                      <p className="text-sm leading-relaxed text-muted-foreground">
                                        {fu.expectation}
                                      </p>
                                    ) : (
                                      <div className="rounded bg-muted/50 p-2.5 text-center text-xs text-muted-foreground">
                                        Think through your answer, then reveal the expectation
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
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
