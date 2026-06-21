"use client";

import * as React from "react";
import {
  CalendarDays,
  Check,
  FileText,
  Image as ImageIcon,
  Link2,
  Paperclip,
  Plus,
  Send,
  Sheet as SheetIcon,
  UserPlus,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  BOARD_STATUSES,
  CircularProgress,
  PRIORITY_LABEL,
  PriorityGlyph,
  StatusGlyph,
} from "@/components/domain/tasks/board-meta";
import {
  BOARD_PEOPLE,
  labelById,
  personById,
  progressOf,
  type Attachment,
  type TimelineEvent,
} from "@/data/tasks-board";
import { useTasksBoardStore } from "@/data/tasks-board-store";

const DUE_PRESETS = ["Jun 21", "Jun 22", "Jun 25", "Jun 30", "Jul 7"];

export function TaskDetailSheet() {
  const selectedId = useTasksBoardStore((s) => s.selectedTaskId);
  const tasks = useTasksBoardStore((s) => s.tasks);
  const closeTask = useTasksBoardStore((s) => s.closeTask);
  const moveTask = useTasksBoardStore((s) => s.moveTask);
  const toggleSubtodo = useTasksBoardStore((s) => s.toggleSubtodo);
  const addSubtodo = useTasksBoardStore((s) => s.addSubtodo);
  const toggleAssignee = useTasksBoardStore((s) => s.toggleAssignee);
  const setDueDate = useTasksBoardStore((s) => s.setDueDate);
  const addComment = useTasksBoardStore((s) => s.addComment);

  const task = tasks.find((t) => t.id === selectedId) ?? null;
  const [subDraft, setSubDraft] = React.useState("");
  const [comment, setComment] = React.useState("");

  const progress = task ? progressOf(task) : { completed: 0, total: 0 };
  const pct = progress.total ? (progress.completed / progress.total) * 100 : 0;
  const statusMeta = task ? BOARD_STATUSES.find((s) => s.id === task.statusId) : undefined;

  return (
    <Sheet open={Boolean(task)} onOpenChange={(o) => !o && closeTask()}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-[560px]">
        {task && (
          <>
            <SheetHeader className="border-b px-5 py-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono">{task.id}</span>
                {task.priority !== "no-priority" && task.priority !== "low" && (
                  <span className="inline-flex items-center gap-1">
                    <PriorityGlyph priority={task.priority} className="size-3.5 text-current" />
                    {PRIORITY_LABEL[task.priority]}
                  </span>
                )}
              </div>
              <SheetTitle className="flex items-start gap-2 text-base leading-snug">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm bg-muted">
                  <StatusGlyph statusId={task.statusId} />
                </span>
                {task.title}
              </SheetTitle>
            </SheetHeader>

            <ScrollArea className="min-h-0 flex-1">
              <div className="space-y-6 px-5 py-4">
                {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}

                {/* Properties */}
                <div className="grid grid-cols-[100px_1fr] items-center gap-x-3 gap-y-3 text-sm">
                  <PropLabel>Status</PropLabel>
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 gap-1.5">
                          <StatusGlyph statusId={task.statusId} />
                          {statusMeta?.name}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {BOARD_STATUSES.map((s) => (
                          <DropdownMenuItem key={s.id} onClick={() => moveTask(task.id, s.id)} className="gap-2">
                            <StatusGlyph statusId={s.id} />
                            <span className="flex-1">{s.name}</span>
                            {s.id === task.statusId && <Check className="size-4" />}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <PropLabel>Assigned to</PropLabel>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {task.assigneeIds.map((id) => {
                      const p = personById(id);
                      return (
                        <span key={id} className="inline-flex items-center gap-1.5 rounded-full border bg-card py-0.5 pl-0.5 pr-2 text-xs">
                          <Avatar className="size-5">
                            <AvatarFallback className="text-[9px]">{p?.initials}</AvatarFallback>
                          </Avatar>
                          {p?.name.split(" ")[0]}
                        </span>
                      );
                    })}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
                          <UserPlus className="size-3.5" /> Tag people
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuLabel className="text-xs text-muted-foreground">Team</DropdownMenuLabel>
                        {BOARD_PEOPLE.map((p) => {
                          const on = task.assigneeIds.includes(p.id);
                          return (
                            <DropdownMenuItem key={p.id} onClick={(e) => { e.preventDefault(); toggleAssignee(task.id, p.id); }} className="gap-2">
                              <Avatar className="size-5">
                                <AvatarFallback className="text-[9px]">{p.initials}</AvatarFallback>
                              </Avatar>
                              <span className="flex-1">{p.name}</span>
                              {on && <Check className="size-4" />}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <PropLabel>Due date</PropLabel>
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs font-normal">
                          <CalendarDays className="size-3.5" />
                          {task.dueDate ?? "No due date"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {DUE_PRESETS.map((d) => (
                          <DropdownMenuItem key={d} onClick={() => setDueDate(task.id, d)} className="gap-2">
                            <CalendarDays className="size-3.5" /> {d}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {task.labelIds.length > 0 && (
                    <>
                      <PropLabel>Labels</PropLabel>
                      <div className="flex flex-wrap gap-1.5">
                        {task.labelIds.map((id) => {
                          const l = labelById(id);
                          return l ? (
                            <Badge key={id} variant="secondary" className={cn("px-1.5 py-0.5 text-[10px] font-medium", l.className)}>
                              {l.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </>
                  )}
                </div>

                <Separator />

                {/* Sub-todos */}
                <section>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-sm font-medium">
                      Sub-tasks
                      {progress.total > 0 && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CircularProgress value={pct} size={14} />
                          {progress.completed}/{progress.total}
                        </span>
                      )}
                    </h3>
                  </div>
                  <ul className="space-y-1">
                    {task.subtodos.map((st) => (
                      <li key={st.id} className="flex items-center gap-2.5 rounded-md px-1 py-1.5 hover:bg-accent/50">
                        <Checkbox checked={st.done} onCheckedChange={() => toggleSubtodo(task.id, st.id)} id={`st-${st.id}`} />
                        <label htmlFor={`st-${st.id}`} className={cn("flex-1 cursor-pointer text-sm", st.done && "text-muted-foreground line-through")}>
                          {st.title}
                        </label>
                      </li>
                    ))}
                  </ul>
                  <form
                    className="mt-2 flex items-center gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (subDraft.trim()) {
                        addSubtodo(task.id, subDraft.trim());
                        setSubDraft("");
                      }
                    }}
                  >
                    <Plus className="size-4 text-muted-foreground" />
                    <Input
                      value={subDraft}
                      onChange={(e) => setSubDraft(e.target.value)}
                      placeholder="Add a sub-task…"
                      className="h-8 text-sm"
                    />
                  </form>
                </section>

                <Separator />

                {/* Attachments */}
                <section>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-medium">Attachments</h3>
                    <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs text-muted-foreground" disabled title="Simulated">
                      <Paperclip className="size-3.5" /> Add
                    </Button>
                  </div>
                  {task.attachments.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No attachments.</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {task.attachments.map((a) => (
                        <li key={a.id} className="flex items-center gap-2.5 rounded-md border px-2.5 py-2">
                          <AttachmentIcon kind={a.kind} />
                          <span className="min-w-0 flex-1 truncate text-sm">{a.name}</span>
                          <span className="text-xs text-muted-foreground">{a.meta}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <Separator />

                {/* Timeline */}
                <section>
                  <h3 className="mb-2 text-sm font-medium">Timeline</h3>
                  <ol className="space-y-0">
                    {task.timeline.map((ev, i) => (
                      <TimelineRow key={ev.id} ev={ev} last={i === task.timeline.length - 1} />
                    ))}
                  </ol>
                </section>
              </div>
            </ScrollArea>

            {/* Comment composer */}
            <div className="border-t p-3">
              <form
                className="flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (comment.trim()) {
                    addComment(task.id);
                    setComment("");
                  }
                }}
              >
                <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment… (simulated)" className="h-9 text-sm" />
                <Button type="submit" size="icon" className="size-9 shrink-0" disabled={!comment.trim()} aria-label="Comment">
                  <Send className="size-4" />
                </Button>
              </form>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function PropLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-xs text-muted-foreground">{children}</span>;
}

function AttachmentIcon({ kind }: { kind: Attachment["kind"] }) {
  const cls = "size-4 shrink-0 text-muted-foreground";
  if (kind === "image") return <ImageIcon className={cls} />;
  if (kind === "sheet") return <SheetIcon className={cls} />;
  if (kind === "link") return <Link2 className={cls} />;
  return <FileText className={cls} />;
}

function TimelineRow({ ev, last }: { ev: TimelineEvent; last: boolean }) {
  return (
    <li className="relative flex gap-3 pb-3 last:pb-0">
      <div className="flex flex-col items-center">
        <span className="mt-1 size-2 rounded-full bg-muted-foreground/50" />
        {!last && <span className="w-px flex-1 bg-border" />}
      </div>
      <div className="min-w-0 flex-1 pb-1 text-xs">
        <span className="font-medium text-foreground">{ev.actorInitials}</span>{" "}
        <span className="text-muted-foreground">{ev.text}</span>
        <span className="text-muted-foreground/60"> · {ev.at}</span>
      </div>
    </li>
  );
}
