"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Send,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

interface ProjectItem {
  id: string;
  orderNumber: string;
  title: string;
  planName: string;
  currentStage: number; // 1 to 5
  targetDays: number;
  startDate: string;
  stagingUrl: string;
  liveUrl?: string;
  deliverables: { name: string; completed: boolean }[];
}

const DEMO_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    orderNumber: "WSP-100234",
    title: "Corporate Growth Business Website",
    planName: "Classic Growth Website Plan",
    currentStage: 2,
    targetDays: 7,
    startDate: "17 Oct 2026",
    stagingUrl: "https://staging.webspyra.com/wsp-100234",
    deliverables: [
      { name: "Free .com Domain Name Registered", completed: true },
      { name: "Cloud Server Hosting Node Bound", completed: true },
      { name: "SSL Certificate & DNS Setup", completed: true },
      { name: "UI/UX Wireframes & Figma Approval", completed: false },
      { name: "Next.js 14 Code & Framer Motion", completed: false },
      { name: "SEO Sitemap & Google Search Indexing", completed: false },
    ],
  },
];

const STAGE_NAMES = [
  "Brief Received",
  "UI/UX Design",
  "Development",
  "Client Review",
  "Live & Launched",
];

export default function ProjectsPage() {
  const { success } = useToast();
  const [projects] = useState<ProjectItem[]>(DEMO_PROJECTS);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState("");
  const [isSubmittingRevision, setIsSubmittingRevision] = useState(false);

  const handleSendRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionNotes.trim()) return;
    setIsSubmittingRevision(true);
    setTimeout(() => {
      setIsSubmittingRevision(false);
      setIsRevisionModalOpen(false);
      setRevisionNotes("");
      success("Feedback Logged", "Your dedicated project architect has received your notes.");
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Projects & Milestones
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track real-time architectural progress, staging builds, and milestone deliverables.
          </p>
        </div>

        <Link href="/checkout">
          <Button variant="primary" size="md" className="shadow-glow" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Start New Website Project
          </Button>
        </Link>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {projects.map((proj) => (
          <GlassCard key={proj.id} glowColor="blue" className="p-6 sm:p-8 space-y-6">
            {/* Top Row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-xl font-bold text-slate-900">
                    {proj.title}
                  </h2>
                  <Badge variant="mint" pulseDot>
                    {STAGE_NAMES[proj.currentStage - 1]}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Package: <strong>{proj.planName}</strong> • Order ID: <strong>{proj.orderNumber}</strong> • Started: {proj.startDate}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={proj.stagingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                >
                  <span>Staging Preview URL</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsRevisionModalOpen(true)}
                >
                  Request Edits
                </Button>
              </div>
            </div>

            {/* 5-Stage Animated Timeline */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Progress Stage: {proj.currentStage} of 5</span>
                <span className="text-accent">Estimated Handover in 5 Days</span>
              </div>

              {/* Progress Line */}
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(proj.currentStage / 5) * 100}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-accent-grad rounded-full shadow-glow"
                />
              </div>

              {/* Milestones Stepper Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
                {STAGE_NAMES.map((name, idx) => {
                  const stageNum = idx + 1;
                  const isCompleted = stageNum < proj.currentStage;
                  const isActive = stageNum === proj.currentStage;

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        isActive
                          ? "bg-accent/5 border-accent ring-2 ring-accent/20"
                          : isCompleted
                          ? "bg-mint-light/40 border-mint"
                          : "bg-white/60 border-slate-100 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                            isCompleted
                              ? "bg-success text-white"
                              : isActive
                              ? "bg-accent text-white shadow-glow"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {isCompleted ? "✓" : stageNum}
                        </span>
                        {isActive && <span className="w-2 h-2 rounded-full bg-accent animate-ping" />}
                      </div>
                      <p className="font-bold text-xs text-slate-900">{name}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Deliverables Checklist */}
            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Project Deliverables Scope:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-slate-600">
                {proj.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {item.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className={item.completed ? "font-medium text-slate-800" : ""}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Architect Contact Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Assigned Architect: <strong>Vikram Malhotra</strong> (Senior Full-Stack Lead)</span>
              </span>

              <a
                href={`https://wa.me/919876543210?text=Hi%20Vikram,%20regarding%20project%20${proj.orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent font-semibold hover:underline flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Direct WhatsApp Chat
              </a>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Revision Request Modal */}
      <Modal
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        title="Submit Milestone Feedback or Revisions"
        description="Share any changes you would like our design and engineering team to implement."
      >
        <form onSubmit={handleSendRevision} className="space-y-4 pt-2">
          <Textarea
            label="Revision Notes or Design Feedback *"
            placeholder="e.g. Please update hero banner heading typography to DM Sans and change secondary button to mint pastel..."
            rows={4}
            value={revisionNotes}
            onChange={(e) => setRevisionNotes(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsRevisionModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmittingRevision}
              rightIcon={<Send className="w-4 h-4" />}
            >
              Submit Feedback
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
