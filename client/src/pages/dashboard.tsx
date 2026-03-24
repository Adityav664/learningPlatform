import { Link } from "wouter";
import { BookOpen, Code2, MessagesSquare, ChevronRight, Layers, Cpu, GitBranch, Leaf, Server, Database, Globe, BrainCircuit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { topicQuestions, codingPrompts, followUps, allTopics } from "@/data/questions";

const topicIcons: Record<string, React.ReactNode> = {
  Collections: <Layers className="h-4 w-4" />,
  JVM: <Cpu className="h-4 w-4" />,
  Concurrency: <GitBranch className="h-4 w-4" />,
  "Spring Boot": <Leaf className="h-4 w-4" />,
  Microservices: <Server className="h-4 w-4" />,
  "Database Design": <Database className="h-4 w-4" />,
  "System Design": <Globe className="h-4 w-4" />,
  "AI/ML Systems": <BrainCircuit className="h-4 w-4" />,
};

function StatCard({
  title,
  count,
  icon,
  href,
  description,
}: {
  title: string;
  count: number;
  icon: React.ReactNode;
  href: string;
  description: string;
}) {
  return (
    <Link href={href}>
      <Card className="group cursor-pointer transition-colors hover-elevate" data-testid={`card-stat-${title.toLowerCase().replace(/\s/g, "-")}`}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              {icon}
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div className="mt-4">
            <p className="text-2xl font-semibold tabular-nums">{count}</p>
            <p className="text-sm font-medium">{title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Dashboard() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <div className="mb-8">
          <h1 className="text-xl font-semibold tracking-tight" data-testid="text-dashboard-title">
            Mock Interview Prep
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Java Backend + System Design for 3 years experience
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            title="Topic Questions"
            count={topicQuestions.length}
            icon={<BookOpen className="h-5 w-5" />}
            href="/topics"
            description="Conceptual questions organized by topic and difficulty"
          />
          <StatCard
            title="Coding Prompts"
            count={codingPrompts.length}
            icon={<Code2 className="h-5 w-5" />}
            href="/coding"
            description="Hands-on coding challenges with starter code and hints"
          />
          <StatCard
            title="Follow-up Drills"
            count={followUps.length}
            icon={<MessagesSquare className="h-5 w-5" />}
            href="/followups"
            description="Realistic interviewer follow-up scenarios"
          />
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Topics Covered
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {allTopics.map((topic) => {
              const qCount = topicQuestions.filter((q) => q.topic === topic).length;
              const cCount = codingPrompts.filter((c) => c.topic === topic).length;
              const fCount = followUps.filter((f) => f.topic === topic).length;
              return (
                <Card key={topic} className="p-4" data-testid={`card-topic-${topic.toLowerCase().replace(/[\s/]/g, "-")}`}>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {topicIcons[topic]}
                    <span className="text-sm font-medium text-foreground">{topic}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="text-xs">{qCount} Q</Badge>
                    <Badge variant="secondary" className="text-xs">{cCount} Code</Badge>
                    <Badge variant="secondary" className="text-xs">{fCount} Follow</Badge>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
