"use client";

import { useEffect, useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { gsap, revealTrigger } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";
import { contactForm, site, team } from "@/data";
import type { TeamMember } from "@/data";
import { ArrowUpRightIcon } from "@/components/ui/Icons";
import TextReveal from "@/components/ui/TextReveal";

type FieldName = keyof typeof contactForm.labels;
type Errors = Partial<Record<FieldName | "interest", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INPUT =
  "w-full border-b border-black/25 bg-transparent py-3 text-sm text-black outline-none transition-colors placeholder:text-black/55 focus:border-accent";

const infoRows = [
  { label: "Email", text: site.email, href: `mailto:${site.email}` },
  { label: "Phone", text: site.phone, href: `tel:${site.phone.replace(/[^+\d]/g, "")}` },
  { label: "Address", text: site.address, href: undefined },
];

export default function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const [interest, setInterest] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);

  // Arriving from a team member's "Book a Call" (/?team=<id>#contact) preselects them.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("team");
    const member = team.find((m) => m.id === id);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL is only readable after mount
    if (member) setTeamMember(member);
  }, []);

  const ref = useGsapScope<HTMLElement>(({ isReduced, root }) => {
    if (isReduced) return;
    gsap
      .timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: revealTrigger(root, "top 70%"),
      })
      .from("[data-ct-card]", { y: 60, autoAlpha: 0, duration: 0.9 })
      .from("[data-ct-info]", { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.08 }, "-=0.5")
      .from("[data-ct-form]", { y: 40, autoAlpha: 0, duration: 0.8 }, "-=0.5");
  });

  const toggle = (name: string) =>
    setInterest((cur) => (cur.includes(name) ? cur.filter((n) => n !== name) : [...cur, name]));

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const next: Errors = {};

    (Object.keys(contactForm.labels) as FieldName[]).forEach((key) => {
      const value = String(data.get(key) ?? "").trim();
      if (!value) next[key] = contactForm.errors.required;
      else if (key === "email" && !EMAIL_RE.test(value)) next[key] = contactForm.errors.email;
    });
    if (interest.length === 0) next.interest = contactForm.errors.interest;

    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = (Object.keys(contactForm.labels) as FieldName[]).find((k) => next[k]);
      if (first) form.querySelector<HTMLElement>(`#contact-${first}`)?.focus();
      return;
    }

    // Frontend-only project: no network request. Show the success state.
    form.reset();
    setTeamMember(null);
    setInterest([]);
    setSent(true);
  };

  const field = (name: FieldName) => ({
    id: `contact-${name}`,
    name,
    placeholder: contactForm.labels[name],
    "aria-label": contactForm.labels[name],
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
  });
  const cls = (name: FieldName, extra?: string) =>
    cn(INPUT, errors[name] && "border-accent", extra);
  const err = (name: FieldName) =>
    errors[name] && (
      <p id={`contact-${name}-error`} role="alert" className="mt-1 text-xs text-accent">
        {errors[name]}
      </p>
    );

  return (
    <section
      ref={ref}
      id="contact"
      aria-labelledby="contact-title"
      className="px-(--page-margin) py-12 lg:py-20"
    >
      <div
        data-ct-card
        className="mx-auto max-w-[1280px] rounded-[2rem] bg-[#f4f1ec] p-6 text-black sm:p-10 lg:p-14"
      >
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* intro + contact lines */}
          <div>
            <p
              data-ct-info
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent"
            >
              {contactForm.eyebrow}
            </p>
            <h2
              id="contact-title"
              className="mt-3 text-[clamp(2rem,4.4vw,3.75rem)] font-semibold leading-[1.05] tracking-tight"
            >
              <TextReveal as="span" text={contactForm.heading} className="inline" />
            </h2>
            <p
              data-ct-info
              className="mt-3 text-[clamp(1.125rem,1.8vw,1.5rem)] font-medium tracking-tight"
            >
              {contactForm.withLabel}{" "}
              {teamMember ? (
                <>
                  {teamMember.role} <span aria-hidden="true">·</span>{" "}
                  <span className="text-accent">{teamMember.name}</span>
                </>
              ) : (
                <span className="text-accent">{contactForm.teamDefault}</span>
              )}
            </p>

            <ul className="mt-10 max-w-md text-sm font-medium">
              {infoRows.map((r) => (
                <li key={r.label} data-ct-info className="border-b border-black/20 py-3">
                  <span className="sr-only">{r.label}: </span>
                  {r.href ? (
                    <a href={r.href} className="hover:text-accent">
                      {r.text}
                    </a>
                  ) : (
                    r.text
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* form */}
          <div data-ct-form className="rounded-3xl bg-white p-6 sm:p-8">
            {sent ? (
              <div role="status">
                <p className="text-2xl font-semibold">{contactForm.successTitle}</p>
                <p className="mt-2 text-black/70">{contactForm.successMessage}</p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-6 text-sm font-semibold text-accent hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-5">
                <fieldset>
                  <legend className="text-xs font-semibold">{contactForm.interestLabel}</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {contactForm.interests.map((t) => {
                      const on = interest.includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggle(t)}
                          className={cn(
                            "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
                            on
                              ? "border-black bg-black text-white"
                              : "border-black/25 text-black hover:border-black",
                          )}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                  {errors.interest && (
                    <p role="alert" className="mt-1 text-xs text-accent">
                      {errors.interest}
                    </p>
                  )}
                </fieldset>

                <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  <div>
                    <input type="text" autoComplete="name" {...field("name")} className={cls("name")} />
                    {err("name")}
                  </div>
                  <div>
                    <input
                      type="email"
                      autoComplete="email"
                      {...field("email")}
                      className={cls("email")}
                    />
                    {err("email")}
                  </div>
                </div>
                <div>
                  <input type="text" {...field("subject")} className={cls("subject")} />
                  {err("subject")}
                </div>
                <div>
                  <textarea
                    rows={4}
                    {...field("message")}
                    className={cls("message", "resize-none")}
                  />
                  {err("message")}
                </div>

                <button
                  type="submit"
                  className="flex h-14 w-full items-center justify-between rounded-full bg-accent pl-7 pr-2 text-sm font-semibold text-white btn-hover border border-transparent hover:border-accent! focus-visible:border-accent! focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  data-magnetic="0.06"
                >
                  {contactForm.submitLabel}
                  <span data-btn-icon className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
                    <ArrowUpRightIcon aria-hidden="true" className="h-5 w-5" />
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
