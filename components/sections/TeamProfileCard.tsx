"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { teamContactHref, teamDetailsHref, teamPage } from "@/data";
import type { TeamMember } from "@/data";
import { FacebookIcon, InstagramIcon, PhoneIcon, XIcon } from "@/components/ui/Icons";

const FACE = "absolute inset-0 overflow-hidden rounded-2xl [backface-visibility:hidden]";

/** Flip card: photo + name on the front, highlights, actions and socials on the back. */
export default function TeamProfileCard({ member }: { member: TeamMember }) {
  const [flipped, setFlipped] = useState(false);
  const frontRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLLIElement>(null);
  const router = useRouter();
  const { socials } = member;
  const detailsHref = teamDetailsHref(member.id);

  // Touch: tapping anywhere outside a flipped card flips it back.
  useEffect(() => {
    if (!flipped) return;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && !cardRef.current?.contains(e.target as Node)) setFlipped(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [flipped]);

  const socialLinks = [
    { label: "Facebook", href: socials.facebook, Icon: FacebookIcon },
    { label: "Instagram", href: socials.instagram, Icon: InstagramIcon },
    { label: "X", href: socials.x, Icon: XIcon },
  ].filter((s) => s.href);

  return (
    <li
      ref={cardRef}
      data-team-card
      className="aspect-[413/589] w-full max-w-[19rem] [perspective:1200px]"
      // Mouse: hovering flips to the back and leaving flips it back; then a click on the back opens
      // the details page (CursorLabel invites it). Touch/keyboard: tap or Enter flips; Esc or a
      // tap outside flips back. The name on the back is a real link for keyboard users.
      onPointerEnter={(e) => e.pointerType === "mouse" && setFlipped(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setFlipped(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape" && flipped) {
          setFlipped(false);
          requestAnimationFrame(() => frontRef.current?.focus());
        }
      }}
    >
      <div
        className={cn(
          "relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d]",
          flipped && "[transform:rotateY(180deg)]",
        )}
      >
        {/* front */}
        <div className={FACE} inert={flipped}>
          <Image
            src="/images/team/ProfileCardBG.png"
            alt=""
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 19rem"
            className="object-cover"
          />
          <Image
            src={member.image}
            alt={`${member.name}, ${member.role}`}
            width={752}
            height={828}
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 17rem"
            className="absolute left-[5%] top-[5%] h-auto w-[90%]"
          />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <h3 className="text-xl font-normal leading-tight text-white">{member.name}</h3>
            <p className="mt-1 text-xs text-white">{member.role}</p>
          </div>
          <button
            ref={frontRef}
            type="button"
            aria-label={`${teamPage.flipLabel} ${member.name}`}
            aria-expanded={flipped}
            onClick={(e) => {
              setFlipped(true);
              if (e.detail === 0) requestAnimationFrame(() => backRef.current?.focus());
            }}
            className="absolute inset-0 rounded-2xl"
          />
        </div>

        {/* back */}
        <div
          ref={backRef}
          tabIndex={-1}
          data-cursor={teamPage.cursorLabel}
          className={cn(
            FACE,
            "[transform:rotateY(180deg)] outline-none [@media(hover:hover)_and_(pointer:fine)]:cursor-none [&_a]:[@media(hover:hover)_and_(pointer:fine)]:cursor-pointer",
          )}
          inert={!flipped}
          aria-hidden={!flipped}
          onClick={(e) => {
            // Clicking the back (outside its links) opens the details page.
            if (!(e.target as Element).closest("a, button")) router.push(detailsHref);
          }}
        >
          <Image
            src="/images/team/ProfileCardBG.png"
            alt=""
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 19rem"
            className="object-cover"
          />
          <div className="absolute inset-0 flex flex-col p-5 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-normal leading-tight">
                  <Link href={detailsHref} aria-label={`${teamPage.detailsLabel}: ${member.name}`}>
                    {member.name}
                  </Link>
                </h3>
                <p className="mt-1 text-xs">{member.role}</p>
              </div>
            </div>

            <ul className="mt-6 list-disc space-y-1 pl-5 text-[13px] leading-snug marker:text-white">
              {member.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>

            <div className="mt-auto">
              <div>
                <Link
                  href={teamContactHref(member.id)}
                  className="glass btn-hover flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold"
                >
                  <PhoneIcon aria-hidden="true" className="h-4 w-4" />
                  {teamPage.contactLabel}
                </Link>
              </div>
              <ul className="mt-4 flex justify-center gap-3">
                {socialLinks.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on ${label}`}
                      className="btn-hover flex h-9 w-9 items-center justify-center rounded-full border border-white/70 text-base"
                    >
                      <Icon />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
