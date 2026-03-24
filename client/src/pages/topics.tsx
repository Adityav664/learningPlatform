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
import { ChevronDown, Eye, EyeOff, Filter } from "lucide-react";
import { topicQuestions, allTopics, difficultyColors } from "@/data/questions";
import type { TopicCategory, Difficulty } from "@shared/schema";

export default function TopicsPage() {
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(new Set());
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const filtered = topicQuestions.filter((q) => {
    if (selectedTopic !== "all" && q.topic !== selectedTopic) return false;
    if (selectedDifficulty !== "all" && q.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const toggleAnswer = (id: string) => {
    setRevealedAnswers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleOpen = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight" data-testid="text-topics-title">
            Topic-wise Questions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Conceptual interview questions organized by topic and difficulty
          </p>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedTopic} onValueChange={setSelectedTopic}>
            <SelectTrigger className="w-44" data-testid="select-topic-filter">
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
            <SelectTrigger className="w-36" data-testid="select-difficulty-filter">
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
            {filtered.length} question{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="space-y-3">
          {filtered.map((q, idx) => {
            const isOpen = openItems.has(q.id);
            const isRevealed = revealedAnswers.has(q.id);

            return (
              <Collapsible
                key={q.id}
                open={isOpen}
                onOpenChange={() => toggleOpen(q.id)}
              >
                <Card data-testid={`card-question-${q.id}`}>
                  <CollapsibleTrigger className="w-full text-left">
                    <CardContent className="flex items-start gap-3 p-4">
                      <span className="mt-0.5 shrink-0 text-xs font-medium text-muted-foreground tabular-nums w-6">
                        {idx + 1}.
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs shrink-0">
                            {q.topic}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={`text-xs shrink-0 ${difficultyColors[q.difficulty]}`}
                          >
                            {q.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium leading-relaxed">
                          {q.question}
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
                      <div className="mb-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Key Points
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {q.keyPoints.map((kp, i) => (
                            <Badge key={i} variant="secondary" className="text-xs font-normal">
                              {kp}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Sample Answer
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAnswer(q.id);
                            }}
                            data-testid={`button-reveal-${q.id}`}
                          >
                            {isRevealed ? (
                              <>
                                <EyeOff className="mr-1.5 h-3.5 w-3.5" />
                                Hide
                              </>
                            ) : (
                              <>
                                <Eye className="mr-1.5 h-3.5 w-3.5" />
                                Reveal
                              </>
                            )}
                          </Button>
                        </div>
                        {isRevealed ? (
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {q.sampleAnswer}
                          </p>
                        ) : (
                          <div className="rounded-md bg-muted/50 p-3 text-center text-xs text-muted-foreground">
                            Try answering first, then reveal to compare
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
